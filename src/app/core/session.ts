import { Injectable, computed, isDevMode, signal } from '@angular/core';
import { accessibleFiles, inspectFile, newGame, runInput } from './engine/game';
import { parseCommand } from './engine/commands';
import { IntentInterpreter, TerminalMode } from './models';
import { loadSave, resetSave, writeSave } from './persistence/saves';
import { InterpretationMetrics, interpretSafely } from './interpretation/providers';

@Injectable({ providedIn: 'root' })
export class Session {
  private readonly storage = {
    getItem: (key: string) => window.localStorage.getItem(key),
    setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
    removeItem: (key: string) => window.localStorage.removeItem(key),
  };
  private readonly initial = loadSave(this.storage);
  readonly state = signal(this.initial.state);
  readonly storageWarning = signal(this.initial.warning ?? '');
  readonly busy = signal(false);
  readonly files = computed(() => accessibleFiles(this.state()));
  readonly metrics = signal<InterpretationMetrics[]>([]);
  readonly developerMode = isDevMode();
  provider?: IntentInterpreter;

  persist(): void {
    this.storageWarning.set(writeSave(this.storage, this.state()) ? '' : 'Browser storage is unavailable or full. The session will continue in memory.');
  }
  start(): void { this.state.update(state => ({ ...state, hasStarted: true })); this.persist(); }
  async submit(input: string): Promise<void> {
    if (this.busy() || !input.trim()) return;
    this.busy.set(true);
    try {
      const current = this.state();
      const result = parseCommand(input) ? undefined : await interpretSafely(input, { lastTopic: current.lastTopic, lastFileId: current.lastFileId, lastIntent: current.lastIntent }, this.provider);
      if (result) this.metrics.update(metrics => [...metrics, result.metrics].slice(-100));
      const transition = runInput(this.state(), input, result?.interpretation);
      this.state.set(transition.openFileId ? { ...transition.state, ui: { ...transition.state.ui, terminalMode: 'restored' } } : transition.state);
      this.persist();
    } finally { this.busy.set(false); }
  }
  openFile(id: string): void { this.state.set(inspectFile(this.state(), id).state); this.persist(); }
  closeFile(id: string): void { this.state.update(state => ({ ...state, openFileIds: state.openFileIds.filter(file => file !== id) })); this.persist(); }
  focusFile(id: string): void { this.state.update(state => ({ ...state, openFileIds: [...state.openFileIds.filter(file => file !== id), id] })); this.persist(); }
  directory(path: string): void { this.state.set(runInput(this.state(), `CD ${path}`).state); this.persist(); }
  terminalMode(mode: TerminalMode): void { this.state.update(state => ({ ...state, ui: { ...state.ui, terminalMode: mode } })); this.persist(); }
  display(crtEnabled: boolean, fontScale: number): void { this.state.update(state => ({ ...state, ui: { ...state.ui, crtEnabled, fontScale } })); this.persist(); }
  reset(): void {
    const removed = resetSave(this.storage);
    this.state.set(newGame()); this.provider = undefined; this.metrics.set([]);
    this.storageWarning.set(removed ? '' : 'Browser storage could not be cleared. This new session is running in memory.');
  }
}
