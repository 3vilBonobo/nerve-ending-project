export const EVIDENCE = ['EV_SERVICE_ACTIVE', 'EV_RETIREMENT_APPROVED', 'EV_TRANSFER_MISSING', 'EV_REPAIR_REFERENCE', 'EV_AUTHORIZATION', 'EV_RECOVERED_FRAGMENT'] as const;
export type EvidenceId = typeof EVIDENCE[number];
export type Capability = 'KN_RECOVERY_REFERENCE' | 'CAP_ARCHIVE_RECOVERY';
export type TerminalMode = 'maximized' | 'restored' | 'minimized';
export const INTENTS = ['ask_service_status', 'ask_retirement', 'ask_transfer', 'ask_archive_location', 'ask_recovery_process', 'ask_authorization', 'ask_company', 'ask_identity', 'request_file', 'request_search', 'ask_clarification', 'unknown'] as const;
export type QueryIntent = typeof INTENTS[number];
export interface Interpretation {
  intent: QueryIntent;
  entityId?: string;
  fileId?: string;
  searchTerm?: string;
  needsClarification: boolean;
  confidence?: number;
  provider: 'fallback' | 'browser-ai' | 'ollama';
}
export interface QueryContext { lastTopic?: string; lastFileId?: string; lastIntent?: QueryIntent }
export interface IntentInterpreter {
  readonly id: string;
  isAvailable(): Promise<boolean>;
  interpret(input: string, context: QueryContext): Promise<Interpretation>;
}
export interface ArchiveFile {
  readonly id: string;
  readonly path: string;
  readonly title: string;
  readonly modified: string;
  readonly body: string;
  readonly evidence: readonly EvidenceId[];
  readonly locked?: boolean;
}
export interface FileLink { fileId: string; label: string }
export interface TerminalOutput {
  lines: string[];
  links: FileLink[];
  code: 'ok' | 'denied' | 'error' | 'notice';
  truth: 'record' | 'interpretation' | 'withheld' | 'system';
}
export interface TerminalEntry extends TerminalOutput { input: string }
export interface GameState {
  schemaVersion: 2;
  sessionId: string;
  startedAt: string;
  currentDirectory: string;
  discoveredEvidenceIds: EvidenceId[];
  unlockedCapabilities: Capability[];
  viewedFileIds: string[];
  openFileIds: string[];
  completedActions: string[];
  lastTopic?: string;
  lastFileId?: string;
  lastIntent?: QueryIntent;
  archive006Recovered: boolean;
  act01Complete: boolean;
  hasStarted: boolean;
  terminalHistory: TerminalEntry[];
  ui: { crtEnabled: boolean; fontScale: number; terminalMode: TerminalMode };
}
export interface Transition { state: GameState; output: TerminalOutput; openFileId?: string; clear?: boolean; recovered?: boolean }
