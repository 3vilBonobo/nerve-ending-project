import { Interpretation, QueryContext } from '../../models';
export type LanguageRequest = {
    type: 'load';
    root: string;
} | {
    type: 'query';
    id: number;
    input: string;
    context: QueryContext;
};
export type LanguageResponse = {
    type: 'progress';
    loaded: number;
    total: number;
    cached: boolean;
} | {
    type: 'initializing';
    detail: string;
} | {
    type: 'ready';
    loadMs: number;
    persistent: boolean;
} | {
    type: 'result';
    id: number;
    interpretation: Interpretation;
    elapsedMs: number;
} | {
    type: 'error';
    id?: number;
    detail?: string;
};
export interface LanguageState {
    phase: 'off' | 'loading' | 'initializing' | 'ready' | 'error' | 'unsupported';
    loaded: number;
    total: number;
    cached: boolean;
    persistent: boolean;
    loadMs: number;
    lastQueryMs: number;
    detail: string;
}
// Rounded estimate shown before the manifest supplies its exact byte count.
export const LANGUAGE_DOWNLOAD_BYTES = 42000000;
export const emptyLanguageState = (): LanguageState => ({ phase: 'off', loaded: 0, total: LANGUAGE_DOWNLOAD_BYTES, cached: false, persistent: true, loadMs: 0, lastQueryMs: 0, detail: '' });
