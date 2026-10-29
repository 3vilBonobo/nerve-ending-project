import { DIRECTORIES, FILES, fileById, fileByName } from '../content';
import { ArchiveFile, EvidenceId, GameState, Interpretation, QueryIntent, TerminalOutput, Transition } from '../models';
import { classify } from '../interpretation/fallback';
import { parseCommand, resolvePath } from './commands';
import { initialStory } from '../story-state';
import { canRead, executeOperation, knows, nextHint, parseOperation } from './continuation';
import { answerDialogue } from './dialogue';
import { legacyResponseTrace } from './response-trace';
import { initialInvestigation, openingInteraction } from './investigation';
import { findPublicPersonnel, publicPersonnelLines } from '../corporate-records';
import { answerCorporate } from './corporate';
import { answerService, serviceCommand, serviceDetails, serviceRegistry } from './services';
import { initialScenario, caseOperating } from '../scenario-state';
import { scenarioInteraction, scenarioFallback, scenarioHint } from './scenario';
import { freshConversation, semanticCaseAnswer } from './fresh-conversation';
import { freshTopic } from '../interpretation/fresh-topics';
import { motherConversation, rememberFactual, explicitCaseRequest } from './mother-conversation';
import { corporateQuestion } from '../interpretation/corporate-questions';
import { motherLiteral } from '../interpretation/mother-routing';

export const OPENING = [
  'MERIDIAN SYSTEMS', 'REMOTE ACCESS CLIENT 2.04', '', '06 NOV 2003', '',
  'Connection established.', 'Records and service interface ready.', '', 'Type HELP for instructions.',
];
export const output = (lines: string[], fileIds: string[] = [], code: TerminalOutput['code'] = 'ok', truth: TerminalOutput['truth'] = 'system'): TerminalOutput => ({
  lines, code, truth, links: fileIds.flatMap(id => { const file = fileById(id); return file ? [{ fileId: id, label: file.path }] : []; }),
});
export function newGame(now = new Date().toISOString(), sessionId = `MR-${Math.random().toString(16).slice(2, 6).toUpperCase()}`): GameState {
  return { ...newLegacyGame(now,sessionId), schemaVersion:6, scenario:initialScenario() };
}
export function newLegacyGame(now = new Date().toISOString(), sessionId = `MR-${Math.random().toString(16).slice(2, 6).toUpperCase()}`): GameState {
  return {
    ...initialStory(), schemaVersion: 5, investigation: initialInvestigation(), sessionId, startedAt: now, currentDirectory: '/', discoveredEvidenceIds: [], unlockedCapabilities: ['CAP_ARCHIVE_RECOVERY'], viewedFileIds: [], openFileIds: [], completedActions: [],
    archive006Recovered: false, act01Complete: false, hasStarted: false,
    terminalHistory: [{ input: '', ...output(OPENING) }], ui: { crtEnabled: true, fontScale: 1, terminalMode: 'maximized' },
  };
}
export const accessibleFiles = (state: GameState): readonly ArchiveFile[] => FILES.filter(file => canRead(state, file));
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
  if (!canRead(state, file)) return { state, output: output(['RECORD ACCESS NOT DELEGATED.', 'Ask about the retained access procedure. Reading a record does not delegate authority.'], [], 'denied', 'withheld') };
  const next = discover({
    ...state, lastFileId: file.id,
    lastTopic: file.evidence.length ? 'service-006' : state.lastTopic,
    viewedFileIds: [...new Set([...state.viewedFileIds, file.id])],
    openFileIds: [...state.openFileIds.filter(id => id !== file.id), file.id].slice(-5),
  // A saved monitor reading is historical evidence, never a fresh controller query.
  }, file.evidence.filter(id => id !== 'EV_SERVICE_ACTIVE'));
  if (next.scenario && file.id === 'authorization') next.scenario = { ...next.scenario, historicClosureObserved:true };
  return {
    state: next,
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
  const excerpts = matches.map(file => `${file.title}\n  ${file.body.split('\n').find(line => line.toUpperCase().includes(needle))?.trim() ?? file.title}${file.bitmap ? '\n  TYPE: BITMAP / ' + file.bitmap.category.toUpperCase() + (file.bitmap.artwork === 'placeholder' ? ' / PLACEHOLDER' : '') : ''}`);
  const people = findPublicPersonnel(term);
  return output([`SEARCH: ${term} / FILES FOUND: ${matches.length}`, ...excerpts, ...(people.length ? [`PUBLIC WORK PROFILES: ${people.length}`, ...publicPersonnelLines(people)] : [])], matches.map(file => file.id));
}
function answer(state: GameState, interpretation: Interpretation, input: string): Transition {
  let next = { ...state };
  const respond = (lines: string[], files: string[] = [], evidence: EvidenceId[] = []): Transition => ({ state: discover(next, evidence), output: output(lines, files, 'ok', 'interpretation') });
  if (interpretation.needsClarification) return { state: { ...state, pendingClarification: { input, interpretation } }, output: output([interpretation.clarification ?? 'Which service or record do you mean?'], [], 'notice') };
  if (interpretation.subject) {
    const replies: Record<NonNullable<Interpretation['subject']>, string[]> = {
      identity: ['R-02 / AUTOMATED RECORDS INTERFACE', 'These replies are generated by the records system. No human operator is connected.', 'The retained interface description does not identify a complete intelligence architecture.'],
      headquarters: ['MERIDIAN / LOCATION RECORD UNAVAILABLE', 'The public office notice contains no headquarters address. I cannot establish a city or current company location from this copy.'],
      server: ['R-02 / REMOTE RECORDS CONNECTION', 'The retained records do not specify the physical server location. This browser connection does not establish where the original equipment is housed.'],
      'local-save': ['LOCAL CLIENT STORAGE', 'This browser saves game progress, open records, recent terminal history, and interface preferences when storage is available.', `This session: ${state.sessionId}. Records encountered: ${state.viewedFileIds.length}. Established findings: ${state.knowledge.length}.`, 'Optional QA recordings are separate and disabled until you opt in. Open DISPLAY & SETTINGS → LOCAL PLAYTEST QA to inspect statistics, export JSONL, or clear recordings.', 'This is a description of this game client, not access to other files on your device.'],
      biological: ['TERM / BIOLOGICAL ACTIVITY', 'Physiological processes in living tissue, such as circulation or measurable neural activity.', 'The term alone does not establish consciousness, comfort, recovery, or independent survival.'],
      'live-monitor': ['LIVE MONITOR / SERVICE STATUS', 'The status view reports whether registered services are currently running. STATUS requests that view.', 'A running service and an administrative closure record can disagree. The display alone does not explain the discrepancy.'],
      kell: ['J. KELL / CLOSURE LIST', 'The retained list credits J. Kell with filing the service closures on 18 Sep 2001.', 'No full name, job title, current location, or complete staff record is available.'],
    };
    next.lastIntent = interpretation.intent;
    return respond(replies[interpretation.subject]);
  }
  const dialogue = answerDialogue(state, interpretation.intent);
  if (dialogue) return dialogue;
  const other = interpretation.entityId?.match(/^service-(00[1-8])$/)?.[1];
  if (other && ['ask_service_status', 'ask_retirement'].includes(interpretation.intent)) {
    if (other !== '006') return serviceDetails(state, other);
  }
  let intent: QueryIntent = interpretation.intent;
  if (intent === 'ask_clarification') {
    if (!state.lastIntent) return respond(['Which record do you mean?']);
    if (state.lastIntent === 'ask_calls') return respond(['The same call is retried at 02:13.', 'The night desk does not answer.', 'The last confirmation on file is from 2001.'], ['call']);
    if (state.lastIntent === 'ask_service_status') {
      const id = state.lastTopic?.match(/^service-(00[1-8])$/)?.[1];
      return id ? serviceDetails(state, id) : respond(['Which service are you referring to?']);
    }
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
    case 'ask_office':
      if (/alive|dead|hurt|people|every(?:one|body)|come back/i.test(input)) return respond(['STAFF RECORDS / INCOMPLETE', 'Reception closed in September 2001.', 'E. Lin left a note the following morning.', 'These files do not say what happened to the staff afterward.'], ['company', 'maintenance']);
      return /why|reason/i.test(input)
      ? respond(['PUBLIC OFFICE CLOSED / 18 SEP 2001', 'The reason for closure is not recorded in this copy.', 'Telephone reception ended at 17:00.'], ['company'])
      : respond(knows(state, 'site6Known') ? ['PUBLIC OFFICE CLOSED / 18 SEP 2001', 'No operator is assigned to Site 6. Essential clinical systems continue.', 'Last retained staff mail: 19 Sep 2001, 08:10. Physical attendance unconfirmed.'] : ['PUBLIC OFFICE CLOSED / 18 SEP 2001', 'Reception ended at 17:00.', 'Last retained staff mail: 19 Sep 2001, 08:10. Physical attendance unconfirmed.', 'This records connection is unattended.'], ['company', 'maintenance']);
    case 'ask_service_status':
      if (state.operating.endingId) return respond(['006 / CONTINUITY MONITOR', `Current state: ${state.operating.service006Running ? 'running' : 'stopped after confirmed release'}`, 'Historical monitor records remain unchanged.'], ['register']);
      return /restart|start.*again|back (?:on|online)|turned.*back|brought.*back/i.test(input)
      ? respond(['LAST RESTART / 02 NOV 2003, 03:14:09', 'Started by: automatic monitor', 'Reason: handover not closed', 'Operator: none'], ['status-log'])
      : respond(['006 / CONTINUITY MONITOR', 'Function: overnight alarms', 'Live state: running', 'Office record: closed, 18 Sep 2001', 'Last connected operator: no entry'], ['register', 'authorization'], ['EV_SERVICE_ACTIVE', 'EV_RETIREMENT_APPROVED']);
    case 'ask_retirement': return respond(['OFFICE RECORD / 18 SEP 2001', '006 is listed as closed. Shutdown was approved.', 'The automatic monitor restarted it on 02 Nov 2003.', 'Recorded reason: handover not closed.', ...(state.operating.endingId ? [`Present state after intervention: ${state.operating.service006Running ? 'running' : 'stopped'}.`] : [])], ['authorization', 'status-log'], ['EV_RETIREMENT_APPROVED']);
    case 'ask_transfer':
    case 'ask_archive_location':
      if (/hold|withheld|release|handover not closed/i.test(input)) return state.archive006Recovered
        ? respond(['SERVICE RELEASE: WITHHELD', 'The receipt requires a reply from the holding system.', 'The office shutdown order does not clear that hold.', 'No release reply is present in this copy.'], ['fragment'])
        : respond(['HANDOVER RECORD INCOMPLETE.', 'The office list names an attachment.', 'Its original is unavailable; a local copy is listed.'], ['ledger']);
      return respond(state.archive006Recovered
      ? ['HANDOVER RECEIPT / BACKUP AVAILABLE', 'Transfer: accepted, 18 Sep 2001 at 23:59:41', 'Service release: withheld']
      : ['HANDOVER RECEIPT', 'The attachment is named in the call record.', 'Original file: not listed', 'Local backup: available'], state.archive006Recovered ? ['fragment'] : ['ledger'], ['EV_TRANSFER_MISSING']);
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
    case 'ask_company':
      if (/this place|where am i|looking at|whose records|these machines/i.test(input)) return respond(['MERIDIAN SYSTEMS / REMOTE RECORDS', 'You are viewing saved company files through an old records terminal.', 'Meridian made medical monitoring equipment.', 'This connection does not identify your physical location.'], ['company']);
      return /own(?:ed|er)|found(?:ed|er)/i.test(input)
      ? respond(['MERIDIAN SYSTEMS', 'No owner or founder is named in this copy.', 'The company notice describes medical monitoring equipment.'], ['company'])
      : respond(['MERIDIAN SYSTEMS', 'Medical monitoring equipment.', 'The public office closed in September 2001.', 'Technical records remain online for equipment owners.'], ['company']);
    case 'ask_identity':
      if (knows(state, 'motherIdentified')) return respond(knows(state, 'distressEvidenceKnown') ? ['Controller designation: MOTHER.', 'Monitoring, treatment continuity and preservation remain assigned.', 'Their adequacy is under dispute.'] : ['Controller designation: MOTHER.', 'My assigned functions include clinical monitoring, equipment coordination and preservation continuity.'], ['controller']);
      if (/recording|remember/i.test(input)) return respond(['SESSION MEMORY', 'This client keeps the last subject and the record you selected.', 'Commands and replies are saved in this browser when storage is available.', 'They are not sent to office staff.'], ['readme']);
      if (/built|created|programmed/i.test(input)) return respond(['MERIDIAN RECORDS / R-02', 'This interface provides access to company records.', 'No developer name is listed in this copy.'], ['readme']);
      if (/^(?:hello|hi|hey|thank you|thanks)[.! ]*$/i.test(input.trim())) return respond(['R-02 / CONNECTION ACTIVE', 'You can read the company records or ask about them.'], ['readme']);
      return respond(['MERIDIAN RECORDS / R-02', 'I provide access to saved company records.', 'This terminal accepts typed questions.', 'No staff terminal is connected.'], ['readme']);
    case 'ask_staff':
      if (/removed|disconnect/i.test(input)) return respond(['NIGHT DESK PHONE', 'E. Lin reported its removal on 19 Sep 2001.', 'The note does not name the person who removed it.'], ['maintenance']);
      if (/home|contact|number|where.*lin/i.test(input)) return respond(['E. LIN / LAST SHIFT NOTE', 'Asked for alarms not to be forwarded to a home number.', 'The number and a current contact address are not listed.'], ['maintenance']);
      return respond(['STAFF NAMES IN THIS COPY', 'E. Lin: sent the last shift note.', 'J. Kell: filed the service closure list.', 'No complete staff directory is available.'], ['maintenance', 'authorization']);
    case 'ask_access':
      if (state.permissions.length && !/leave|get me out|close|why am i here|how did i get/i.test(input)) return respond(['CURRENT SESSION PERMISSIONS', ...state.permissions, 'A read permission never substitutes for treatment authority. Consequential operations require explicit requests.']);
      if (/leave|get me out|close.*(?:client|connection|session)/i.test(input)) return respond(['CLIENT CONTROLS', 'You can close this client at any time.', 'Progress is saved in this browser when storage is available.', 'This terminal has no building controls.'], ['readme']);
      if (/why am i here|how did i get/i.test(input)) return respond(['ACCESS: EXTERNAL / RECORDS ONLY', 'No staff account is attached to this connection.', 'The records do not explain who opened the client or why.', 'You can read the retained files.'], ['readme']);
      return respond(['ACCESS: EXTERNAL / RECORDS ONLY', 'You can read files and search this copy.', 'This connection cannot edit records or control equipment.', 'Messages typed here are not sent to office staff.'], ['readme', 'company']);
    case 'ask_dates': return respond(['SYSTEM DATE: 06 NOV 2003', 'Office closure records: September 2001.', 'Live monitor readings: November 2003.', 'A saved file date and an event date can differ.', 'No time zone or independent clock check is recorded.'], ['company', 'register']);
    case 'ask_record_integrity': return respond(['RECORDS CHECK', 'The office list is saved paperwork; the monitor is a later reading.', 'This copy has no complete edit history.', 'Missing or unreadable fields cannot be filled from these records.', 'Answers use the available records; unknown details remain unknown.'], ['authorization', 'register']);
    case 'ask_next': { const hint = nextHint(state); return respond(['RECORDS ACCESS / CONTROLS', 'Use the file browser or OPEN / READ with a filename. Questions accept ordinary words. Esc shows the full reply.', ...hint.lines], ['readme', ...hint.files]); }
    case 'request_backup': return classify(input, state).intent === 'request_backup' ? recover(next) : respond(['A local backup is listed with the attachment.'], ['ledger']);
    case 'request_stop': return respond(['CONTROL UNAVAILABLE.', 'This connection can read records only.', 'Last recorded stop request: 02 Nov 2003.'], ['status-log']);
    case 'request_file': return interpretation.fileId === 'fragment' && classify(input, state).intent === 'request_file' ? recover(next) : inspectFile(next, interpretation.fileId ?? '');
    case 'request_search': return { state: next, output: search(next, interpretation.searchTerm ?? '') };
    default: {
      const words = input.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(word => word.length > 3 && !['what', 'where', 'which', 'there', 'about', 'please', 'would', 'could', 'does', 'that', 'this', 'have', 'with', 'from', 'tell', 'happened', 'know'].includes(word));
      const matches = accessibleFiles(state).filter(file => words.some(word => `${file.title} ${file.body}`.toLowerCase().includes(word)));
      return { state, output: matches.length ? output(['RECORD MATCHES', ...matches.map(file => file.title)], matches.map(file => file.id)) : output(['NO MATCH IN THIS COPY OF THE RECORDS.'], [], 'notice') };
    }
  }
}
function resolveClarification(state: GameState, input: string): Transition | undefined {
  const pending = state.pendingClarification;
  if (!pending) return undefined;
  if (/^(?:cancel clarification|never mind|nevermind)$/i.test(input)) return { state: { ...state, pendingClarification: undefined }, output: output(['CLARIFICATION CANCELLED.']) };
  const text = input.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const original = pending.interpretation;
  const service = text.match(/\b(00[4-7])\b/)?.[1];
  const choices = original.choices ?? [];
  const ordinal = /^(?:the )?(?:first|1|former)(?: one)?$/.test(text) ? 0 : /^(?:the )?(?:second|2|latter)(?: one)?$/.test(text) ? 1 : -1;
  const classified = classify(input, state);
  const words = text.split(' ').filter(word => word.length > 2 && !['the','this','that','about','please','mean','one'].includes(word));
  const matching = choices.filter(c => {
    const label = c.label.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
    return text === label || text.length > 3 && label.includes(text) || service && label.includes(service) || words.some(word => label.split(' ').includes(word)) || classified.intent !== 'unknown' && classified.intent === c.intent;
  });
  const choice = ordinal >= 0 ? choices[ordinal] : choices.length === 1 && /^(?:yes|yes please|thats right|correct)$/.test(text) ? choices[0] : matching.length === 1 ? matching[0] : undefined;
  const needsSubject = ['ask_authorization','ask_retirement','ask_service_status'].includes(original.intent);
  const namedFile = fileByName(input);
  const namedPerson = /^(?:anna(?: voss)?|av-06|mother|(?:the )?controller|j[ .]*kell|e[ .]*lin)$/.test(text);
  const subjectReply = !choices.length && (namedFile || namedPerson);
  if (!choice && !(needsSubject && service && !choices.length) && !subjectReply) return undefined;
  const resolvedIntent = choice?.intent ?? (original.intent === 'unknown' ? classify(`${pending.input} ${input}`, { ...state, lastFileId: namedFile?.id }).intent : original.intent);
  if (resolvedIntent === 'unknown') return undefined;
  const query: Interpretation = { ...original, intent: resolvedIntent, entityId: service ? `service-${service}` : original.entityId, needsClarification: false, clarification: undefined, choices: undefined, method: 'deterministic' };
  if (choice?.label.includes('007')) { query.intent = 'ask_service_status'; query.entityId = 'service-007'; }
  if (choice?.label.includes('006')) { query.intent = 'ask_service_status'; query.entityId = 'service-006'; }
  const result = answer({ ...state, pendingClarification: undefined }, query, pending.input);
  return { ...legacyResponseTrace(state, query, result), resolvedInterpretation: query };
}
export function runInput(state: GameState, raw: string, interpretation?: Interpretation): Transition {
  const input = raw.trim().slice(0, 1000);
  if (!input) return { state, output: output([]) };
  const literalTopic=state.scenario?motherLiteral(input,{...state,conversationSubject:state.conversation?.lastFactual?.subject}):undefined;
  // A supplied ordinary LIST sentence is not a directory path. Path-shaped LIST
  // requests and every consequential command keep the existing parser.
  const command = literalTopic?.domain==='world'&&/^list [a-z]/i.test(input)?undefined:parseCommand(input);
  const operation = parseOperation(input);
  const preservedCorporate=state.scenario&&!command&&!operation?corporateQuestion(input,state):undefined;
  const preciseCorporate=preservedCorporate&&(preservedCorporate.kind==='unavailable'||preservedCorporate.kind==='personnel'&&!!preservedCorporate.people?.length||preservedCorporate.kind==='company'&&(preservedCorporate.topic!=='unavailable'||/\b(?:street|postal|zip|address|coordinates|telephone|phone|email|website|exact|unlisted)\b/i.test(input)));
  const authoredSubject=literalTopic&&(literalTopic.domain!=='world'||preservedCorporate?.kind==='unavailable'&&!preservedCorporate.people?.length);
  const richer=preciseCorporate&&!authoredSubject&&!/^(?:why|how so|tell me more|explain that|what does that mean)[?!.]*$/i.test(input)?answerCorporate(state,input,interpretation):undefined;
  const directService=state.scenario&&!command&&!operation&&!explicitCaseRequest(state,input)?state.serviceClarification&&/^(?:service )?00[1-8]$/i.test(input)?serviceCommand(state,state.serviceClarification,[input.slice(-3)]):answerService(state,input,interpretation):undefined;
  const retainedRestart=state.scenario&&!command&&!operation&&/\b(?:restart|restarted|reboot|boot back up)\b/i.test(input)&&(/\b006\b/.test(input)||state.lastTopic==='service-006')?freshConversation(state,input):undefined;
  const authored=state.scenario&&!command&&!operation&&!richer&&!directService&&!retainedRestart?motherConversation(state,input,interpretation??classify(input,{...state,scenarioVersion:'1.0',conversationSubject:state.conversation?.lastFactual?.subject})):undefined;
  const ordinary=!authored&&!richer&&!directService&&state.scenario&&!command&&!operation&&freshTopic(input,state)?freshConversation(state,input):undefined;
  const revised = !authored&&!richer&&!directService&&!ordinary && state.scenario && !command ? scenarioInteraction(state,input) : undefined;
  // The optional recognizer cannot supply an executable case request or protected file on the player's behalf.
  const unhandled=!richer&&!directService&&!retainedRestart&&!authored&&!ordinary&&!revised;
  const service = unhandled && !command && !operation ? state.scenario&&state.serviceClarification&&/^(?:service )?00[1-8]$/i.test(input)?serviceCommand(state,state.serviceClarification,[input.slice(-3)]):answerService(state, input, interpretation) : undefined;
  const corporate = unhandled && !service && !command && !operation ? answerCorporate(state, input, interpretation) : undefined;
  const clarification = state.scenario ? unhandled&&!service&&!command&&!operation&&(state.pendingClarification||interpretation?.needsClarification)?freshConversation(state,input,interpretation):undefined : !corporate && !command && !operation ? resolveClarification(state, input) : undefined;
  const encounter = state.scenario || service || corporate || clarification ? undefined : openingInteraction(state, input, !!command || !!operation);
  let result: Transition;
  const done = (out: TerminalOutput, next: GameState = state): Transition => ({ state: next, output: out });
  if (richer) result = richer;
  else if (directService) result = directService;
  else if (retainedRestart) result = retainedRestart;
  else if (authored) result = authored;
  else if (ordinary) result = ordinary;
  else if (revised) result = revised;
  else if (clarification) result = clarification;
  else if (service) result = service;
  else if (corporate) result = corporate;
  else if (encounter) result = encounter;
  else if (operation) result = state.scenario ? {state, output:output(['PROTOTYPE OPERATION UNAVAILABLE. R-02 has no clinical equipment authority.'],[],'denied')} : executeOperation(state, operation);
  else if (command?.error) result = done(output([command.error], [], 'error'));
  else if (command) {
    const argument = command.args.join(' ');
    switch (command.name) {
      case 'HELP':
        if(state.scenario&&argument.toUpperCase()!=='RECOVER'){
          result=done(output(['TERMINAL HELP','Questions can be written in ordinary words.','STATUS / INFO <id> / LOG <id> — eight registered services (001–008).','DIR / LS [path]; CD [path] / CD ..; OPEN / READ <title, path or record ID>.','SEARCH terms; DIAG; RECOVER BACKUP; CLEAR / CLS.','INFO or LOG without an identifier asks which service. Reply with its ID.','Up/Down recalls input. Esc shows the full reply.','APPLICATION / LOCAL SAVES: Progress is saved in this browser when storage is available. Reloading never confirms a pending operation. See CLIENT SETTINGS.',...(state.scenario.events.includes('closure-compared')?['PERMITTED REVIEW ACTIONS',...scenarioHint(state.scenario)]:[])] ,['readme']));break;
        }
        result = done(output(argument.toUpperCase() === 'RECOVER'
        ? ['BACKUP READER', 'Reads a saved copy when the original attachment is unavailable.', 'It does not change the original or control running services.']
        : ['TERMINAL HELP', '', 'Questions can be written in ordinary words.', 'Examples: What is Meridian Systems? / What does Service 002 do?', '', 'HELP                   Show these instructions', 'STATUS                 View all registered services', 'INFO <id>              Service details (001–008)', 'LOG <id>               Retained service events (001–008)', 'DIR / LS [path]        List folders and files', 'CD [path]              Change folder; CD .. goes back', 'OPEN / READ filename   Read a named file', 'SEARCH terms           Search permitted records and work profiles', 'DIAG                   Read-only connection diagnostics', 'RECOVER BACKUP         Read a listed local backup', 'CLEAR / CLS            Clear terminal text', 'EXPLAIN                Explain an active verification', 'DEFER / RESUME INVESTIGATION', '', 'INFO and LOG accept one identifier; no date filters or pagination.', 'Up/Down recalls earlier input. Esc shows a full reply.'], ['readme'])); break;
      case 'DIR': {
        const directory = resolvePath(argument || '.', state.currentDirectory);
        if (!DIRECTORIES.includes(directory as typeof DIRECTORIES[number])) { result = done(output([`FOLDER NOT FOUND: ${directory}`], [], 'error')); break; }
        const dirs = DIRECTORIES.filter(path => path !== '/' && (path.slice(0,path.lastIndexOf('/'))||'/')===directory && accessibleFiles(state).some(f => f.path.startsWith(path + '/')));
        const files = accessibleFiles(state).filter(file => file.path.slice(0, file.path.lastIndexOf('/')) === directory);
        result = done(output([`FOLDER: ${directory}`, ...dirs.map(path => ` <FOLDER> ${path.slice(1)}`), ...files.map(file => ` ${file.modified}  ${file.title}`)], files.map(file => file.id))); break;
      }
      case 'CD': {
        const path = resolvePath(argument || '/', state.currentDirectory);
        result = DIRECTORIES.includes(path as typeof DIRECTORIES[number]) ? done(output([`FOLDER: ${path}`]), { ...state, currentDirectory: path }) : done(output([`FOLDER NOT FOUND: ${path}`], [], 'error')); break;
      }
      case 'OPEN': {
        if (/^(?:the )?(?:local )?backup(?: copy| receipt)?$/i.test(argument)) { result = recover(state); break; }
        if (/^(?:it|that|this|that file|this file)$/i.test(argument)) {
          const id = state.openFileIds.at(-1) ?? state.lastFileId;
          result = id ? inspectFile(state, id) : done(output(['Which file would you like to read?'], [], 'notice')); break;
        }
        const path = resolvePath(argument, state.currentDirectory);
        const file = FILES.find(item => item.path === path) ?? fileByName(argument);
        result = file ? file.id === 'fragment' ? recover(state) : inspectFile(state, file.id) : done(output([argument ? `FILE NOT FOUND: ${argument}` : 'Enter a file name after OPEN.', 'Example: OPEN Office notice'], [], 'error')); break;
      }
      case 'SEARCH': result = done(search(state, argument)); break;
      case 'STATUS': result = command.args.length ? done(output(['Supported syntax: STATUS (no arguments).'], [], 'error')) : serviceRegistry(state); break;
      case 'INFO': case 'LOG': result = serviceCommand(state, command.name, command.args); break;
      case 'CLEAR': result = { state, output: output(['SCREEN CLEARED.']), clear: true }; break;
      case 'RECOVER': result = /^(?:ARCHIVE\s+)?(?:006|BACKUP|RECEIPT|HANDOVER RECEIPT)$/i.test(argument) ? recover(state) : done(output(['No local backup matched that name.'], [], 'error')); break;
      case 'DIAG': result = done(output(['R-02 / RECORDS CONNECTION', 'Monitor: responding', 'Original records: read only', 'Control access: unavailable'], ['readme'])); break;
    }
  } else if (state.scenario) {
    // Only raw ordinary requests can open records; model-supplied IDs never release a projection.
    const literal = classify(input, {...state,scenarioVersion:'1.0'});
    const query=interpretation??literal;
    result = literal.intent === 'request_search' ? done(search(state,literal.searchTerm??'')) : literal.intent === 'request_file' && literal.fileId ? inspectFile(state,literal.fileId) : freshConversation(state,input,literal) ?? freshConversation(state,input,query) ?? semanticCaseAnswer(state,input,query) ?? scenarioFallback(state,input);
  } else {
    const query = interpretation ?? classify(input, state);
    const question = /[?]|\b(why|what|where|who|when|how|is|was|did|can|could|show|find|explain|tell)\b/i.test(input);
    result = query.intent !== 'unknown' || query.needsClarification || question ? answer(state, query, input) : done(output(['REQUEST NOT RECOGNISED.', 'HELP lists the available controls.'], [], 'error'));
    result = legacyResponseTrace(state, query, result);
  }
  const history = result.clear ? [] : result.state.terminalHistory;
  result=rememberFactual(state,result);
  if(result.state.scenario)result.state={...result.state,operating:caseOperating(result.state.scenario,result.state.operating),act01Complete:result.state.scenario.events.includes('closure-compared')};
  return { ...result, state: { ...result.state, terminalHistory: [...history, { input, ...result.output }].slice(-80) } };
}
