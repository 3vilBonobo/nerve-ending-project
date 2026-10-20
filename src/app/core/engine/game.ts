import { DIRECTORIES, FILES, fileById } from '../content';
import { ArchiveFile, EvidenceId, GameState, Interpretation, QueryIntent, TerminalOutput, Transition } from '../models';
import { classify } from '../interpretation/fallback';
import { parseCommand, resolvePath } from './commands';

export const OPENING = ['MERIDIAN SYSTEMS — REMOTE INFORMATION SERVICES', 'REVISION 3.14', '', 'CONNECTION READY', 'ACCESS: EXTERNAL / LIMITED', 'COMPANY ARCHIVE: AVAILABLE', '', 'Type HELP for commands, or ask a question.', 'Start with STATUS to see which services are running.'];
export const output = (lines: string[], fileIds: string[] = [], code: TerminalOutput['code'] = 'ok', truth: TerminalOutput['truth'] = 'system'): TerminalOutput => ({
  lines, code, truth, links: fileIds.flatMap(id => { const file = fileById(id); return file ? [{ fileId: id, label: file.path }] : []; }),
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
  if (!file || (file.locked && !state.archive006Recovered)) return { state, output: output(['FILE NOT FOUND.', 'Use DIR to list files, or SEARCH <term> to find a record.'], [], 'denied') };
  const next = discover({
    ...state, lastFileId: file.id,
    lastTopic: file.evidence.length ? 'service-006' : state.lastTopic,
    viewedFileIds: [...new Set([...state.viewedFileIds, file.id])],
    openFileIds: [...state.openFileIds.filter(id => id !== file.id), file.id].slice(-5),
  }, file.evidence);
  return { state: { ...next, act01Complete: next.act01Complete || (file.id === 'fragment' && next.archive006Recovered) }, output: output([`READ-ONLY RECORD / ${file.path}`, file.body], [], 'ok', 'record'), openFileId: file.id };
}
export function recoveryMissing(state: GameState): string[] {
  const found = new Set(state.discoveredEvidenceIds);
  const missing: string[] = [];
  if (!found.has('EV_SERVICE_ACTIVE')) missing.push('Check if 006 is running: use STATUS or read the service register.');
  if (!found.has('EV_RETIREMENT_APPROVED')) missing.push('Check retirement approval: read the service register or approval record.');
  if (!found.has('EV_TRANSFER_MISSING')) missing.push('Find the batch code: read the 2001 transfer ledger.');
  if (!found.has('EV_REPAIR_REFERENCE')) missing.push('Find the storage slot: read the index repair notes.');
  return missing;
}
export function recover(state: GameState): Transition {
  if (state.archive006Recovered) return { state, output: output(['ARCHIVE 006: ALREADY RESTORED.', 'No changes made. The recovered file is ready to read.'], ['fragment'], 'notice') };
  const missing = recoveryMissing(state);
  if (missing.length) return { state, output: output(['RECOVERY BLOCKED / CHECKS MISSING', ...missing], ['recovery-help'], 'denied') };
  const next: GameState = {
    ...state, archive006Recovered: true,
    completedActions: [...new Set([...state.completedActions, 'recover-006', 'restore-legacy-references'])],
  };
  return { state: next, recovered: true, output: output(['STORAGE REFERENCE: MX-91/006-R', 'SOURCE CHECKS: PASSED / RETIREMENT APPROVED', '', 'ARCHIVE RECORD: RESTORED', 'FILE LIST: PARTLY REPAIRED', 'SERVICE 006: STILL RUNNING', '', 'Open the recovered file below to read the transfer receipt.'], ['fragment']) };
}
function search(state: GameState, term: string): TerminalOutput {
  if (!term.trim()) return output(['Syntax: SEARCH <term>'], [], 'error');
  const needle = term.toUpperCase();
  const matches = accessibleFiles(state).filter(file => `${file.path} ${file.title} ${file.body}`.toUpperCase().includes(needle));
  const excerpts = matches.map(file => {
    const line = file.body.split('\n').find(text => text.toUpperCase().includes(needle));
    return `${file.path}\n  ${line?.trim() ?? file.title}`;
  });
  return output([`SEARCH: ${term} / ${matches.length} RECORD(S) FOUND`, 'Open a file below to read the full record.', ...excerpts], matches.map(file => file.id));
}
function answer(state: GameState, interpretation: Interpretation): Transition {
  let next = { ...state };
  const respond = (lines: string[], files: string[] = [], evidence: EvidenceId[] = []): Transition => ({ state: discover(next, evidence), output: output(lines, files, 'ok', 'interpretation') });
  if (interpretation.needsClarification) return { state, output: output(['SUBJECT UNCLEAR.', 'Which service or record do you mean?', 'Try: "Why is service 006 still running?"'], [], 'notice') };
  let intent: QueryIntent = interpretation.intent;
  if (intent === 'ask_clarification') {
    if (!state.lastIntent) return respond(['NO PREVIOUS ANSWER.', 'Name the service or record you want to ask about.']);
    intent = state.lastIntent;
  }
  if (interpretation.entityId === 'service-006' || intent.startsWith('ask_') && !['ask_company', 'ask_identity'].includes(intent)) next.lastTopic = 'service-006';
  if (intent !== 'unknown' && intent !== 'ask_clarification') next.lastIntent = intent;
  switch (intent) {
    case 'ask_service_status': return respond(['SERVICE 006: ACTIVE.', 'RETIREMENT APPROVED: 2001-09-18.', 'TRANSFER RECEIPT: MISSING.', '006 was approved for shutdown, but it is still running.', 'The supervisor restarted it automatically. No operator was connected.', 'Check the register and status log below.'], ['register', 'status-log'], ['EV_SERVICE_ACTIVE', 'EV_RETIREMENT_APPROVED']);
    case 'ask_retirement': return respond(['SERVICE 006: RETIREMENT APPROVED / 2001-09-18.', 'Retirement means shutdown and transfer to storage.', 'Approval is recorded. Completed transfer is not.', '006 is still running. Check the transfer ledger.'], ['register', 'authorization', 'ledger'], ['EV_RETIREMENT_APPROVED']);
    case 'ask_transfer': return respond(['SERVICE 006: TRANSFER RECEIPT MISSING FROM FILE LIST.', 'Read the 2001 transfer ledger for the batch code.', 'Read the index repair notes for the storage slot.', 'Both records are required before recovery.'], ['ledger', 'repair']);
    case 'ask_archive_location': return respond(['SERVICE 006: ARCHIVE ENTRY MISSING.', 'The stored files may still exist, even if the file list is damaged.', 'The transfer ledger and index repair notes each hold part of the storage reference.', 'Read both records below.'], ['ledger', 'repair']);
    case 'ask_recovery_process': return respond(state.unlockedCapabilities.includes('CAP_ARCHIVE_RECOVERY')
      ? ['RECOVERY CHECKS: PASSED.', 'STORAGE REFERENCE: MX-91/006-R.', 'Enter RECOVER ARCHIVE 006 to restore the missing entry.', 'This makes the file readable. It does not stop service 006.']
      : ['RECOVERY CHECKS: INCOMPLETE.', ...recoveryMissing(state), 'After these checks, enter RECOVER ARCHIVE 006.', 'The utility combines the reference parts for you.'], ['recovery-help', 'ledger', 'repair']);
    case 'ask_authorization': return respond(['RETIREMENT APPROVED: 2001-09-18.', 'SIGNED BY: PARTLY UNREADABLE.', 'The damaged approval record does not show the full code.', 'Open the record below to check it.'], ['authorization']);
    case 'ask_company': return respond(['MERIDIAN SYSTEMS / COMPANY RECORDS.', 'Manufacturer of medical monitoring and information equipment.', 'This connection provides company and service records.', 'Sales inquiries are no longer handled here.'], ['company', 'readme']);
    case 'ask_identity': return respond(['MERIDIAN SYSTEMS / REMOTE INFORMATION SERVICES.', 'REVISION 3.14 / ACCESS: EXTERNAL-LIMITED.', 'Automated records terminal. No human operator is connected.'], ['readme']);
    case 'request_file': return inspectFile(next, interpretation.fileId ?? '');
    case 'request_search': return { state: next, output: search(next, interpretation.searchTerm ?? '') };
    default: return { state, output: output(['QUESTION NOT RECOGNIZED.', 'Ask about service 006, retirement, transfers, or archive recovery.', 'Try: "Why is service 006 still running?"', 'Use SEARCH <term> to find records, or HELP for commands.'], [], 'notice') };
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
          'MERIDIAN REMOTE CLIENT / COMMANDS', '',
          'STATUS                  Show which services are running',
          'DIR [path] / LS          List files and folders',
          'CD <path>               Change folder; CD .. goes up',
          'OPEN <file or path>     Read a file',
          'SEARCH <term>           Find records containing a word',
          'CLEAR / CLS             Clear terminal text; keep progress',
          'HELP RECOVER            Show the recovery steps',
          'RECOVER ARCHIVE 006      Restore the missing archive entry', '',
          '<...> means enter a value. [...] means optional.',
          'You can also ask questions.',
          'Try: "Why is service six still running?"',
          'Use Up/Down to recall commands. Select a file link to read it.',
        ], ['readme']));
        break;
      case 'DIR': {
        const directory = resolvePath(argument || '.', state.currentDirectory);
        if (!DIRECTORIES.includes(directory as typeof DIRECTORIES[number])) { result = done(output([`DIRECTORY NOT FOUND: ${directory}`, 'Use DIR / to list the main folders.'], [], 'error')); break; }
        const dirs = DIRECTORIES.filter(path => path !== '/' && path.slice(0, path.lastIndexOf('/')) === (directory === '/' ? '' : directory));
        const files = accessibleFiles(state).filter(file => file.path.slice(0, file.path.lastIndexOf('/')) === directory);
        result = done(output([`DIRECTORY OF ${directory}`, ...dirs.map(path => ` <DIR>  ${path.split('/').pop()}`), ...files.map(file => ` ${file.modified}  ${file.path.split('/').pop()}`), `${dirs.length} DIRECTORY(S) / ${files.length} FILE(S)`], files.map(file => file.id)));
        break;
      }
      case 'CD': {
        const path = resolvePath(argument || '/', state.currentDirectory);
        result = DIRECTORIES.includes(path as typeof DIRECTORIES[number]) ? done(output([`DIRECTORY: ${path}`]), { ...state, currentDirectory: path }) : done(output([`DIRECTORY NOT FOUND: ${path}`, 'Use DIR / to list the main folders.'], [], 'error'));
        break;
      }
      case 'OPEN': {
        const path = resolvePath(argument, state.currentDirectory);
        const file = accessibleFiles(state).find(item => item.path === path);
        result = file ? inspectFile(state, file.id) : done(output([argument ? `FILE NOT FOUND: ${path}` : 'Syntax: OPEN <file or path>', 'Use DIR to list files, or SEARCH <term> to find one.', 'Example: OPEN /OPERATIONS/SERVICE_REGISTER.DAT'], [], 'error'));
        break;
      }
      case 'SEARCH': result = done(search(state, argument)); break;
      case 'STATUS': result = done(output(['MERIDIAN REMOTE INFORMATION SERVICES / REV 3.14', `SESSION: ${state.sessionId} / EXTERNAL/LIMITED`, '', 'SERVICE 004: RETIRED / OFFLINE', 'SERVICE 005: RETIRED / OFFLINE', 'SERVICE 006: ACTIVE', 'SERVICE 007: ACTIVE / REMOTE RECORDS', `ARCHIVE FILE LIST: ${state.archive006Recovered ? 'PARTLY REPAIRED' : 'DAMAGED'}`, 'Open the service register below to check retirement approvals.'], ['register', 'status-log']), discover({ ...state, lastTopic: 'service-006', lastIntent: 'ask_service_status' }, ['EV_SERVICE_ACTIVE'])); break;
      case 'CLEAR': result = { state, output: output(['TERMINAL TEXT CLEARED. Progress saved.']), clear: true }; break;
      case 'RECOVER': result = argument.toUpperCase() === 'ARCHIVE 006' ? recover(state) : done(output(['Syntax: RECOVER ARCHIVE 006', 'Use HELP RECOVER for the required checks.'], [], 'error')); break;
      case 'DIAG': result = done(output(['LOCAL SUPERVISOR: RESPONDING', 'REMOTE RECORDS: READ-ONLY', 'ARCHIVE RECOVERY: EXTERNAL ACCESS ALLOWED', 'No maintenance operator is connected.'], ['status-log'])); break;
    }
  } else {
    const languageLike = /[?]|\b(why|what|where|who|when|how|is|was|did|can|could|show|find|thought|explain|clarify|tell|its|it|that|wheres|wasnt)\b/i.test(input);
    result = languageLike ? answer(state, interpretation ?? classify(input, state)) : done(output(['COMMAND NOT RECOGNIZED. Type HELP for commands.', 'Use SEARCH <term> to find records, or ask a full question.'], [], 'error'));
  }
  const history = result.clear ? [] : result.state.terminalHistory;
  return { ...result, state: { ...result.state, terminalHistory: [...history, { input, ...result.output }].slice(-80) } };
}
