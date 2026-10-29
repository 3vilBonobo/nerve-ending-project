import { FILES } from '../content';
import { INTENTS, Interpretation, IntentInterpreter, QueryContext } from '../models';
import { classify } from './fallback';
import { DIALOGUE_IDS } from './dialogue-catalog';
import { FRESH_INTENTS } from './fresh-topics';
import { MOTHER_INTENTS } from './mother-routing';
export { BrowserAIInterpreter } from './browser-ai';

export function validateInterpretation(value: unknown, provider: Interpretation['provider']): Interpretation | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const candidate = value as Record<string, unknown>;
  if ((!INTENTS.includes(candidate['intent'] as typeof INTENTS[number]) && !DIALOGUE_IDS.has(String(candidate['intent'])) && !FRESH_INTENTS.has(String(candidate['intent'])) && !MOTHER_INTENTS.has(String(candidate['intent'])) && !/^q_case_[a-z_]+$/.test(String(candidate['intent']))) || typeof candidate['needsClarification'] !== 'boolean') return undefined;
  if (candidate['entityId'] !== undefined && !/^service-00[1-8]$/.test(String(candidate['entityId']))) return undefined;
  if (candidate['fileId'] !== undefined && !FILES.some(file => file.id === candidate['fileId'] && !file.locked)) return undefined;
  const intent = candidate['intent'] as Interpretation['intent'];
  if (intent === 'request_file' && typeof candidate['fileId'] !== 'string') return undefined;
  if (intent === 'request_search' && (typeof candidate['searchTerm'] !== 'string' || candidate['searchTerm'].length > 150)) return undefined;
  return {
    intent, provider, needsClarification: candidate['needsClarification'],
    ...(provider === 'browser-ai' ? { method: candidate['method'] === 'deterministic' ? 'deterministic' as const : 'semantic' as const } : provider === 'fallback' ? { method: 'deterministic' as const } : {}),
    entityId: candidate['entityId'] as string | undefined,
    fileId: candidate['fileId'] as string | undefined,
    searchTerm: typeof candidate['searchTerm'] === 'string' ? candidate['searchTerm'].slice(0, 150) : undefined,
    ...(['identity','headquarters','server','local-save','biological','live-monitor','kell'].includes(String(candidate['subject'])) ? { subject: candidate['subject'] as Interpretation['subject'] } : {}),
    ...(Array.isArray(candidate['choices']) ? { choices: candidate['choices'].filter(c => c && (INTENTS.includes(c.intent) || DIALOGUE_IDS.has(c.intent) || FRESH_INTENTS.has(c.intent) || MOTHER_INTENTS.has(c.intent)) && typeof c.label === 'string').slice(0, 2).map(c => ({ intent: c.intent, label: c.label.slice(0, 150) })) } : {}),
    ...(typeof candidate['clarification'] === 'string' ? { clarification: candidate['clarification'].slice(0, 180) } : {}),
    ...(typeof candidate['confidence'] === 'number' && Number.isFinite(candidate['confidence']) && candidate['confidence'] >= 0 && candidate['confidence'] <= 1 ? { confidence: candidate['confidence'] } : {}),
  };
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
        { role: 'system', content: `Classify a records query. Return JSON with intent, needsClarification (boolean), optional entityId (service-001 through service-008), fileId or searchTerm. Allowed intents: ${INTENTS.join(', ')}. Use request_backup only for an explicit request to open or read a backup. Use request_stop only for an explicit stop request. No facts, prose or actions. Available file IDs: ${FILES.filter(f => !f.locked).map(f => f.id).join(', ')}. Context: ${JSON.stringify(context)}` },
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

export type FallbackReason = 'no-provider' | 'unavailable' | 'timeout' | 'invalid-result' | 'provider-error';
export interface InterpretationMetrics { elapsedMs: number; fallback: boolean; provider: string; fallbackReason?: FallbackReason }
export async function interpretSafely(input: string, context: QueryContext, provider?: IntentInterpreter, timeoutMs = 6500): Promise<{ interpretation: Interpretation; metrics: InterpretationMetrics }> {
  const started = performance.now();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let interpretation: Interpretation;
  let fallbackReason: FallbackReason = provider ? 'provider-error' : 'no-provider';
  try {
    if (!provider) throw new Error('Offline mode');
    interpretation = await Promise.race([
      (async () => {
        if (!await provider.isAvailable()) { fallbackReason = 'unavailable'; throw new Error('Unavailable'); }
        const value = await provider.interpret(input, { ...context });
        const validated = validateInterpretation(value, value.provider);
        if (!validated || validated.intent === 'unknown' && validated.provider !== 'browser-ai') { fallbackReason = 'invalid-result'; throw new Error('Invalid or unknown'); }
        return validated;
      })(),
      new Promise<never>((_, reject) => { timer = setTimeout(() => { fallbackReason = 'timeout'; reject(new Error('Timeout')); }, timeoutMs); }),
    ]);
  } catch {
    interpretation = classify(input, context);
  } finally { clearTimeout(timer); }
  return { interpretation, metrics: { elapsedMs: performance.now() - started, fallback: interpretation.provider === 'fallback', provider: interpretation.provider, ...(interpretation.provider === 'fallback' ? { fallbackReason } : {}) } };
}
