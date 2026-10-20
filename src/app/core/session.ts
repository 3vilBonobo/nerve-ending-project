import { Injectable, OnDestroy, computed, inject, isDevMode, signal } from '@angular/core';
import { accessibleFiles, inspectFile, newGame, recover, runInput } from './engine/game';
import { parseCommand } from './engine/commands';
import { IntentInterpreter, TerminalMode } from './models';
import { loadSave, resetSave, writeSave } from './persistence/saves';
import { InterpretationMetrics, interpretSafely } from './interpretation/providers';
import { TerminalPlayback } from './presentation/terminal-playback';
import { LocalLanguage } from './interpretation/local-language';
import { availableOperations, OPERATION_DEFINITIONS, parseOperation } from './engine/continuation';

@Injectable({ providedIn: 'root' })
export class Session implements OnDestroy {
  private readonly storage = {
    getItem: (key: string) => window.localStorage.getItem(key),
    setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
    removeItem: (key: string) => window.localStorage.removeItem(key),
  };
  private readonly initial = loadSave(this.storage);
  readonly state = signal(this.initial.state);
  readonly storageWarning = signal(this.initial.warning ?? '');
  readonly playback = inject(TerminalPlayback);
  readonly language = inject(LocalLanguage);
  readonly busy = this.playback.busy;
  readonly files = computed(() => accessibleFiles(this.state()));
  readonly operations = computed(() => availableOperations(this.state()));
  readonly pending = computed(() => OPERATION_DEFINITIONS.find(o => o.id === this.state().pendingOperation));
  readonly metrics = signal<InterpretationMetrics[]>([]);
  readonly developerMode = isDevMode();
  provider?: IntentInterpreter;
  private requestId = 0;

  persist(): void {
    this.storageWarning.set(writeSave(this.storage, this.state()) ? '' : 'Browser storage is unavailable or full. The session will continue in memory.');
  }
  start(): void { this.state.update(state => ({ ...state, hasStarted: true })); this.persist(); }
  async submit(input: string): Promise<void> {
    if (this.busy() || !input.trim()) return;
    const request = ++this.requestId;
    const pause = this.playback.begin(input.trim());
    try {
      const current = this.state();
      const [result] = await Promise.all([
        parseCommand(input) || parseOperation(input) ? undefined : interpretSafely(input, { lastTopic: current.lastTopic, lastFileId: current.openFileIds.at(-1) ?? current.lastFileId, lastIntent: current.lastIntent }, this.provider ?? this.language.provider),
        pause,
      ]);
      if (request !== this.requestId) return;
      if (result) this.metrics.update(metrics => [...metrics, result.metrics].slice(-100));
      const transition = runInput(this.state(), input, result?.interpretation);
      const printing = this.playback.print(transition.state.terminalHistory.at(-1)!);
      this.state.set(transition.openFileId ? { ...transition.state, ui: { ...transition.state.ui, terminalMode: 'restored' } } : transition.state);
      this.persist();
      await printing;
    } finally { if (request === this.requestId) this.playback.cancel(); }
  }
  openFile(id: string): void { this.state.set(inspectFile(this.state(), id).state); this.persist(); }
  readBackup(): void { this.state.set(recover(this.state()).state); this.persist(); }
  closeFile(id: string): void { this.state.update(state => ({ ...state, openFileIds: state.openFileIds.filter(file => file !== id) })); this.persist(); }
  focusFile(id: string): void { this.state.update(state => ({ ...state, openFileIds: [...state.openFileIds.filter(file => file !== id), id] })); this.persist(); }
  directory(path: string): void { this.state.set(runInput(this.state(), `CD ${path}`).state); this.persist(); }
  terminalMode(mode: TerminalMode): void { this.state.update(state => ({ ...state, ui: { ...state.ui, terminalMode: mode } })); this.persist(); }
  display(crtEnabled: boolean, fontScale: number): void { this.state.update(state => ({ ...state, ui: { ...state.ui, crtEnabled, fontScale } })); this.persist(); }
  reset(): void {
    this.requestId++; this.playback.cancel();
    const removed = resetSave(this.storage);
    this.state.set(newGame()); this.provider = undefined; this.metrics.set([]);
    if (removed) this.persist();
    else this.storageWarning.set('Browser storage could not be cleared. This new session is running in memory.');
  }
  ngOnDestroy(): void { this.requestId++; this.playback.cancel(); }
}
