import { FILES } from '../content';
import { INTENTS, Interpretation, IntentInterpreter, QueryContext } from '../models';
import { classify } from './fallback';

export function validateInterpretation(value: unknown, provider: Interpretation['provider']): Interpretation | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const candidate = value as Record<string, unknown>;
  if (!INTENTS.includes(candidate['intent'] as Interpretation['intent']) || typeof candidate['needsClarification'] !== 'boolean') return undefined;
  if (candidate['entityId'] !== undefined && candidate['entityId'] !== 'service-006') return undefined;
  if (candidate['fileId'] !== undefined && !FILES.some(file => file.id === candidate['fileId'] && !file.locked)) return undefined;
  const intent = candidate['intent'] as Interpretation['intent'];
  if (intent === 'request_file' && typeof candidate['fileId'] !== 'string') return undefined;
  if (intent === 'request_search' && (typeof candidate['searchTerm'] !== 'string' || candidate['searchTerm'].length > 150)) return undefined;
  return {
    intent, provider, needsClarification: candidate['needsClarification'],
    entityId: candidate['entityId'] as string | undefined,
    fileId: candidate['fileId'] as string | undefined,
    searchTerm: typeof candidate['searchTerm'] === 'string' ? candidate['searchTerm'].slice(0, 150) : undefined,
  };
}

/** Honest extension point: no runtime or model weights are bundled. */
export class BrowserAIInterpreter implements IntentInterpreter {
  readonly id = 'browser-ai';
  async isAvailable(): Promise<boolean> { return false; }
  async interpret(): Promise<Interpretation> { throw new Error('No browser model has been integrated or tested.'); }
}

export class OllamaInterpreter implements IntentInterpreter {
  readonly id = 'ollama';
  constructor(private readonly endpoint: string, private readonly model: string) {
    const url = new URL(endpoint);
    if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || !['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Developer endpoint must use a loopback address.');
    }
  }
  async isAvailable(): Promise<boolean> { return !!this.model.trim(); }
  async interpret(input: string, context: QueryContext): Promise<Interpretation> {
    const response = await fetch(`${this.endpoint.replace(/\/$/, '')}/api/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(6000),
      body: JSON.stringify({ model: this.model, stream: false, format: 'json', options: { temperature: 0 }, messages: [
        { role: 'system', content: `Classify an archive query. Return JSON with intent, needsClarification (boolean), optional entityId (only service-006), fileId or searchTerm. Allowed intents: ${INTENTS.join(', ')}. No facts, prose or actions. Available file IDs: ${FILES.filter(f => !f.locked).map(f => f.id).join(', ')}. Context: ${JSON.stringify(context)}` },
        { role: 'user', content: input.slice(0, 1000) },
      ] }),
    });
    if (!response.ok) throw new Error(`Local classifier HTTP ${response.status}`);
    const body: unknown = await response.json();
    const content = (body as { message?: { content?: string } }).message?.content;
    const result = validateInterpretation(JSON.parse(content ?? '{}'), 'ollama');
    if (!result) throw new Error('Local classifier returned an invalid intent.');
    return result;
  }
}

export interface InterpretationMetrics { elapsedMs: number; fallback: boolean; provider: string }
export async function interpretSafely(input: string, context: QueryContext, provider?: IntentInterpreter, timeoutMs = 6500): Promise<{ interpretation: Interpretation; metrics: InterpretationMetrics }> {
  const started = performance.now();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let interpretation: Interpretation;
  try {
    if (!provider) throw new Error('Offline mode');
    interpretation = await Promise.race([
      (async () => {
        if (!await provider.isAvailable()) throw new Error('Unavailable');
        const value = await provider.interpret(input, { ...context });
        const validated = validateInterpretation(value, value.provider);
        if (!validated || validated.intent === 'unknown') throw new Error('Invalid or unknown');
        return validated;
      })(),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Timeout')), timeoutMs); }),
    ]);
  } catch {
    interpretation = classify(input, context);
  } finally { clearTimeout(timer); }
  return { interpretation, metrics: { elapsedMs: performance.now() - started, fallback: interpretation.provider === 'fallback', provider: interpretation.provider } };
}
