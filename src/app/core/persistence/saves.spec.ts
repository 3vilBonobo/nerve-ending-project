import { describe, expect, it } from 'vitest';
import { inspectFile, newGame, runInput } from '../engine/game';
import { SAVE_KEY, SaveStore, decodeSave, loadSave, resetSave, writeSave } from './saves';

function memoryStorage(): SaveStore {
  const store = new Map<string, string>();
  return { getItem: key => store.get(key) ?? null, setItem: (key, value) => { store.set(key, value); }, removeItem: key => { store.delete(key); } };
}
describe('versioned browser persistence', () => {
  it('round trips discovery, current directory, records, recovery, completion and display', () => {
    let state = newGame(); state.hasStarted = true;
    for (const id of ['register', 'ledger', 'repair']) state = inspectFile(state, id).state;
    state = runInput(state, 'RECOVER ARCHIVE 006').state; state = inspectFile(state, 'fragment').state;
    state = runInput(state, 'CD /ARCHIVE').state; state.ui.crtEnabled = false;
    const storage = memoryStorage(); expect(writeSave(storage, state)).toBe(true);
    expect(loadSave(storage).state).toEqual(state);
  });
  it('migrates v1 history and derives capabilities from evidence rather than trusting flags', () => {
    const state = newGame();
    const result = decodeSave(JSON.stringify({ ...state, schemaVersion: 1, terminalHistory: [{ input: 'STATUS', output: ['SERVICE 006: ACTIVE'] }], unlockedCapabilities: ['CAP_ARCHIVE_RECOVERY'] }));
    expect(result.state.schemaVersion).toBe(2); expect(result.state.hasStarted).toBe(true);
    expect(result.state.terminalHistory[0].lines).toEqual(['SERVICE 006: ACTIVE']);
    expect(result.state.unlockedCapabilities).toEqual([]);
  });
  it('recovers from corrupt and future saves gracefully without deleting the source', () => {
    const storage = memoryStorage(); storage.setItem(SAVE_KEY, '{broken');
    expect(loadSave(storage).warning).toContain('could not be read'); expect(storage.getItem(SAVE_KEY)).toBe('{broken');
    expect(decodeSave('{"schemaVersion":999}').warning).toBeTruthy();
    expect(decodeSave('null').warning).toBeTruthy();
  });
  it('sanitizes unsupported paths, records and display values', () => {
    const state = newGame();
    const result = decodeSave(JSON.stringify({ ...state, currentDirectory: '/SECRET', openFileIds: ['fragment', 'register', 'invented'], ui: { fontScale: 999, terminalMode: 'garbage' } }));
    expect(result.state.currentDirectory).toBe('/'); expect(result.state.openFileIds).toEqual(['register']);
    expect(result.state.ui.fontScale).toBe(1.25); expect(result.state.ui.terminalMode).toBe('maximized');
  });
  it('continues in memory if storage is restricted or quota exhausted', () => {
    const storage: SaveStore = { getItem: () => { throw new Error('restricted'); }, setItem: () => { throw new Error('full'); }, removeItem: () => { throw new Error('restricted'); } };
    expect(loadSave(storage).state.schemaVersion).toBe(2); expect(loadSave(storage).warning).toContain('restricted');
    expect(writeSave(storage, newGame())).toBe(false); expect(resetSave(storage)).toBe(false);
  });
  it('reset removes only this game and starts with clean evidence', () => {
    const storage = memoryStorage(); storage.setItem('other-app', 'keep'); writeSave(storage, newGame());
    expect(resetSave(storage)).toBe(true); expect(storage.getItem(SAVE_KEY)).toBeNull();
    expect(storage.getItem('other-app')).toBe('keep'); expect(loadSave(storage).state.discoveredEvidenceIds).toEqual([]);
  });
});
