import { DIRECTORIES, FILES, fileById } from '../content';
import { ArchiveFile, EvidenceId, GameState, Interpretation, QueryIntent, TerminalOutput, Transition } from '../models';
import { classify } from '../interpretation/fallback';
import { parseCommand, resolvePath } from './commands';

export const OPENING = ['MERIDIAN SYSTEMS / RECORDS ACCESS', 'VERSION 3.14', '', 'READY', 'This computer holds old company records.', 'You can open files or ask questions.', '', 'For example: What is Meridian Systems?', 'Type HELP if you need instructions.'];
export const output = (lines: string[], fileIds: string[] = [], code: TerminalOutput['code'] = 'ok', truth: TerminalOutput['truth'] = 'system'): TerminalOutput => ({
  lines, code, truth, links: fileIds.flatMap(id => { const file = fileById(id); return file ? [{ fileId: id, label: file.title }] : []; }),
});
export function newGame(now = new Date().toISOString(), sessionId = `MR-${Math.random().toString(16).slice(2, 6).toUpperCase()}`): GameState {
  return {
    schemaVersion: 2, sessionId, startedAt: now, currentDirectory: '/', discoveredEvidenceIds: [], unlockedCapabilities: [], viewedFileIds: [], openFileIds: [], completedActions: [],
    archive006Recovered: false, act01Complete: false, hasStarted: false,
    terminalHistory: [{ input: '', ...output(OPENING) }], ui: { crtEnabled: true, fontScale: 1, terminalMode: 'maximized' },
  };
}
export const accessibleFiles = (state: GameState): readonly ArchiveFile[] => FILES.filter(file => !file.locked || state.archive006Recovered);
export function deriveKnowledge(state: GameState): GameState {
  const found = new Set(state.discoveredEvidenceIds);
  const capabilities: GameState['unlockedCapabilities'] = [];
  if (found.has('EV_TRANSFER_MISSING') && found.has('EV_REPAIR_REFERENCE')) capabilities.push('KN_RECOVERY_REFERENCE');
  if (capabilities.length && found.has('EV_SERVICE_ACTIVE') && found.has('EV_RETIREMENT_APPROVED')) capabilities.push('CAP_ARCHIVE_RECOVERY');
  return { ...state, unlockedCapabilities: capabilities };
}
function discover(state: GameState, evidence: readonly EvidenceId[]): GameState {
  return deriveKnowledge({ ...state, discoveredEvidenceIds: [...new Set([...state.discoveredEvidenceIds, ...evidence])] });
}
export function inspectFile(state: GameState, fileId: string): Transition {
  const file = fileById(fileId);
  if (!file || (file.locked && !state.archive006Recovered)) return { state, output: output(['FILE NOT FOUND.', 'Type DIR to see available files, or HELP for instructions.'], [], 'denied') };
  const next = discover({
    ...state, lastFileId: file.id,
    lastTopic: file.evidence.length ? 'service-006' : state.lastTopic,
    viewedFileIds: [...new Set([...state.viewedFileIds, file.id])],
    openFileIds: [...state.openFileIds.filter(id => id !== file.id), file.id].slice(-5),
  }, file.evidence);
  return { state: { ...next, act01Complete: next.act01Complete || (file.id === 'fragment' && next.archive006Recovered) }, output: output([`FILE: ${file.title}`, file.body], [], 'ok', 'record'), openFileId: file.id };
}
export function recoveryMissing(state: GameState): string[] {
  const found = new Set(state.discoveredEvidenceIds);
  const missing: string[] = [];
  if (!found.has('EV_SERVICE_ACTIVE')) missing.push('Type STATUS to check if 006 is running.');
  if (!found.has('EV_RETIREMENT_APPROVED')) missing.push('Read Service list to check if 006 should have stopped.');
  if (!found.has('EV_TRANSFER_MISSING')) missing.push('Read File move log for the first part of the file address.');
  if (!found.has('EV_REPAIR_REFERENCE')) missing.push('Read File repair notes for the second part.');
  return missing;
}
export function recover(state: GameState): Transition {
  if (state.archive006Recovered) return { state, output: output(['FILE ALREADY FOUND.', 'Select [OPEN] below to read it.'], ['fragment'], 'notice') };
  const missing = recoveryMissing(state);
  if (missing.length) return { state, output: output(['NOT READY.', 'Read these records first:', ...missing], ['register', 'ledger', 'repair'].filter(id => !state.viewedFileIds.includes(id)), 'denied') };
  const next: GameState = {
    ...state, archive006Recovered: true,
    completedActions: [...new Set([...state.completedActions, 'recover-006', 'restore-legacy-references'])],
  };
  return { state: next, recovered: true, output: output(['FILE FOUND.', 'ADDRESS: MX-91/006-R', 'The file list is not fully fixed.', '006 is still running.', '', 'Select [OPEN] below to read the recovered receipt.'], ['fragment']) };
}
function search(state: GameState, term: string): TerminalOutput {
  if (!term.trim()) return output(['Enter a word after SEARCH.', 'Example: SEARCH company'], [], 'error');
  const needle = term.toUpperCase();
  const matches = accessibleFiles(state).filter(file => `${file.path} ${file.title} ${file.body}`.toUpperCase().includes(needle));
  const excerpts = matches.map(file => {
    const line = file.body.split('\n').find(text => text.toUpperCase().includes(needle));
    return `${file.title}\n  ${line?.trim() ?? file.title}`;
  });
  return output([`SEARCH: ${term} / FILES FOUND: ${matches.length}`, matches.length ? 'Select [OPEN] below to read a file.' : 'Try a different word.', ...excerpts], matches.map(file => file.id));
}
function answer(state: GameState, interpretation: Interpretation): Transition {
  let next = { ...state };
  const respond = (lines: string[], files: string[] = [], evidence: EvidenceId[] = []): Transition => ({ state: discover(next, evidence), output: output(lines, files, 'ok', 'interpretation') });
  if (interpretation.needsClarification) return { state, output: output(['MORE DETAIL NEEDED.', 'Which program or file do you mean?', 'Include its name or number in your question.'], [], 'notice') };
  let intent: QueryIntent = interpretation.intent;
  if (intent === 'ask_clarification') {
    if (!state.lastIntent) return respond(['MORE DETAIL NEEDED.', 'Name the program or file you want to ask about.']);
    intent = state.lastIntent;
  }
  if (interpretation.entityId === 'service-006' || intent.startsWith('ask_') && !['ask_company', 'ask_identity'].includes(intent)) next.lastTopic = 'service-006';
  if (intent !== 'unknown' && intent !== 'ask_clarification') next.lastIntent = intent;
  switch (intent) {
    case 'ask_service_status': return respond(['006: STILL RUNNING.', 'It should have stopped on 18 September 2001.', 'The computer restarted it on its own.', 'No receipt confirms that its files were moved.', '', 'Read Service list and Activity log below.'], ['register', 'status-log'], ['EV_SERVICE_ACTIVE', 'EV_RETIREMENT_APPROVED']);
    case 'ask_retirement': return respond(['006: STOP APPROVED / 18 SEPTEMBER 2001.', 'It is still running.', 'Its files were meant to move to storage.', 'No receipt confirms the move.', '', 'Read File move log below.'], ['register', 'authorization', 'ledger'], ['EV_RETIREMENT_APPROVED']);
    case 'ask_transfer': return respond(['006: MOVE NOT CONFIRMED.', 'The receipt is missing.', 'File move log and File repair notes each hold part of the file address.', 'Read both files below to find it.'], ['ledger', 'repair']);
    case 'ask_archive_location': return respond(['006: FILE MISSING FROM LIST.', 'It may still be saved on the computer.', 'Read the two files below to find its address.'], ['ledger', 'repair']);
    case 'ask_recovery_process': return respond(state.unlockedCapabilities.includes('CAP_ARCHIVE_RECOVERY')
      ? ['READY TO FIND THE FILE.', 'Type: RECOVER ARCHIVE 006', 'This lets you read the file. It does not stop 006.']
      : ['NOT READY.', ...recoveryMissing(state), '', 'Then type: RECOVER ARCHIVE 006', 'The computer fills in the address for you.'], state.unlockedCapabilities.includes('CAP_ARCHIVE_RECOVERY') ? [] : ['register', 'ledger', 'repair', 'recovery-help']);
    case 'ask_authorization': return respond(['STOP APPROVED: 18 SEPTEMBER 2001.', 'The signature is damaged. Only part of its code can be read.', 'Select [OPEN] below to see the approval.'], ['authorization']);
    case 'ask_company': return respond(['MERIDIAN SYSTEMS / COMPANY RECORDS.', 'Meridian makes medical monitoring equipment.', 'This computer holds its old records.', 'Sales questions are no longer answered here.'], ['company', 'readme']);
    case 'ask_identity': return respond(['MERIDIAN RECORDS SYSTEM / VERSION 3.14.', 'This is an automatic reply. No person is connected.', 'You can ask about the saved records.'], ['readme']);
    case 'request_file': return inspectFile(next, interpretation.fileId ?? '');
    case 'request_search': return { state: next, output: search(next, interpretation.searchTerm ?? '') };
    default: return { state, output: output(['QUESTION NOT UNDERSTOOD.', 'Try: What is Meridian Systems?', 'Or type HELP for instructions.'], [], 'notice') };
  }
}

export function runInput(state: GameState, raw: string, interpretation?: Interpretation): Transition {
  const input = raw.trim().slice(0, 1000);
  if (!input) return { state, output: output([]) };
  const command = parseCommand(input);
  let result: Transition;
  const done = (out: TerminalOutput, next: GameState = state): Transition => ({ state: next, output: out });
  if (command?.error) result = done(output([command.error], [], 'error'));
  else if (command) {
    const argument = command.args.join(' ');
    switch (command.name) {
      case 'HELP':
        result = argument.toUpperCase() === 'RECOVER' ? inspectFile(state, 'recovery-help') : done(output([
          'HELP / THINGS TO TRY', '',
          'You can ask questions in ordinary words.',
          'Try: What is Meridian Systems?',
          'Try: Show me About Meridian',
          'Try: Who am I talking to?', '',
          'Select [OPEN] beside a file name to read it.', '',
          'SHORT COMMANDS',
          'STATUS                 Show what is running',
          'DIR                    List files and folders',
          'OPEN About Meridian    Read the company information',
          'SEARCH company         Find files that mention a word',
          'CLEAR                  Clear the screen; keep progress', '',
          'To open a folder: CD /SYSTEM. To go back: CD ..',
          'Up/Down brings back things you typed before.',
        ], ['readme']));
        break;
      case 'DIR': {
        const directory = resolvePath(argument || '.', state.currentDirectory);
        if (!DIRECTORIES.includes(directory as typeof DIRECTORIES[number])) { result = done(output([`FOLDER NOT FOUND: ${directory}`, 'Type DIR / to see the main folders.'], [], 'error')); break; }
        const dirs = DIRECTORIES.filter(path => path !== '/' && path.slice(0, path.lastIndexOf('/')) === (directory === '/' ? '' : directory));
        const files = accessibleFiles(state).filter(file => file.path.slice(0, file.path.lastIndexOf('/')) === directory);
        result = done(output([`FOLDER: ${directory}`, ...dirs.map(path => ` <FOLDER>  ${path.split('/').pop()}`), ...files.map(file => ` ${file.modified}  ${file.title}`), `FOLDERS: ${dirs.length} / FILES: ${files.length}`], files.map(file => file.id)));
        break;
      }
      case 'CD': {
        const path = resolvePath(argument || '/', state.currentDirectory);
        result = DIRECTORIES.includes(path as typeof DIRECTORIES[number]) ? done(output([`FOLDER: ${path}`]), { ...state, currentDirectory: path }) : done(output([`FOLDER NOT FOUND: ${path}`, 'Type DIR / to see the main folders.'], [], 'error'));
        break;
      }
      case 'OPEN': {
        const path = resolvePath(argument, state.currentDirectory);
        const name = argument.toUpperCase();
        const file = accessibleFiles(state).find(item => item.path === path || item.title.toUpperCase() === name || item.path.split('/').pop() === name);
        result = file ? inspectFile(state, file.id) : done(output([argument ? `FILE NOT FOUND: ${argument}` : 'Enter a file name after OPEN.', 'Example: OPEN About Meridian', 'Type DIR to see available files.'], [], 'error'));
        break;
      }
      case 'SEARCH': result = done(search(state, argument)); break;
      case 'STATUS': result = done(output(['SYSTEM STATUS', 'Services are programs on this computer.', '', 'SERVICE 004: STOPPED', 'SERVICE 005: STOPPED', 'SERVICE 006: RUNNING', 'SERVICE 007: RUNNING / RECORDS ACCESS', `FILE LIST: ${state.archive006Recovered ? 'PARTLY FIXED' : 'DAMAGED'}`, '', 'Read Service list below to see which ones should have stopped.'], ['register', 'status-log']), discover({ ...state, lastTopic: 'service-006', lastIntent: 'ask_service_status' }, ['EV_SERVICE_ACTIVE'])); break;
      case 'CLEAR': result = { state, output: output(['SCREEN CLEARED. Progress kept.']), clear: true }; break;
      case 'RECOVER': result = argument.toUpperCase() === 'ARCHIVE 006' ? recover(state) : done(output(['Type: RECOVER ARCHIVE 006', 'For instructions, type: HELP RECOVER'], [], 'error')); break;
      case 'DIAG': result = done(output(['SYSTEM CHECK', 'AUTOMATIC MONITOR: WORKING', 'SAVED RECORDS: CANNOT BE EDITED', 'FILE RECOVERY: ALLOWED', 'No maintenance staff are connected.'], ['status-log'])); break;
    }
  } else {
    const languageLike = /[?]|\b(why|what|where|who|when|how|is|was|did|can|could|show|find|thought|explain|clarify|tell|its|it|that|wheres|wasnt)\b/i.test(input);
    result = languageLike ? answer(state, interpretation ?? classify(input, state)) : done(output(['REQUEST NOT UNDERSTOOD.', 'Type HELP for things you can try.', 'You can also ask a question, such as: What is Meridian Systems?'], [], 'error'));
  }
  const history = result.clear ? [] : result.state.terminalHistory;
  return { ...result, state: { ...result.state, terminalHistory: [...history, { input, ...result.output }].slice(-80) } };
}
