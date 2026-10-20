import { Interpretation, QueryContext } from '../models';

export type LanguageRequest = { type: 'load'; root: string } | { type: 'query'; id: number; input: string; context: QueryContext };
export type LanguageResponse =
  | { type: 'progress'; loaded: number; total: number; cached: boolean }
  | { type: 'initializing' }
  | { type: 'ready'; loadMs: number; persistent: boolean }
  | { type: 'result'; id: number; interpretation: Interpretation; elapsedMs: number }
  | { type: 'error'; id?: number };
export interface LanguageState {
  phase: 'off' | 'loading' | 'initializing' | 'ready' | 'error' | 'unsupported';
  loaded: number; total: number; cached: boolean; persistent: boolean; loadMs: number; lastQueryMs: number;
}
export const LANGUAGE_DOWNLOAD_BYTES = 36_000_000;
export const emptyLanguageState = (): LanguageState => ({ phase: 'off', loaded: 0, total: LANGUAGE_DOWNLOAD_BYTES, cached: false, persistent: true, loadMs: 0, lastQueryMs: 0 });
