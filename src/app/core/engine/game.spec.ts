import { describe, expect, it } from 'vitest';
import { FILES } from '../content';
import { GameState } from '../models';
import { accessibleFiles, inspectFile, newLegacyGame as newGame, recover, runInput } from './game';
import { parseCommand, resolvePath } from './commands';

const run = (state: GameState, input: string) => runInput(state, input).state;

describe('terminal controls and records', () => {
  it('parses commands and paths without requiring a particular case', () => {
    expect(parseCommand(' oPeN "Office notice" ')).toEqual({ name: 'OPEN', args: ['Office notice'] });
    expect(parseCommand("search 'night desk'")?.args).toEqual(['night desk']);
    expect(parseCommand('ls')?.name).toBe('DIR');
    expect(parseCommand('cls')?.name).toBe('CLEAR');
    expect(parseCommand('open "unfinished')?.error).toContain('Unclosed quote');
    expect(parseCommand('why is the phone ringing?')).toBeUndefined();
    expect(resolvePath('../ARCHIVE/./FILE.DAT', '/OPERATIONS')).toBe('/ARCHIVE/FILE.DAT');
    expect(resolvePath('\\ARCHIVE\\', '/OPERATIONS')).toBe('/ARCHIVE');
    expect(resolvePath('../../..', '/')).toBe('/');
  });
  it('supports folders, full paths and readable names', () => {
    let state = run(newGame(), 'CD /OPERATIONS');
    expect(runInput(state, 'DIR').output.links.map(link => link.fileId)).toContain('call');
    expect(runInput(state, 'OPEN CALL_QUEUE.LOG').openFileId).toBe('call');
    expect(runInput(state, 'OPEN /ADMIN/COMPANY_PROFILE.TXT').openFileId).toBe('company');
    state = run(state, 'CD ..');
    expect(state.currentDirectory).toBe('/');
    expect(runInput(state, 'OPEN Office notice').openFileId).toBe('company');
    expect(runInput(state, 'OPEN About Meridian').openFileId).toBe('corporate-profile');
  });
  it('opens documents without duplicating their whole contents in the terminal', () => {
    const result = runInput(newGame(), 'OPEN Last shift');
    expect(result.openFileId).toBe('maintenance');
    expect(result.output.lines.join('\n')).not.toContain('home number');
    expect(result.state.viewedFileIds).toContain('maintenance');
    expect(FILES.find(file => file.id === 'maintenance')!.body).toContain('home number');
  });
  it('handles bad input and CLEAR without changing discoveries or authored records', () => {
    const state = inspectFile(newGame(), 'call').state;
    const snapshot = JSON.stringify(state);
    for (const input of ['CD /MISSING', 'OPEN /NOFILE', 'FROBULATE']) {
      const result = runInput(state, input);
      expect(result.output.code).toBe('error');
      expect(result.state.discoveredEvidenceIds).toEqual(state.discoveredEvidenceIds);
    }
    const cleared = runInput(state, 'CLEAR');
    expect(cleared.state.terminalHistory).toHaveLength(1);
    expect(cleared.state.discoveredEvidenceIds).toEqual(state.discoveredEvidenceIds);
    expect(JSON.stringify(state)).toBe(snapshot);
  });
  it('keeps unread backup text out of searches while allowing an explicit read by path', () => {
    const state = newGame();
    for (const term of ['0417', 'BRIDGE-02', 'Preservation hold']) expect(runInput(state, `SEARCH ${term}`).output.links).toHaveLength(0);
    expect(accessibleFiles(state).some(file => file.id === 'fragment')).toBe(false);
    expect(runInput(state, 'READ /ARCHIVE/HANDOVER_006.BAK').openFileId).toBe('fragment');
    expect(inspectFile(state, 'fragment').state).toEqual(state);
  });
  it('keeps control help and default examples separate from the investigation', () => {
    const state = newGame();
    const help = [
      ...runInput(state, 'HELP').output.lines,
      ...runInput(state, 'OPEN').output.lines,
      ...runInput(state, 'SEARCH').output.lines,
      FILES.find(file => file.id === 'readme')!.body,
    ].join('\n');
    expect(help).not.toMatch(/006|night desk|0417|BRIDGE|missing file|RECOVER ARCHIVE|shutdown/i);
    expect(runInput(state, 'HELP').output.links.map(link => link.fileId)).toEqual(['readme']);
    for (const question of ['What is Meridian Systems?', 'Is this an automatic system?', 'Show me the office notice.']) {
      expect(runInput(state, question).output.code).toBe('ok');
      expect(runInput(state, question).state.discoveredEvidenceIds).toHaveLength(0);
    }
  });
});

describe('the unanswered call investigation', () => {
  it('starts with the approved neutral client welcome, without announcing call evidence', () => {
    const opening = newGame().terminalHistory[0];
    expect(opening.lines.join(' ')).toContain('REMOTE ACCESS CLIENT 2.04');
    expect(opening.lines.join(' ')).not.toMatch(/NO ANSWER|NIGHT DESK|006|MOTHER|clinical/i);
    expect(opening.links).toEqual([]);
    expect(opening.lines.join(' ')).not.toMatch(/Try:|To begin|RECOVER|Read.*first/i);
  });
  it('has short source records, no split-code puzzle, and valid document references', () => {
    for (const file of FILES.filter(file => !file.scenarioScope)) {
      expect(file.body.split(/\s+/).length).toBeLessThan(130);
      expect(file.body).not.toMatch(/first part|second part|BATCH\/SLOT|read both|corroborat|before.*recover/i);
      for (const id of file.references ?? []) expect(FILES.some(item => item.id === id)).toBe(true);
    }
    expect(FILES.find(file => file.id === 'ledger')!.backupAvailable).toBe(true);
  });
  it('grounds the contradiction in dates and different record sources', () => {
    const call = FILES.find(file => file.id === 'call')!;
    const note = FILES.find(file => file.id === 'maintenance')!;
    const receipt = FILES.find(file => file.id === 'fragment')!;
    expect(call.body).toContain('06 Nov 2003');
    expect(note.body).toContain('phone was removed at 17:00 yesterday');
    expect(note.modified).toMatch(/^2001-09-19/);
    expect(receipt.body).toContain('23:59:41');
    expect(receipt.body).toContain('NIGHT DESK / 214       No answer');
    expect(receipt.body).toContain('COMMS/BRIDGE-02');
  });
  it('allows a normal backup read without proving a reading order', () => {
    const source = JSON.stringify(FILES);
    const result = recover(newGame());
    expect(result.recovered).toBe(true);
    expect(result.openFileId).toBe('fragment');
    expect(result.state.archive006Recovered).toBe(true);
    expect(result.state.act01Complete).toBe(false);
    expect(JSON.stringify(FILES)).toBe(source);
  });
  it('makes repeated backup reads idempotent', () => {
    const first = recover(newGame());
    const second = recover(first.state);
    expect(second.recovered).toBe(false);
    expect(second.state.completedActions).toEqual(first.state.completedActions);
    expect(second.state.discoveredEvidenceIds).toEqual(first.state.discoveredEvidenceIds);
    expect(second.state.openFileIds.filter(id => id === 'fragment')).toHaveLength(1);
  });
  it('can browse the attachment and backup without completing an investigation', () => {
    let state = inspectFile(newGame(), 'call').state;
    expect(FILES.find(file => file.id === 'call')!.references).toContain('ledger');
    state = inspectFile(state, 'ledger').state;
    const result = recover(state);
    expect(result.openFileId).toBe('fragment');
    expect(result.state.act01Complete).toBe(false);
    expect(result.state.permissions).toEqual([]);
  });
  it('answers ordinary curiosity without telling the player which steps to take', () => {
    let state = newGame();
    for (const question of ['Who is calling?', 'Who is supposed to answer?', 'Is anyone there?', 'What is 006?', 'Why did it restart?', 'Where is the receipt?']) {
      const result = runInput(state, question);
      expect(['ok', 'notice']).toContain(result.output.code);
      expect(result.output.lines.join(' ')).not.toMatch(/Type RECOVER|Read .* first|combine|You need to/i);
      state = result.state;
    }
    expect(state.archive006Recovered).toBe(false);
    expect(runInput(state, 'Read the backup').state.act01Complete).toBe(false);
  });
  it('answers the question asked instead of repeating the entire call report', () => {
    const who = runInput(newGame(), 'Who is calling?').output;
    expect(who.lines.join(' ')).toContain('automatic overnight alarm');
    expect(who.lines.join(' ')).not.toContain('2001');
    const when = runInput(newGame(), 'How long has it been calling?').output;
    expect(when.lines.join(' ')).toContain('18 SEP 2001');
    expect(when.lines.length).toBeLessThan(5);
  });
  it('does not let a classifier turn an informational question into a restore action', () => {
    const result = runInput(newGame(), 'What is Meridian Systems?', { intent: 'request_backup', provider: 'ollama', needsClarification: false });
    expect(result.state.archive006Recovered).toBe(false);
    expect(result.openFileId).toBeUndefined();
  });
  it('keeps the backup and later story facts unavailable until a deliberate read', () => {
    expect(runInput(newGame(), 'Who is 0417?').output.lines.join(' ')).not.toContain('0417');
    const restored = run(newGame(), 'OPEN backup');
    expect(runInput(restored, 'Who is 0417?').output.lines.join(' ')).toContain('0417');
    expect(runInput(restored, 'SEARCH 0417').output.links.some(link => link.fileId === 'fragment')).toBe(true);
    const publicBodies = accessibleFiles(restored).map(file => file.body).join(' ');
    expect(publicBodies).toContain('Anna Voss — Head Researcher');
    expect(publicBodies).not.toMatch(/MOTHER|AV-06|Site 6|The Machine That Lies/i);
  });
  it('reports the other known services without inventing a second mystery', () => {
    expect(runInput(newGame(), 'What is 005?').output.lines.join(' ')).toContain('stopped');
    expect(runInput(newGame(), 'What is 007?').output.lines.join(' ')).toContain('connection you are using');
    const result = runInput(newGame(), 'Stop 006');
    expect(result.output.lines).toContain('CONTROL UNAVAILABLE.');
    expect(result.state.archive006Recovered).toBe(false);
  });
});
