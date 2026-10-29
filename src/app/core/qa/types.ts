import type { GameState } from '../models';

export const QA_DATABASE = 'nerve-ending-qa';
export const QA_DATABASE_VERSION = 1;
export const QA_SCHEMA_VERSION = 1;
export const APPLICATION_VERSION = '1.2.0+scenario.1';
export type QaSource = 'terminal' | 'operation-button' | 'record-link' | 'record-tab' | 'file-browser' | 'evidence-button' | 'client';
export type FeedbackTag = 'confusing' | 'incorrect' | 'repetitive' | 'effective';
export const FEEDBACK_TAGS: readonly FeedbackTag[] = ['confusing', 'incorrect', 'repetitive', 'effective'];
export type QaEventType = 'qa_enabled' | 'qa_disabled' | 'session_started' | 'session_resumed' | 'session_reset' | 'question_submitted' | 'command_submitted' | 'question_resolved' | 'response_selected' | 'file_opened' | 'file_open_attempt' | 'file_focused' | 'file_closed' | 'directory_changed' | 'evidence_compared' | 'authorization_challenged' | 'challenge_attempt' | 'operation_requested' | 'action_result' | 'action_failed' | 'milestone_reached' | 'act_transition' | 'ending_selected' | 'feedback' | 'input_interrupted' | 'encounter_prompted' | 'encounter_explained' | 'encounter_deferred' | 'encounter_resumed' | 'encounter_completed';
export type QaJson = string | number | boolean | null | QaJson[] | { [key: string]: QaJson };
export interface QaNarrativeState {
  conversation?: {tone:string;paused:boolean;recentEggs:string[];selfQuestions:number;sourceIds:string[]};
  scenario?: { version:string; caseClock:string; events:string[]; question:string; pendingChoice:string|null; outcome:string|null; deferred:boolean };
  act: number;
  knowledge: string[];
  permissions: string[];
  evidence: string[];
  viewedFiles: string[];
  openFiles: string[];
  completedActions: string[];
  storyEvents: string[];
  questionCounts: Record<string, number>;
  hasStarted: boolean;
  directory: string;
  lastTopic: string | null;
  lastIntent: string | null;
  lastFileId: string | null;
  pendingOperation: string | null;
  operating: GameState['operating'];
  archiveRecovered: boolean;
  hintLevel: number;
  investigation: GameState['investigation'];
  clarification: { intent: string; choices: string[] } | null;
}
export interface QaDraft {
  id: string;
  schemaVersion: typeof QA_SCHEMA_VERSION;
  applicationVersion: string;
  timestamp: string;
  instanceId: string;
  type: QaEventType;
  interactionId: string | null;
  source: QaSource;
  state: QaNarrativeState;
  data: { [key: string]: QaJson };
}
export interface QaEvent extends QaDraft { order: number; sessionId: string; sequence: number }
export interface QaStats {
  questions: number; ambiguities: number; unknown: number; fallbacks: number; failures: number;
  files: number; comparisons: number; authorizationChallenges: number; challengeAttempts: number;
  operations: number; milestones: number; actTransitions: number; endings: number; feedback: number;
}
export interface QaSession {
  id: string;
  gameKey: string;
  createdAt: string;
  lastEventAt: string;
  eventCount: number;
  stats: QaStats;
}
export const emptyQaStats = (): QaStats => ({ questions: 0, ambiguities: 0, unknown: 0, fallbacks: 0, failures: 0, files: 0, comparisons: 0, authorizationChallenges: 0, challengeAttempts: 0, operations: 0, milestones: 0, actTransitions: 0, endings: 0, feedback: 0 });
export function updateQaStats(stats: QaStats, event: QaDraft): void {
  const fields: Partial<Record<QaEventType, keyof QaStats>> = { question_submitted: 'questions', action_failed: 'failures', file_opened: 'files', evidence_compared: 'comparisons', authorization_challenged: 'authorizationChallenges', challenge_attempt: 'challengeAttempts', operation_requested: 'operations', milestone_reached: 'milestones', act_transition: 'actTransitions', ending_selected: 'endings', feedback: 'feedback' };
  const field = fields[event.type]; if (field) stats[field]++;
  if (event.type === 'question_resolved') {
    if (event.data['ambiguous']) stats.ambiguities++;
    if (event.data['result'] === 'unmatched') stats.unknown++;
    if (event.data['fallbackUsed']) stats.fallbacks++;
  }
}
export const qaGameKey = (s: GameState): string => `${s.sessionId}:${s.startedAt}`;
export const qaId = (): string => globalThis.crypto?.randomUUID?.() ?? `qa-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
