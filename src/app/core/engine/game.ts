import { DIRECTORIES, FILES, fileById, fileByName } from '../content';
import { ArchiveFile, EvidenceId, GameState, Interpretation, QueryIntent, TerminalOutput, Transition } from '../models';
import { classify } from '../interpretation/fallback';
import { parseCommand, resolvePath } from './commands';

export const OPENING = [
  'MERIDIAN SYSTEMS / RECORDS ACCESS', 'R-02 / 06 NOV 2003, 02:14', '',
  'PUBLIC OFFICE: CLOSED', 'Remote records available.', '',
  'SWITCHBOARD / 02:13', 'Outgoing call to NIGHT DESK: NO ANSWER',
  'First queued: 18 Sep 2001.',
];
export const output = (lines: string[], fileIds: string[] = [], code: TerminalOutput['code'] = 'ok', truth: TerminalOutput['truth'] = 'system'): TerminalOutput => ({
  lines, code, truth, links: fileIds.flatMap(id => { const file = fileById(id); return file ? [{ fileId: id, label: file.title }] : []; }),
});
export function newGame(now = new Date().toISOString(), sessionId = `MR-${Math.random().toString(16).slice(2, 6).toUpperCase()}`): GameState {
  return {
    schemaVersion: 3, sessionId, startedAt: now, currentDirectory: '/', discoveredEvidenceIds: [], unlockedCapabilities: ['CAP_ARCHIVE_RECOVERY'], viewedFileIds: [], openFileIds: [], completedActions: [],
    archive006Recovered: false, act01Complete: false, hasStarted: false,
    terminalHistory: [{ input: '', ...output(OPENING, ['call', 'company']) }], ui: { crtEnabled: true, fontScale: 1, terminalMode: 'maximized' },
  };
}
export const accessibleFiles = (state: GameState): readonly ArchiveFile[] => FILES.filter(file => !file.locked || state.archive006Recovered);
export function deriveKnowledge(state: GameState): GameState {
  // Reading a backup is an ordinary records permission, not a reading-order puzzle.
  return { ...state, unlockedCapabilities: ['CAP_ARCHIVE_RECOVERY'] };
}
function discover(state: GameState, evidence: readonly EvidenceId[]): GameState {
  return deriveKnowledge({ ...state, discoveredEvidenceIds: [...new Set([...state.discoveredEvidenceIds, ...evidence])] });
}
export function inspectFile(state: GameState, fileId: string): Transition {
  const file = fileById(fileId);
  if (!file) return { state, output: output(['FILE NOT FOUND.', 'DIR lists the available records.'], [], 'denied') };
  if (file.locked && !state.archive006Recovered) return { state, output: output(['ORIGINAL ATTACHMENT UNAVAILABLE.', 'A local backup is listed in the attachment record.'], ['ledger'], 'notice') };
  const next = discover({
    ...state, lastFileId: file.id,
    lastTopic: file.evidence.length ? 'service-006' : state.lastTopic,
    viewedFileIds: [...new Set([...state.viewedFileIds, file.id])],
    openFileIds: [...state.openFileIds.filter(id => id !== file.id), file.id].slice(-5),
  }, file.evidence);
  return {
    state: { ...next, act01Complete: next.act01Complete || file.id === 'fragment' },
    output: output([`OPENED: ${file.title}`, `Saved: ${file.modified}`], [], 'ok', 'record'), openFileId: file.id,
  };
}
export function recover(state: GameState): Transition {
  const restored = !state.archive006Recovered;
  const next = restored ? {
    ...state, archive006Recovered: true,
    completedActions: [...new Set([...state.completedActions, 'recover-006', 'restore-legacy-references'])],
  } : state;
  const opened = inspectFile(next, 'fragment');
  return { ...opened, recovered: restored, output: output([restored ? 'LOCAL BACKUP LOADED.' : 'LOCAL BACKUP OPEN.', 'Original record unchanged.'], [], 'ok', 'record') };
}
function search(state: GameState, term: string): TerminalOutput {
  if (!term.trim()) return output(['Enter a word after SEARCH.', 'Example: SEARCH company'], [], 'error');
  const needle = term.toUpperCase();
  const matches = accessibleFiles(state).filter(file => `${file.path} ${file.title} ${file.body}`.toUpperCase().includes(needle));
  const excerpts = matches.map(file => `${file.title}\n  ${file.body.split('\n').find(line => line.toUpperCase().includes(needle))?.trim() ?? file.title}`);
  return output([`SEARCH: ${term} / FILES FOUND: ${matches.length}`, ...excerpts], matches.map(file => file.id));
}
function answer(state: GameState, interpretation: Interpretation, input: string): Transition {
  let next = { ...state };
  const respond = (lines: string[], files: string[] = [], evidence: EvidenceId[] = []): Transition => ({ state: discover(next, evidence), output: output(lines, files, 'ok', 'interpretation') });
  if (interpretation.needsClarification) return { state, output: output([interpretation.clarification ?? 'Which service or record do you mean?'], [], 'notice') };
  const other = interpretation.entityId?.match(/^service-(004|005|007)$/)?.[1];
  if (other && ['ask_service_status', 'ask_retirement'].includes(interpretation.intent)) {
    const services: Record<string, string[]> = { '004': ['004 / BILLING', 'Live state: stopped', 'Office record: closed, 18 Sep 2001'], '005': ['005 / BUILDING SENSORS', 'Live state: stopped', 'Office record: closed, 18 Sep 2001'], '007': ['007 / RECORDS ACCESS', 'Live state: running', 'This is the connection you are using.'] };
    next.lastTopic = interpretation.entityId;
    return respond(services[other], other === '007' ? ['readme'] : ['authorization']);
  }
  let intent: QueryIntent = interpretation.intent;
  if (intent === 'ask_clarification') {
    if (!state.lastIntent) return respond(['Which record do you mean?']);
    if (state.lastIntent === 'ask_calls') return respond(['The same call is retried at 02:13.', 'The night desk does not answer.', 'The last confirmation on file is from 2001.'], ['call']);
    if (state.lastIntent === 'ask_service_status') return respond(['The live monitor shows 006 running.', 'The office paperwork lists it as closed.', 'These are separate records, made on different dates.'], ['register', 'authorization']);
    intent = state.lastIntent;
  }
  if (!['ask_company', 'ask_identity', 'ask_office', 'ask_staff', 'ask_access', 'ask_dates', 'ask_record_integrity', 'ask_next', 'unknown', 'request_search'].includes(intent)) next.lastTopic = 'service-006';
  if (intent !== 'unknown') next.lastIntent = intent;
  switch (intent) {
    case 'ask_calls':
      if (/who|from|source|origin|caller|making.*(?:noise|ring)/i.test(input)) return respond(['FROM: SERVICE 006', 'An automatic overnight alarm.', 'No staff operator is connected.'], ['register'], ['EV_CALL_PENDING']);
      if (/when|since|how long|how many (?:years|days|months)/i.test(input)) return respond(['FIRST QUEUED: 18 SEP 2001, 23:59', 'Latest attempt: 06 Nov 2003, 02:13', 'No answer.'], ['call'], ['EV_CALL_PENDING']);
      return respond(['OVERNIGHT CALL / NIGHT DESK 214', 'The alarm remains in the overnight queue.', 'Latest attempt: 02:13 / No answer.'], ['call'], ['EV_CALL_PENDING']);
    case 'ask_recipient': return respond(state.archive006Recovered
      ? ['CALL DESTINATION: NIGHT DESK / 214', 'The saved confirmation came from COMMS/BRIDGE-02.', 'No staff name can be read from the receipt.']
      : ['CALL DESTINATION: NIGHT DESK / 214', 'The phone was removed on 18 Sep 2001 at 17:00.', 'No replacement number is listed.'], state.archive006Recovered ? ['fragment', 'maintenance'] : ['maintenance'], ['EV_DESK_CLOSED']);
    case 'ask_office': return /why|reason/i.test(input)
      ? respond(['PUBLIC OFFICE CLOSED / 18 SEP 2001', 'The reason for closure is not recorded in this copy.', 'Telephone reception ended at 17:00.'], ['company'])
      : respond(['PUBLIC OFFICE CLOSED / 18 SEP 2001', 'Reception ended at 17:00.', 'Last staff sign-in: 19 Sep 2001, 08:10', 'This records connection is unattended.'], ['company', 'maintenance']);
    case 'ask_service_status': return /restart|start.*again|back (?:on|online)|turned.*back|brought.*back/i.test(input)
      ? respond(['LAST RESTART / 02 NOV 2003, 03:14:09', 'Started by: automatic monitor', 'Reason: handover not closed', 'Operator: none'], ['status-log'], ['EV_SERVICE_ACTIVE'])
      : respond(['006 / CONTINUITY MONITOR', 'Function: overnight alarms', 'Live state: running', 'Office record: closed, 18 Sep 2001', 'Last connected operator: no entry'], ['register', 'authorization'], ['EV_SERVICE_ACTIVE']);
    case 'ask_retirement': return respond(['OFFICE RECORD / 18 SEP 2001', '006 is listed as closed. Shutdown was approved.', 'The automatic monitor restarted it on 02 Nov 2003.', 'Recorded reason: handover not closed.'], ['authorization', 'status-log'], ['EV_RETIREMENT_APPROVED']);
    case 'ask_transfer':
    case 'ask_archive_location':
      if (/hold|withheld|release|handover not closed/i.test(input)) return state.archive006Recovered
        ? respond(['SERVICE RELEASE: WITHHELD', 'The receipt requires a reply from the holding system.', 'The office shutdown order does not clear that hold.', 'No release reply is present in this copy.'], ['fragment'])
        : respond(['HANDOVER RECORD INCOMPLETE.', 'The office list names an attachment.', 'Its original is unavailable; a local copy is listed.'], ['ledger']);
      return respond(state.archive006Recovered
      ? ['HANDOVER RECEIPT / BACKUP AVAILABLE', 'Transfer: accepted, 18 Sep 2001 at 23:59:41', 'Service release: withheld']
      : ['HANDOVER RECEIPT', 'The attachment is named in the call record.', 'Original file: not listed', 'Local backup: available'], state.archive006Recovered ? ['fragment'] : ['ledger']);
    case 'ask_recovery_process':
      if (/complete|unreadable|name|damaged|reconstruct/i.test(input)) return state.archive006Recovered
        ? respond(['BACKUP COPY: PARTIAL', 'Some fields could not be read.', 'No clearer staff name is present in this copy.', 'Reading the backup does not repair missing data.'], ['fragment'])
        : respond(['LOCAL BACKUP: AVAILABLE', 'The attachment record lists a saved copy.', 'Its contents have not been loaded in this session.'], ['ledger']);
      return respond(['A local backup of the attachment is available.', 'It can be read without changing the original.', 'Reading a record does not switch off a service.'], [state.archive006Recovered ? 'fragment' : 'ledger']);
    case 'ask_authorization':
      if (/0417/.test(input) && !state.archive006Recovered) return respond(['NO MATCH IN THE CURRENT DIRECTORY.']);
      return respond(state.archive006Recovered
        ? ['AUTHORISATION: 0417 [PARTIAL]', 'Staff name: unreadable', 'No matching name in the current directory.']
        : ['SHUTDOWN ORDER / 18 SEP 2001', 'Filed by: J. Kell', 'The handover attachment is not in the active file list.'], [state.archive006Recovered ? 'fragment' : 'authorization']);
    case 'ask_company': return /own(?:ed|er)|found(?:ed|er)/i.test(input)
      ? respond(['MERIDIAN SYSTEMS', 'No owner or founder is named in this copy.', 'The company notice describes medical monitoring equipment.'], ['company'])
      : respond(['MERIDIAN SYSTEMS', 'Medical monitoring equipment.', 'The public office closed in September 2001.', 'Technical records remain online for equipment owners.'], ['company']);
    case 'ask_identity': return respond(['MERIDIAN RECORDS / R-02', 'Automatic records access.', 'No staff terminal is connected.'], ['readme']);
    case 'ask_staff':
      if (/removed|disconnect/i.test(input)) return respond(['NIGHT DESK PHONE', 'E. Lin reported its removal on 19 Sep 2001.', 'The note does not name the person who removed it.'], ['maintenance']);
      if (/home|contact|number|where.*lin/i.test(input)) return respond(['E. LIN / LAST SHIFT NOTE', 'Asked for alarms not to be forwarded to a home number.', 'The number and a current contact address are not listed.'], ['maintenance']);
      return respond(['STAFF NAMES IN THIS COPY', 'E. Lin: sent the last shift note.', 'J. Kell: filed the service closure list.', 'No complete staff directory is available.'], ['maintenance', 'authorization']);
    case 'ask_access': return respond(['ACCESS: EXTERNAL / RECORDS ONLY', 'You can read files and search this copy.', 'This connection cannot edit records or control equipment.', 'Messages typed here are not sent to office staff.'], ['readme', 'company']);
    case 'ask_dates': return respond(['SYSTEM DATE: 06 NOV 2003', 'Office closure records: September 2001.', 'Live monitor readings: November 2003.', 'A saved file date and an event date can differ.', 'No time zone or independent clock check is recorded.'], ['company', 'register']);
    case 'ask_record_integrity': return respond(['RECORDS CHECK', 'The office list is saved paperwork; the monitor is a later reading.', 'This copy has no complete edit history.', 'Missing or unreadable fields cannot be filled from these records.', 'Answers use the available records; unknown details remain unknown.'], ['authorization', 'register']);
    case 'ask_next': return respond(['RECORDS ACCESS / CONTROLS', 'Select a file name to read it. Linked records are attached files.', 'DIR lists folders. SEARCH followed by a word finds records.', 'Ask about something in a record, in ordinary words.', 'Esc shows a full reply without waiting for the typing.'], ['readme']);
    case 'request_backup': return classify(input, state).intent === 'request_backup' ? recover(next) : respond(['A local backup is listed with the attachment.'], ['ledger']);
    case 'request_stop': return respond(['CONTROL UNAVAILABLE.', 'This connection can read records only.', 'Last recorded stop request: 02 Nov 2003.'], ['status-log']);
    case 'request_file': return inspectFile(next, interpretation.fileId ?? '');
    case 'request_search': return { state: next, output: search(next, interpretation.searchTerm ?? '') };
    default: {
      const words = input.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(word => word.length > 3 && !['what', 'where', 'which', 'there', 'about', 'please', 'would', 'could', 'does', 'that', 'this', 'have', 'with', 'from', 'tell', 'happened', 'know'].includes(word));
      const matches = accessibleFiles(state).filter(file => words.some(word => `${file.title} ${file.body}`.toLowerCase().includes(word)));
      return { state, output: matches.length ? output(['RECORD MATCHES', ...matches.map(file => file.title)], matches.map(file => file.id)) : output(['NO MATCH IN THIS COPY OF THE RECORDS.'], [], 'notice') };
    }
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
      case 'HELP': result = done(output(argument.toUpperCase() === 'RECOVER'
        ? ['BACKUP READER', 'Reads a saved copy when the original attachment is unavailable.', 'It does not change the original or control running services.']
        : ['TERMINAL HELP', '', 'Questions can be written in ordinary words.', 'What is Meridian Systems?', 'Is this an automatic system?', 'Show me the office notice.', '', 'Select a file name to read it.', 'DIR                    List folders and files', 'OPEN Office notice     Read a named file', 'SEARCH company         Search the records', 'STATUS                 View the live monitor', 'CLEAR                  Clear terminal text', '', 'CD /SYSTEM opens a folder. CD .. goes back.', 'Up/Down recalls earlier input. Esc shows a full reply.'], ['readme'])); break;
      case 'DIR': {
        const directory = resolvePath(argument || '.', state.currentDirectory);
        if (!DIRECTORIES.includes(directory as typeof DIRECTORIES[number])) { result = done(output([`FOLDER NOT FOUND: ${directory}`], [], 'error')); break; }
        const dirs = DIRECTORIES.filter(path => path !== '/' && directory === '/');
        const files = accessibleFiles(state).filter(file => file.path.slice(0, file.path.lastIndexOf('/')) === directory);
        result = done(output([`FOLDER: ${directory}`, ...dirs.map(path => ` <FOLDER> ${path.slice(1)}`), ...files.map(file => ` ${file.modified}  ${file.title}`)], files.map(file => file.id))); break;
      }
      case 'CD': {
        const path = resolvePath(argument || '/', state.currentDirectory);
        result = DIRECTORIES.includes(path as typeof DIRECTORIES[number]) ? done(output([`FOLDER: ${path}`]), { ...state, currentDirectory: path }) : done(output([`FOLDER NOT FOUND: ${path}`], [], 'error')); break;
      }
      case 'OPEN': {
        if (/^(?:the )?(?:local )?backup(?: copy| receipt)?$/i.test(argument)) { result = recover(state); break; }
        const path = resolvePath(argument, state.currentDirectory);
        const file = FILES.find(item => item.path === path) ?? fileByName(argument);
        result = file ? inspectFile(state, file.id) : done(output([argument ? `FILE NOT FOUND: ${argument}` : 'Enter a file name after OPEN.', 'Example: OPEN Office notice'], [], 'error')); break;
      }
      case 'SEARCH': result = done(search(state, argument)); break;
      case 'STATUS': result = done(output(['LIVE MONITOR / 06 NOV 2003, 02:14', '004  Billing               Stopped', '005  Building sensors      Stopped', '006  Continuity monitor    Running', '007  Records access        Running', '', 'No staff terminal connected.'], ['register']), discover({ ...state, lastTopic: 'service-006', lastIntent: 'ask_service_status' }, ['EV_SERVICE_ACTIVE'])); break;
      case 'CLEAR': result = { state, output: output(['SCREEN CLEARED.']), clear: true }; break;
      case 'RECOVER': result = /^(?:ARCHIVE\s+)?(?:006|BACKUP|RECEIPT|HANDOVER RECEIPT)$/i.test(argument) ? recover(state) : done(output(['No local backup matched that name.'], [], 'error')); break;
      case 'DIAG': result = done(output(['R-02 / RECORDS CONNECTION', 'Monitor: responding', 'Original records: read only', 'Control access: unavailable'], ['readme'])); break;
    }
  } else {
    const query = interpretation ?? classify(input, state);
    const question = /[?]|\b(why|what|where|who|when|how|is|was|did|can|could|show|find|explain|tell)\b/i.test(input);
    result = query.intent !== 'unknown' || query.needsClarification || question ? answer(state, query, input) : done(output(['REQUEST NOT RECOGNISED.', 'HELP lists the available controls.'], [], 'error'));
  }
  const history = result.clear ? [] : result.state.terminalHistory;
  return { ...result, state: { ...result.state, terminalHistory: [...history, { input, ...result.output }].slice(-80) } };
}
