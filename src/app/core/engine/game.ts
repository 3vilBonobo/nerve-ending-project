import { DIRECTORIES, FILES, fileById } from '../content';
import { ArchiveFile, EvidenceId, GameState, Interpretation, QueryIntent, TerminalOutput, Transition } from '../models';
import { classify } from '../interpretation/fallback';
import { parseCommand, resolvePath } from './commands';

export const OPENING = ['MERIDIAN SYSTEMS — REMOTE INFORMATION SERVICES', 'REVISION 3.14', '', 'SESSION ESTABLISHED', 'ACCESS: EXTERNAL/LIMITED', 'ARCHIVE SERVICES AVAILABLE', '', 'Type HELP for commands. Ordinary questions are supported.'];
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
  if (!file || (file.locked && !state.archive006Recovered)) return { state, output: output(['FILE NOT FOUND IN ACCESSIBLE INDEX.', 'Use DIR or SEARCH to locate an indexed record.'], [], 'denied') };
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
  if (!found.has('EV_SERVICE_ACTIVE')) missing.push('Operational activity unverified. Run STATUS or inspect the service register.');
  if (!found.has('EV_RETIREMENT_APPROVED')) missing.push('Retirement approval unverified. Inspect the service register or administrative authorization.');
  if (!found.has('EV_TRANSFER_MISSING')) missing.push('Batch prefix and transfer discrepancy unverified. Inspect the 2001 transfer ledger.');
  if (!found.has('EV_REPAIR_REFERENCE')) missing.push('Independent destination slot unverified. Inspect the index repair notes.');
  return missing;
}
export function recover(state: GameState): Transition {
  if (state.archive006Recovered) return { state, output: output(['ARCHIVE 006 ALREADY RESTORED. No changes made.', 'The retained fragment remains available.'], ['fragment'], 'notice') };
  const missing = recoveryMissing(state);
  if (missing.length) return { state, output: output(['RECOVERY HELD / CORROBORATION INCOMPLETE', ...missing], ['recovery-help'], 'denied') };
  const next: GameState = {
    ...state, archive006Recovered: true,
    completedActions: [...new Set([...state.completedActions, 'recover-006', 'restore-legacy-references'])],
  };
  return { state: next, recovered: true, output: output(['ROUTING REFERENCE RECONSTRUCTED: MX-91/006-R', 'INDEPENDENT SOURCES VERIFIED / RETIREMENT APPROVAL PRESENT', '', 'ARCHIVE RECORD RESTORED', 'INDEX RECONCILIATION PARTIAL', '', 'A retained fragment is now available. Open it to inspect the original receipt.'], ['fragment']) };
}
function search(state: GameState, term: string): TerminalOutput {
  if (!term.trim()) return output(['Syntax: SEARCH <term>'], [], 'error');
  const needle = term.toUpperCase();
  const matches = accessibleFiles(state).filter(file => `${file.path} ${file.title} ${file.body}`.toUpperCase().includes(needle));
  const excerpts = matches.map(file => {
    const line = file.body.split('\n').find(text => text.toUpperCase().includes(needle));
    return `${file.path}\n  ${line?.trim() ?? file.title}`;
  });
  return output([`INDEX SEARCH: ${term} / ${matches.length} RECORD(S)`, 'Open a record to verify its contents.', ...excerpts], matches.map(file => file.id));
}
function answer(state: GameState, interpretation: Interpretation): Transition {
  let next = { ...state };
  const respond = (lines: string[], files: string[] = [], evidence: EvidenceId[] = []): Transition => ({ state: discover(next, evidence), output: output(lines, files, 'ok', 'interpretation') });
  if (interpretation.needsClarification) return { state, output: output(['REFERENCE UNCLEAR. Are you asking about service 006?', 'Specify a service, document, or archive operation. Try: "Why is service 006 active?"'], [], 'notice') };
  let intent: QueryIntent = interpretation.intent;
  if (intent === 'ask_clarification') {
    if (!state.lastIntent) return respond(['No previous indexed answer. Specify a service or record.']);
    intent = state.lastIntent;
  }
  if (interpretation.entityId === 'service-006' || intent.startsWith('ask_') && !['ask_company', 'ask_identity'].includes(intent)) next.lastTopic = 'service-006';
  if (intent !== 'unknown' && intent !== 'ask_clarification') next.lastIntent = intent;
  switch (intent) {
    case 'ask_service_status': return respond(['SERVICE 006: ACTIVE.', 'RETIREMENT AUTHORIZATION: RECORDED / 2001-09-18.', 'ARCHIVE TRANSFER: NO CONFIRMED ENTRY.', 'Supervisor restart recorded without an attended session.', 'Operational status and approved disposition disagree. Consult the original records.'], ['register', 'status-log'], ['EV_SERVICE_ACTIVE', 'EV_RETIREMENT_APPROVED']);
    case 'ask_retirement': return respond(['SERVICE 006: RETIREMENT APPROVED / 2001-09-18.', 'An approval is a disposition request. It is not a completed transfer.', 'The operational supervisor still reports the service as active.'], ['register', 'authorization', 'ledger'], ['EV_RETIREMENT_APPROVED']);
    case 'ask_transfer': return respond(['SERVICE 006: NO COMPLETED TRANSFER RECEIPT IN NORMAL INDEX.', 'The 2001 ledger retains a batch prefix. The independent repair notes retain the destination slot.', 'Inspect both original sources before attempting reconciliation.'], ['ledger', 'repair']);
    case 'ask_archive_location': return respond(['SERVICE 006: NORMAL ARCHIVE ENTRY MISSING.', 'Retained storage may contain an unindexed payload.', 'The transfer ledger and index repair notes preserve different parts of its routing reference.'], ['ledger', 'repair']);
    case 'ask_recovery_process': return respond(state.unlockedCapabilities.includes('CAP_ARCHIVE_RECOVERY')
      ? ['CORROBORATION COMPLETE.', 'ROUTING REFERENCE: MX-91/006-R.', 'To reconcile the retained entry, enter RECOVER ARCHIVE 006.', 'Recovery does not terminate service 006.']
      : ['ARCHIVE RECOVERY REQUIRES INDEPENDENT CORROBORATION.', ...recoveryMissing(state), 'When verified, enter RECOVER ARCHIVE 006. The reference is assembled automatically.'], ['recovery-help', 'ledger', 'repair']);
    case 'ask_authorization': return respond(['RETIREMENT AUTHORIZATION ENTRY PRESENT / 2001-09-18.', 'SIGNATORY FIELD: PARTIALLY UNREADABLE.', 'No full signatory can be established from this transcription.'], ['authorization']);
    case 'ask_company': return respond(['MERIDIAN SYSTEMS / BIOMEDICAL MONITORING AND INFORMATION MANAGEMENT.', 'This remote mirror provides retained corporate and operational records.', 'Commercial inquiries are no longer processed.'], ['company', 'readme']);
    case 'ask_identity': return respond(['MERIDIAN SYSTEMS / REMOTE INFORMATION SERVICES.', 'REVISION 3.14 / EXTERNAL-LIMITED SESSION.', 'Indexed query interface. No attended operator is connected.'], ['readme']);
    case 'request_file': return inspectFile(next, interpretation.fileId ?? '');
    case 'request_search': return { state: next, output: search(next, interpretation.searchTerm ?? '') };
    default: return { state, output: output(['NO INDEXED INTERPRETATION.', 'Ask about service 006, retirement, transfers, or archive recovery.', 'Use SEARCH <term> for literal records, or HELP for command syntax.'], [], 'notice') };
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
          'MERIDIAN REMOTE CLIENT / COMMAND REFERENCE', '',
          'HELP [RECOVER]           Command / recovery reference',
          'DIR [path] / LS          List accessible records',
          'CD <path>               Change directory; .. returns up',
          'OPEN <file or path>     Inspect an original record',
          'SEARCH <term>           Search the accessible index',
          'STATUS                  Operational service snapshot',
          'CLEAR / CLS             Clear scrollback; keep progress',
          'RECOVER ARCHIVE 006      Reconcile a verified archive', '',
          'Natural-language questions are supported.',
          'Try: "Why is service six still running?"',
          'Use arrow keys for input history. File paths are clickable.',
        ], ['readme']));
        break;
      case 'DIR': {
        const directory = resolvePath(argument || '.', state.currentDirectory);
        if (!DIRECTORIES.includes(directory as typeof DIRECTORIES[number])) { result = done(output([`DIRECTORY NOT FOUND: ${directory}`, 'Try DIR / to list root directories.'], [], 'error')); break; }
        const dirs = DIRECTORIES.filter(path => path !== '/' && path.slice(0, path.lastIndexOf('/')) === (directory === '/' ? '' : directory));
        const files = accessibleFiles(state).filter(file => file.path.slice(0, file.path.lastIndexOf('/')) === directory);
        result = done(output([`DIRECTORY OF ${directory}`, ...dirs.map(path => ` <DIR>  ${path.split('/').pop()}`), ...files.map(file => ` ${file.modified}  ${file.path.split('/').pop()}`), `${dirs.length} DIRECTORY(S) / ${files.length} FILE(S)`], files.map(file => file.id)));
        break;
      }
      case 'CD': {
        const path = resolvePath(argument || '/', state.currentDirectory);
        result = DIRECTORIES.includes(path as typeof DIRECTORIES[number]) ? done(output([`DIRECTORY: ${path}`]), { ...state, currentDirectory: path }) : done(output([`DIRECTORY NOT FOUND: ${path}`, 'Use DIR / to locate an accessible directory.'], [], 'error'));
        break;
      }
      case 'OPEN': {
        const path = resolvePath(argument, state.currentDirectory);
        const file = accessibleFiles(state).find(item => item.path === path);
        result = file ? inspectFile(state, file.id) : done(output([argument ? `FILE NOT FOUND IN ACCESSIBLE INDEX: ${path}` : 'Syntax: OPEN <file or path>', 'Use DIR or SEARCH. Example: OPEN /OPERATIONS/SERVICE_REGISTER.DAT'], [], 'error'));
        break;
      }
      case 'SEARCH': result = done(search(state, argument)); break;
      case 'STATUS': result = done(output(['MERIDIAN REMOTE INFORMATION SERVICES / REV 3.14', `SESSION: ${state.sessionId} / EXTERNAL/LIMITED`, '', 'SERVICE 004: RETIRED / OFFLINE', 'SERVICE 005: RETIRED / OFFLINE', 'SERVICE 006: ACTIVE', 'SERVICE 007: ACTIVE / REMOTE MIRROR', `ARCHIVE INDEX: ${state.archive006Recovered ? 'PARTIALLY RECONCILED' : 'DEGRADED'}`, 'RETIREMENT DISPOSITION: CONSULT ORIGINAL REGISTER.'], ['register', 'status-log']), discover({ ...state, lastTopic: 'service-006', lastIntent: 'ask_service_status' }, ['EV_SERVICE_ACTIVE'])); break;
      case 'CLEAR': result = { state, output: output(['SCROLLBACK CLEARED. Investigation progress retained.']), clear: true }; break;
      case 'RECOVER': result = argument.toUpperCase() === 'ARCHIVE 006' ? recover(state) : done(output(['Syntax: RECOVER ARCHIVE 006', 'Use HELP RECOVER for corroboration requirements.'], [], 'error')); break;
      case 'DIAG': result = done(output(['LOCAL SUPERVISOR: RESPONDING', 'REMOTE MIRROR: READ-ONLY', 'INDEX RECONCILIATION: EXTERNAL PERMITTED', 'No attended maintenance channel.'], ['status-log'])); break;
    }
  } else {
    const languageLike = /[?]|\b(why|what|where|who|when|how|is|was|did|can|could|show|find|thought|explain|clarify|tell|its|it|that|wheres|wasnt)\b/i.test(input);
    result = languageLike ? answer(state, interpretation ?? classify(input, state)) : done(output(['UNRECOGNIZED COMMAND. Type HELP for command syntax.', 'For records use SEARCH <term>, or ask a full question.'], [], 'error'));
  }
  const history = result.clear ? [] : result.state.terminalHistory;
  return { ...result, state: { ...result.state, terminalHistory: [...history, { input, ...result.output }].slice(-80) } };
}
