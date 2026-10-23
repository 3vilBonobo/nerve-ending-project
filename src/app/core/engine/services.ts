import type { GameState, Interpretation, Transition } from '../models';
import { serviceInterpretation, serviceQuestion, ServiceQuestion } from '../interpretation/service-questions';
import { currentServiceState, permittedServiceEvents, serviceById, serviceTimestamp, SERVICES, SERVICE_OBSERVATION, SERVICE_STATES } from '../service-records';

function reply(state: GameState, lines: string[], code: Transition['output']['code'] = 'ok', truth: Transition['output']['truth'] = 'system'): Transition {
  return { state, output: { lines, links: [], code, truth } };
}
export function serviceRegistry(state: GameState): Transition {
  const next = { ...state, lastTopic: 'services', lastIntent: 'ask_service_status' as const,
    discoveredEvidenceIds: state.operating.service006Running ? [...new Set([...state.discoveredEvidenceIds, 'EV_SERVICE_ACTIVE' as const])] : [...state.discoveredEvidenceIds] };
  return reply(next, ['MERIDIAN SYSTEMS / REGISTERED SERVICES', '06 NOV 2003', '', 'ID   SERVICE                 STATE',
    ...SERVICES.map(service => `${service.id}  ${service.name.padEnd(24)}${currentServiceState(service, state)}`), '', 'Type INFO <id> for service details.']);
}
export function serviceDetails(state: GameState, id: string): Transition {
  const service = serviceById(id);
  if (!service) return reply(state, ['There is no registered service with that identifier.'], 'error');
  const next = { ...state, lastTopic: `service-${id}`, lastIntent: 'ask_service_status' as const,
    discoveredEvidenceIds: id === '006' && state.operating.service006Running ? [...new Set([...state.discoveredEvidenceIds, 'EV_SERVICE_ACTIVE' as const])] : [...state.discoveredEvidenceIds] };
  return reply(next, [`SERVICE ${id} / ${service.name.toUpperCase()}`, '', `STATE: ${currentServiceState(service, state)}`, `OBSERVED: ${SERVICE_OBSERVATION.label}`,
    ...(service.department ? [`DEPARTMENT: ${service.department.toUpperCase()}`] : []), '', 'PURPOSE:', service.purpose, '', 'NORMAL FUNCTIONS:', service.functions,
    ...(service.id === '003' ? ['', SERVICE_STATES.STANDBY] : []), '', 'LIMITATIONS:', service.limitations, '', 'HISTORY:', service.history,
    ...(service.contacts ? ['', 'RECORDED WORK CONTACTS:', service.contacts] : []), '', 'AVAILABLE:', `LOG ${id}`]);
}
export function serviceLog(state: GameState, id: string): Transition {
  const service = serviceById(id);
  if (!service) return reply(state, ['There is no registered service with that identifier.'], 'error');
  const events = permittedServiceEvents(service.id);
  return reply({ ...state, lastTopic: `service-${id}`, lastIntent: 'ask_service_status' }, [
    `SERVICE ${id} / ${service.name.toUpperCase()} / RETAINED LOG`, `AVAILABLE THROUGH: ${SERVICE_OBSERVATION.label}`, 'Dated events; this retrieval is not a current execution report.', '',
    ...events.flatMap(event => [`${serviceTimestamp(event.timestamp)} | ${event.category} | ${event.message}`, `  SOURCE: ${event.source.origin}`]),
    ...(!events.length ? ['No permitted service-wide events are available at this observation.', 'Individual client activity is not included in this view.'] : []),
    ...(['004', '005'].includes(id) ? ['', 'END OF OPERATIONAL LOG', 'No activity is recorded after 18 SEP 2001.'] : []),
  ], 'ok', 'record');
}
export function serviceCommand(state: GameState, name: 'INFO' | 'LOG', args: readonly string[]): Transition {
  if (!args.length) return reply(state, [name === 'LOG' ? 'Which service log would you like to inspect?' : 'Which service are you referring to?', `Syntax: ${name} <id> (001–008).`], 'notice');
  if (args.length !== 1) return reply(state, [`Supported syntax: ${name} <id> (001–008).`, 'Date ranges, filters and pagination are not supported.'], 'error');
  return name === 'INFO' ? serviceDetails(state, args[0]) : serviceLog(state, args[0]);
}
function answer(state: GameState, question: ServiceQuestion): Transition {
  switch (question.kind) {
    case 'registry': return serviceRegistry(state);
    case 'info': return serviceDetails(state, question.id!);
    case 'log': return serviceLog(state, question.id!);
    case 'warnings': return reply({ ...state, lastTopic: 'services', lastIntent: 'ask_service_status' }, ['REGISTERED SERVICES / AVAILABLE WARNINGS', `AVAILABLE THROUGH: ${SERVICE_OBSERVATION.label}`, 'Retained events, newest first; not a current fault or outage summary.',
      ...permittedServiceEvents(undefined, true).map(event => `${serviceTimestamp(event.timestamp)} | ${event.serviceId} | ${event.category} | ${event.message}`)], 'ok', 'record');
    case 'states': return reply(state, [`${question.state}: ${SERVICE_STATES[question.state!]}`]);
    case 'distinction': return reply(state, ['Current status is what the controller reports at the fixed observation: ' + SERVICE_OBSERVATION.label + '.', 'A shutdown report is a dated departmental claim. Reading it does not check current execution or prove an operational release.', 'Different dates and sources must be compared; a mismatch alone does not establish deliberate fraud.']);
    case 'invalid': return reply(state, ['There is no registered service with that identifier.'], 'error');
    case 'missing': return reply(state, ['Which service are you referring to?', 'Specify an identifier from 001–008.'], 'notice');
    case 'syntax': return reply(state, ['Supported syntax: LOG <id> (001–008).', 'Date ranges, filters and pagination are not supported.', 'Show me recent service warnings lists the available warnings across services.'], 'error');
    case 'deny': return reply(state, ['CONTROL UNAVAILABLE.', /reroute|redirect/.test(question.action ?? '') ? 'This connection does not have permission to modify message routing.' : 'This connection does not have permission to change that service.'], 'denied', 'withheld');
  }
}
export function answerService(state: GameState, input: string, predicted?: Interpretation): Transition | undefined {
  const question = serviceQuestion(input, state);
  if (!question) return undefined;
  const result = answer(state, question);
  const query = { ...serviceInterpretation(input, state)!, provider: predicted?.provider ?? 'fallback' as const };
  return { ...result, resolvedInterpretation: query,
    dialogue: { variantId: `service:${question.id ?? 'registry'}:${question.kind}`, intent: query.intent, profile: 'RECORDS', modifiers: [], conditions: { gate: null, gateSatisfied: true, questionCount: null, previousIntent: state.lastIntent ?? null, previousFileId: state.lastFileId ?? null } } };
}
