import { Injectable, OnDestroy, computed, inject, isDevMode, signal } from '@angular/core';
import { accessibleFiles, inspectFile, newGame, runInput } from './engine/game';
import { parseCommand } from './engine/commands';
import { IntentInterpreter, TerminalMode } from './models';
import { loadSave, resetSave, writeSave } from './persistence/saves';
import { InterpretationMetrics, interpretSafely } from './interpretation/providers';
import { TerminalPlayback } from './presentation/terminal-playback';
import { LocalLanguage } from './interpretation/local-language';
import { availableOperations, OPERATION_DEFINITIONS, parseOperation } from './engine/continuation';
import { QaTelemetry } from './qa/telemetry';
import type { QaInteraction } from './qa/events';
import type { QaSource } from './qa/types';
import { SCENE_MESSAGES } from './scenario-records';
import { rememberFactual } from './engine/mother-conversation';

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
  readonly qa = inject(QaTelemetry);
  readonly busy = this.playback.busy;
  readonly files = computed(() => accessibleFiles(this.state()));
  readonly operations = computed(() => availableOperations(this.state()));
  readonly pending = computed(() => OPERATION_DEFINITIONS.find(o => o.id === this.state().pendingOperation));
  readonly scenarioPreview = computed(()=>{
    const choice=this.state().scenario?.pendingChoice;
    return choice?SCENE_MESSAGES[choice==='severance'?'M13':'M12'][0]:'';
  });
  readonly metrics = signal<InterpretationMetrics[]>([]);
  readonly developerMode = isDevMode();
  provider?: IntentInterpreter;
  private requestId = 0;
  private activeInteraction?: QaInteraction;

  constructor() { this.qa.observe(this.state()); }

  persist(): void {
    this.storageWarning.set(writeSave(this.storage, this.state()) ? '' : 'Browser storage is unavailable or full. The session will continue in memory.');
  }
  start(): void { this.state.update(state => ({ ...state, hasStarted: true })); this.qa.record(this.state(), 'session_started'); this.persist(); }
  resume(): void { this.qa.record(this.state(), 'session_resumed', { reason: 'resume-click' }); }
  async submit(input: string, source: QaSource = 'terminal'): Promise<void> {
    if (this.busy() || !input.trim()) return;
    const request = ++this.requestId;
    const interaction = this.qa.beginInput(input, this.state(), source);
    this.activeInteraction = interaction;
    const pause = this.playback.begin(input.trim());
    try {
      const current = this.state();
      const [result] = await Promise.all([
        parseCommand(input) || parseOperation(input) ? undefined : interpretSafely(input, { lastTopic: current.lastTopic, lastFileId: current.openFileIds.at(-1) ?? current.lastFileId, lastIntent: current.lastIntent, scenarioVersion:current.scenario?.version, conversationSubject:current.conversation?.lastFactual?.subject }, this.provider ?? this.language.provider),
        pause,
      ]);
      if (request !== this.requestId) return;
      if (result) this.metrics.update(metrics => [...metrics, result.metrics].slice(-100));
      const before = this.state();
      const transition = runInput(before, input, result?.interpretation);
      this.qa.finishInput(interaction, before, transition, result);
      this.activeInteraction = undefined;
      const printing = this.playback.print(transition.state.terminalHistory.at(-1)!);
      this.state.set(transition.openFileId ? { ...transition.state, ui: { ...transition.state.ui, terminalMode: 'restored' } } : transition.state);
      this.persist();
      await printing;
    } catch (error) {
      this.qa.interrupt(this.activeInteraction, this.state(), 'input-error'); throw error;
    } finally { if (request === this.requestId) { this.activeInteraction = undefined; this.playback.cancel(); } }
  }
  openFile(id: string, source: QaSource = 'record-link'): void { const before = this.state(); const transition = rememberFactual(before,inspectFile(before,id)); this.qa.transition(before,transition, 'OPEN RECORD',source,id); this.state.set(transition.state); this.persist(); }
  closeFile(id: string): void { this.state.update(state => ({ ...state, openFileIds: state.openFileIds.filter(file => file !== id) })); this.qa.record(this.state(),'file_closed',{fileId:id},'record-tab'); this.persist(); }
  focusFile(id: string): void { this.state.update(state => ({ ...state, openFileIds: [...state.openFileIds.filter(file => file !== id), id] })); this.qa.record(this.state(),'file_focused',{fileId:id},'record-tab'); this.persist(); }
  directory(path: string): void { const before = this.state(); const transition = runInput(before,`CD ${path}`); this.qa.transition(before,transition,'CHANGE DIRECTORY','file-browser'); this.state.set(transition.state); this.qa.record(transition.state,'directory_changed',{path:transition.state.currentDirectory,success:transition.output.code==='ok'},'file-browser'); this.persist(); }
  terminalMode(mode: TerminalMode): void { this.state.update(state => ({ ...state, ui: { ...state.ui, terminalMode: mode } })); this.persist(); }
  display(crtEnabled: boolean, fontScale: number): void { this.state.update(state => ({ ...state, ui: { ...state.ui, crtEnabled, fontScale } })); this.persist(); }
  reset(): void {
    const before = this.state(); this.qa.interrupt(this.activeInteraction,before,'session-reset'); this.activeInteraction = undefined;
    this.qa.record(before, 'session_reset', { reason: 'restart-investigation', qaDataRetained: true });
    this.requestId++; this.playback.cancel();
    const removed = resetSave(this.storage);
    this.state.set(newGame()); this.provider = undefined; this.metrics.set([]);
    this.qa.observe(this.state());
    if (removed) this.persist();
    else this.storageWarning.set('Browser storage could not be cleared. This new session is running in memory.');
  }
  ngOnDestroy(): void { this.qa.interrupt(this.activeInteraction,this.state(),'client-closed'); this.requestId++; this.playback.cancel(); }
}
