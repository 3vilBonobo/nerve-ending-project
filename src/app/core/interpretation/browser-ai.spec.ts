import { afterEach, describe, expect, it, vi } from 'vitest';
import { BrowserAIInterpreter, LanguageWorker } from './browser-ai';
import { LanguageRequest, LanguageResponse, LanguageState } from './language-protocol';
import { interpretSafely } from './providers';
import { directInterpretation, recognitionText, selectMeaning } from './semantic';

class FakeWorker implements LanguageWorker {
  onmessage: ((event: MessageEvent<LanguageResponse>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  sent: LanguageRequest[] = [];
  terminated = false;
  postMessage(message: LanguageRequest): void { this.sent.push(message); }
  terminate(): void { this.terminated = true; }
  emit(message: LanguageResponse): void { this.onmessage?.({ data: message } as MessageEvent<LanguageResponse>); }
}
afterEach(() => vi.useRealTimers());
describe('local model lifecycle', () => {
  it('reports actual byte progress and waits for warmup before becoming available', async () => {
    const worker = new FakeWorker(); const states: LanguageState[] = [];
    const provider = new BrowserAIInterpreter(state => states.push(state), () => worker);
    expect(await provider.isAvailable()).toBe(false);
    provider.load('http://localhost/language/v1/');
    worker.emit({ type: 'progress', loaded: 9, total: 20, cached: false });
    expect(states.at(-1)).toMatchObject({ phase: 'loading', loaded: 9, total: 20 });
    worker.emit({ type: 'initializing', detail: 'Preparing processor' });
    expect(await provider.isAvailable()).toBe(false);
    worker.emit({ type: 'ready', loadMs: 1200, persistent: true });
    expect(await provider.isAvailable()).toBe(true);
    expect(states.at(-1)?.loadMs).toBe(1200); provider.dispose();
  });
  it('routes answers by request ID and passes a copy of the current context', async () => {
    const worker = new FakeWorker(); const provider = new BrowserAIInterpreter(() => {}, () => worker);
    provider.load('http://localhost/language/v1/'); worker.emit({ type: 'ready', loadMs: 50, persistent: false });
    const context = { lastTopic: 'service-005' };
    const query = provider.interpret('Did everyone leave for good?', context);
    await Promise.resolve();
    const sent = worker.sent.at(-1);
    expect(sent).toMatchObject({ type: 'query', context });
    worker.emit({ type: 'result', id: (sent as { id: number }).id, interpretation: { intent: 'ask_office', needsClarification: false, provider: 'browser-ai' }, elapsedMs: 18 });
    expect((await query).intent).toBe('ask_office'); provider.dispose();
  });
  it('cancels the worker, rejects pending work and ignores late results', async () => {
    const worker = new FakeWorker(); const provider = new BrowserAIInterpreter(() => {}, () => worker);
    provider.load('http://localhost/language/v1/'); worker.emit({ type: 'ready', loadMs: 50, persistent: true });
    const query = provider.interpret('Who is employed here nowadays?', {}); await Promise.resolve();
    const checked = expect(query).rejects.toThrow('stopped');
    provider.dispose(); await checked;
    worker.emit({ type: 'ready', loadMs: 10, persistent: true });
    expect(await provider.isAvailable()).toBe(false); expect(worker.terminated).toBe(true);
  });
  it('returns the basic interpreter after an actual provider timeout', async () => {
    vi.useFakeTimers(); const worker = new FakeWorker();
    const provider = new BrowserAIInterpreter(() => {}, () => worker);
    provider.load('http://localhost/language/v1/'); worker.emit({ type: 'ready', loadMs: 50, persistent: true });
    const result = interpretSafely('Is anyone there?', {}, provider);
    await vi.advanceTimersByTimeAsync(5001);
    expect((await result).interpretation.intent).toBe('ask_office');
    expect((await result).metrics.fallback).toBe(true); expect(worker.terminated).toBe(true);
  });
  it('keeps a deliberate unknown local result instead of applying a broad keyword fallback', async () => {
    const result = await interpretSafely('What does a new phone cost?', {}, { id: 'browser-ai', isAvailable: async () => true, interpret: async () => ({ intent: 'unknown', needsClarification: false, provider: 'browser-ai' }) });
    expect(result.interpretation.intent).toBe('unknown'); expect(result.metrics.fallback).toBe(false);
  });
});
describe('question boundaries and context', () => {
  it('clarifies close meanings and never turns similarity into a file operation', () => {
    expect(selectMeaning('Was anyone responsible?', {}, [{ intent: 'ask_staff', score: .7 }, { intent: 'ask_authorization', score: .69 }])).toMatchObject({ intent: 'unknown', needsClarification: true });
    expect(selectMeaning('Something about files', {}, [{ intent: 'ask_transfer', score: .3 }])).toMatchObject({ intent: 'unknown', needsClarification: false });
  });
  it('resolves a selected file and numbered service follow-up without inventing a subject', () => {
    expect(directInterpretation('Show me that file', { lastFileId: 'company' })).toMatchObject({ intent: 'request_file', fileId: 'company' });
    expect(directInterpretation('Show me that file', {})).toMatchObject({ needsClarification: true });
    expect(directInterpretation('And five?', { lastIntent: 'ask_service_status' })).toMatchObject({ intent: 'ask_service_status', entityId: 'service-005' });
    expect(directInterpretation('Who signed it?', {})).toMatchObject({ needsClarification: true });
  });
  it('repairs question vocabulary but preserves numbers and paths', () => {
    expect(recognitionText('Who aproved the shutdown?')).toBe('who approved the shutdown');
    expect(recognitionText('Find /ARCHIVE/RECIEPT_0417.TXT')).toContain('/archive/reciept_0417.txt');
  });
  it('keeps informational backup questions separate from a read request', () => {
    expect(directInterpretation('Is a backup available?', {})).toBeUndefined();
    expect(directInterpretation('Read the backup', {})).toMatchObject({ intent: 'request_backup' });
  });
});
