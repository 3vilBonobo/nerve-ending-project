import { describe, expect, it } from 'vitest';
import { FILES } from '../content';
import { GameState } from '../models';
import { accessibleFiles, inspectFile, newGame, recover, runInput } from './game';
import { parseCommand, resolvePath } from './commands';

const run = (state: GameState, command: string) => runInput(state, command).state;
const corroborated = () => ['STATUS', 'OPEN /OPERATIONS/SERVICE_REGISTER.DAT', 'OPEN /ARCHIVE/TRANSFER_LEDGER_2001.LOG', 'OPEN /ARCHIVE/INDEX_REPAIR_NOTES.TXT'].reduce(run, newGame());

describe('command and virtual filesystem contract', () => {
  it('recognizes explicit commands before questions, aliases, case and whitespace', () => {
    expect(parseCommand('  oPeN   "SERVICE_REGISTER.DAT"  ')).toEqual({ name: 'OPEN', args: ['SERVICE_REGISTER.DAT'] });
    expect(parseCommand("search 'missing receipt'")?.args).toEqual(['missing receipt']);
    expect(parseCommand('ls')?.name).toBe('DIR'); expect(parseCommand('cls')?.name).toBe('CLEAR');
    expect(parseCommand('open "incomplete')?.error).toContain('Unclosed quote');
    expect(parseCommand('why is it running?')).toBeUndefined();
  });
  it('resolves root, relative paths, parent paths and backslashes', () => {
    expect(resolvePath('../ARCHIVE/./FILE.TXT', '/OPERATIONS')).toBe('/ARCHIVE/FILE.TXT');
    expect(resolvePath('../../..', '/')).toBe('/');
    expect(resolvePath('\\ARCHIVE\\', '/OPERATIONS')).toBe('/ARCHIVE');
  });
  it('lists, navigates and opens the same authored files', () => {
    let state = newGame();
    expect(runInput(state, 'help').output.lines.join('\n')).toContain('You can also ask questions.');
    expect(runInput(state, 'DIR').output.lines.join('\n')).toContain('OPERATIONS');
    expect(runInput(state, 'DIR /ARCHIVE').output.links.some(link => link.fileId === 'ledger')).toBe(true);
    state = run(state, 'CD OPERATIONS'); expect(state.currentDirectory).toBe('/OPERATIONS');
    state = run(state, 'OPEN "SERVICE_REGISTER.DAT"'); expect(state.viewedFileIds).toContain('register');
    state = run(state, 'CD ..'); expect(state.currentDirectory).toBe('/');
    state = run(state, 'OPEN /ARCHIVE/TRANSFER_LEDGER_2001.LOG'); expect(state.viewedFileIds).toContain('ledger');
    expect(runInput(state, 'HELP RECOVER').openFileId).toBe('recovery-help');
  });
  it('rejects bad paths and unknown commands helpfully without losing progress', () => {
    const state = corroborated();
    for (const command of ['CD /MISSING', 'OPEN /NOFILE', 'FROBULATE']) {
      const result = runInput(state, command);
      expect(result.output.code).toBe('error'); expect(result.state.discoveredEvidenceIds).toEqual(state.discoveredEvidenceIds);
    }
    expect(runInput(state, 'OPEN').output.lines[0]).toContain('Syntax');
    expect(runInput(state, 'SEARCH').output.code).toBe('error');
  });
  it('clears only scrollback and leaves the input state immutable', () => {
    const state = corroborated(); const snapshot = JSON.stringify(state);
    const next = run(state, 'CLEAR');
    expect(next.terminalHistory).toHaveLength(1); expect(next.discoveredEvidenceIds).toEqual(state.discoveredEvidenceIds);
    expect(JSON.stringify(state)).toBe(snapshot);
  });
  it('does not leak locked content from listing, search or guessed paths', () => {
    const state = newGame();
    expect(accessibleFiles(state).some(file => file.id === 'fragment')).toBe(false);
    for (const query of ['0417', 'BRIDGE-02', 'RECOVERED_006', 'CLOSURE WITHHELD']) {
      expect(runInput(state, `SEARCH ${query}`).output.links).toHaveLength(0);
    }
    expect(runInput(state, 'OPEN /ARCHIVE/RECOVERED_006.FRAG').openFileId).toBeUndefined();
    expect(inspectFile(state, 'fragment').state).toEqual(state);
  });
});

describe('Act 01 evidence and consequences', () => {
  it('preserves the operational and retirement contradiction', () => {
    expect(runInput(newGame(), 'sTaTuS').output.lines).toContain('SERVICE 006: ACTIVE');
    const register = FILES.find(file => file.id === 'register')!;
    expect(register.body).toContain('006   Continuity supervision      ACTIVE');
    expect(register.body).toContain('RETIREMENT APPROVED: 2001-09-18');
    expect(register.body).toContain('ARCHIVE TRANSFER: NOT RECORDED');
  });
  it('denies premature recovery with specific missing sources', () => {
    const result = runInput(newGame(), 'RECOVER ARCHIVE 006');
    expect(result.output.code).toBe('denied'); expect(result.state.archive006Recovered).toBe(false);
    expect(result.output.lines.join(' ')).toMatch(/STATUS.*register.*ledger.*repair notes/);
    const partial = run(newGame(), 'OPEN /OPERATIONS/SERVICE_REGISTER.DAT');
    expect(runInput(partial, 'RECOVER ARCHIVE 006').output.lines.join(' ')).not.toMatch(/Check if 006 is running|Check retirement approval/);
  });
  it('accepts all independent discovery orders and alternate approval evidence', () => {
    const sources = ['status-log', 'authorization', 'ledger', 'repair'];
    function permutations(items: string[]): string[][] { return items.length ? items.flatMap((item, index) => permutations(items.filter((_, i) => i !== index)).map(rest => [item, ...rest])) : [[]]; }
    for (const order of permutations(sources)) {
      const state = order.reduce((current, id) => inspectFile(current, id).state, newGame());
      expect(state.unlockedCapabilities).toContain('CAP_ARCHIVE_RECOVERY');
      expect(recover(state).state.archive006Recovered).toBe(true);
    }
  });
  it('requires both routing sources, rather than command count or wording', () => {
    let state = run(newGame(), 'Why is service 006 active?');
    for (let count = 0; count < 10; count++) state = run(state, 'How do I recover it?');
    expect(recover(state).output.code).toBe('denied');
    state = inspectFile(state, 'ledger').state;
    expect(state.unlockedCapabilities).not.toContain('KN_RECOVERY_REFERENCE');
    state = inspectFile(state, 'repair').state;
    expect(state.unlockedCapabilities).toContain('CAP_ARCHIVE_RECOVERY');
  });
  it('restores once, exposes 0417, and waits for fragment inspection to complete', () => {
    const before = corroborated(); const transition = runInput(before, 'RECOVER ARCHIVE 006');
    expect(transition.recovered).toBe(true); expect(transition.state.act01Complete).toBe(false);
    expect(accessibleFiles(transition.state).find(file => file.id === 'fragment')?.body).toContain('0417');
    const again = runInput(transition.state, 'RECOVER ARCHIVE 006');
    expect(again.output.code).toBe('notice'); expect(again.state.completedActions).toEqual(transition.state.completedActions);
    expect(inspectFile(again.state, 'fragment').state.act01Complete).toBe(true);
    expect(runInput(transition.state, 'SEARCH 0417').output.links[0].fileId).toBe('fragment');
  });
  it('finishes through the question-led route with the model absent', () => {
    const commands = ['Why is service six still running?', 'Wasnt it retired?', 'Where is its archive?', 'Show me the transfer ledger', 'Can I see the repair notes?', 'How can I recover it?', 'RECOVER ARCHIVE 006', 'OPEN /ARCHIVE/RECOVERED_006.FRAG'];
    const state = commands.reduce(run, newGame());
    expect(state.act01Complete).toBe(true); expect(state.discoveredEvidenceIds).toContain('EV_RECOVERED_FRAGMENT');
  });
  it('keeps later-act secrets outside all prototype records and initial outputs', () => {
    expect(FILES.map(file => file.body).join(' ')).not.toMatch(/MOTHER|Anna Voss|Site 6|The Machine That Lies/i);
    expect(newGame().terminalHistory[0].lines.join(' ')).not.toMatch(/MOTHER|Anna Voss|Site 6/i);
  });
});
