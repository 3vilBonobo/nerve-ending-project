import { Interpretation, IntentInterpreter, QueryContext } from '../models';
import { directInterpretation } from './semantic';
import { LanguageRequest, LanguageResponse, LanguageState, emptyLanguageState } from './language-protocol';

export interface LanguageWorker {
  postMessage(message: LanguageRequest): void;
  terminate(): void;
  onmessage: ((event: MessageEvent<LanguageResponse>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
}
type Pending = { resolve: (value: Interpretation) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> };

export class BrowserAIInterpreter implements IntentInterpreter {
  readonly id = 'browser-ai';
  private worker?: LanguageWorker;
  private state = emptyLanguageState();
  private nextId = 0;
  private pending = new Map<number, Pending>();
  private loadTimer?: ReturnType<typeof setTimeout>;
  constructor(private readonly changed: (state: LanguageState) => void = () => {}, private readonly factory: () => LanguageWorker = () => new Worker(new URL('./language.worker', import.meta.url), { type: 'module' })) {}
  private update(patch: Partial<LanguageState>): void { this.state = { ...this.state, ...patch }; this.changed(this.state); }
  load(root: string): void {
    if (this.worker) return;
    this.update({ ...emptyLanguageState(), phase: 'loading' });
    try {
      this.worker = this.factory();
      this.worker.onmessage = ({ data }) => this.receive(data);
      this.worker.onerror = () => this.fail();
      this.loadTimer = setTimeout(() => this.fail(), 180_000);
      this.worker.postMessage({ type: 'load', root });
    } catch { this.fail(); }
  }
  private receive(message: LanguageResponse): void {
    if (!this.worker) return;
    if (message.type === 'progress') this.update({ phase: 'loading', loaded: message.loaded, total: message.total, cached: message.cached });
    else if (message.type === 'initializing') this.update({ phase: 'initializing' });
    else if (message.type === 'ready') { clearTimeout(this.loadTimer); this.update({ phase: 'ready', loadMs: message.loadMs, persistent: message.persistent }); }
    else if (message.type === 'error') this.fail();
    else {
      const request = this.pending.get(message.id);
      if (!request) return;
      this.pending.delete(message.id); clearTimeout(request.timer);
      this.update({ lastQueryMs: message.elapsedMs }); request.resolve(message.interpretation);
    }
  }
  async isAvailable(): Promise<boolean> { return this.state.phase === 'ready'; }
  async interpret(input: string, context: QueryContext): Promise<Interpretation> {
    if (!await this.isAvailable() || !this.worker) throw new Error('Question model is not ready.');
    const direct = directInterpretation(input, context);
    if (direct) return direct;
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => this.fail(), 5000);
      this.pending.set(id, { resolve, reject, timer });
      this.worker!.postMessage({ type: 'query', id, input: input.slice(0, 1000), context: { ...context } });
    });
  }
  private fail(): void { this.stop(); this.update({ phase: 'error' }); }
  private stop(): void {
    clearTimeout(this.loadTimer);
    this.worker?.terminate(); this.worker = undefined;
    for (const request of this.pending.values()) { clearTimeout(request.timer); request.reject(new Error('Question model stopped.')); }
    this.pending.clear();
  }
  dispose(): void { this.stop(); this.update(emptyLanguageState()); }
}
