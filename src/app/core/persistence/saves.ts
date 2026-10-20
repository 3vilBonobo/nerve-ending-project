import { FILES, DIRECTORIES } from '../content';
import { EVIDENCE, GameState, INTENTS, TerminalEntry } from '../models';
import { deriveKnowledge, newGame } from '../engine/game';

export const SAVE_KEY = 'nerve-ending.save';
export interface SaveStore { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }
export interface LoadResult { state: GameState; warning?: string }
const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

export function decodeSave(raw: string | null): LoadResult {
  if (!raw) return { state: newGame() };
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (!data || ![1, 2].includes(Number(data['schemaVersion']))) throw new Error('Unsupported save version');
    if (typeof data['sessionId'] !== 'string' || !Array.isArray(data['discoveredEvidenceIds'])) throw new Error('Invalid save');
    const recovered = data['archive006Recovered'] === true;
    const allowedIds = FILES.filter(file => !file.locked || recovered).map(file => file.id);
    const ui = data['ui'] && typeof data['ui'] === 'object' ? data['ui'] as Record<string, unknown> : {};
    const base = newGame();
    const history: TerminalEntry[] = [];
    if (Array.isArray(data['terminalHistory'])) for (const item of data['terminalHistory'].slice(-80)) {
      if (!item || typeof item !== 'object' || typeof item.input !== 'string' || !Array.isArray(item.lines ?? item.output)) continue;
      history.push({
        input: item.input.slice(0, 1000), lines: strings(item.lines ?? item.output).map(line => line.slice(0, 16000)).slice(0, 50),
        links: Array.isArray(item.links) ? item.links.filter((link: { fileId?: string }) => allowedIds.includes(link?.fileId ?? '')).map((link: { fileId: string }) => ({ fileId: link.fileId, label: FILES.find(file => file.id === link.fileId)!.title })) : [],
        code: ['ok', 'denied', 'error', 'notice'].includes(item.code) ? item.code : 'ok',
        truth: ['record', 'interpretation', 'withheld', 'system'].includes(item.truth) ? item.truth : 'system',
      });
    }
    const state = deriveKnowledge({
      ...base, sessionId: data['sessionId'].slice(0, 30),
      startedAt: typeof data['startedAt'] === 'string' ? data['startedAt'] : base.startedAt,
      currentDirectory: DIRECTORIES.includes(data['currentDirectory'] as typeof DIRECTORIES[number]) ? data['currentDirectory'] as string : '/',
      discoveredEvidenceIds: EVIDENCE.filter(id => strings(data['discoveredEvidenceIds']).includes(id) && (recovered || id !== 'EV_RECOVERED_FRAGMENT')),
      viewedFileIds: strings(data['viewedFileIds']).filter(id => allowedIds.includes(id)),
      openFileIds: strings(data['openFileIds']).filter(id => allowedIds.includes(id)).slice(-5),
      completedActions: recovered ? ['recover-006', 'restore-legacy-references'] : [],
      archive006Recovered: recovered, act01Complete: recovered && data['act01Complete'] === true,
      hasStarted: data['hasStarted'] === true || (data['schemaVersion'] === 1 && history.length > 0),
      lastTopic: data['lastTopic'] === 'service-006' ? 'service-006' : undefined,
      lastFileId: typeof data['lastFileId'] === 'string' && allowedIds.includes(data['lastFileId']) ? data['lastFileId'] : undefined,
      lastIntent: INTENTS.includes(data['lastIntent'] as typeof INTENTS[number]) ? data['lastIntent'] as typeof INTENTS[number] : undefined,
      terminalHistory: history.length ? history : base.terminalHistory,
      ui: {
        crtEnabled: typeof ui['crtEnabled'] === 'boolean' ? ui['crtEnabled'] : true,
        fontScale: typeof ui['fontScale'] === 'number' && Number.isFinite(ui['fontScale']) ? Math.min(1.25, Math.max(0.9, ui['fontScale'])) : 1,
        terminalMode: ['maximized', 'restored', 'minimized'].includes(String(ui['terminalMode'])) ? ui['terminalMode'] as GameState['ui']['terminalMode'] : 'maximized',
      },
    });
    return { state };
  } catch { return { state: newGame(), warning: 'The saved session could not be read. A new session is available; the unread save has not been overwritten.' }; }
}
export function loadSave(storage: SaveStore): LoadResult {
  try { return decodeSave(storage.getItem(SAVE_KEY)); }
  catch { return { state: newGame(), warning: 'Browser storage is restricted. You can play, but progress may not survive closing this page.' }; }
}
export function writeSave(storage: SaveStore, state: GameState): boolean {
  try { storage.setItem(SAVE_KEY, JSON.stringify(state)); return true; } catch { return false; }
}
export function resetSave(storage: SaveStore): boolean {
  try { storage.removeItem(SAVE_KEY); return true; } catch { return false; }
}
