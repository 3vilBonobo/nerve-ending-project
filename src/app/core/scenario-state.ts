/** v1.0 disclosure and authority are derived from a validated event ledger, never legacy permissions. */
export const CASE_CLOCK = [
  '06 NOV 2003 / 02:14', '06 NOV 2003 / 03:12', '06 NOV 2003 / 18:20',
  '07 NOV 2003 / 11:40', '07 NOV 2003 / 22:10', '08 NOV 2003 / 15:30',
  '08 NOV 2003 / 16:05', '11 NOV 2003 / 09:00',
] as const;
export const CASE_EVENTS = ['closure-compared','notifications-traced','audit-queued','audit-accepted','human-read','clinical-approved','harbor-acknowledged','elm-acknowledged','dependency-reviewed','welfare-compared','controls-observed','controls-repeated','translation-reviewed','marsh-signed','navarro-signed','patel-verified','onsite-staff-acknowledged','packet-verified','witness-attested','human-procedure-executed','continuation-confirmed'] as const;
export type CaseEvent = typeof CASE_EVENTS[number];
export type ScenarioScope = 'C'|'D'|'E'|'F'|'G'|'severance'|'continuation';
export interface ScenarioState {
  version: '1.0';
  events: CaseEvent[];
  liveService006Observed: boolean;
  historicClosureObserved: boolean;
  /** Immutable pre-review provenance retained independently of terminal scrollback. */
  originalSources: string[];
  motherQuestion: 'unoffered'|'offered'|'awaiting-answer'|'answered'|'declined'|'deferred';
  deferred: boolean;
  pendingChoice?: 'continuation'|'severance';
  outcome?: 'continuation'|'severance';
}
export const initialScenario = (): ScenarioState => ({ version:'1.0', events:[], liveService006Observed:false, historicClosureObserved:false, originalSources:[], motherQuestion:'unoffered', deferred:false });
export const hasCaseEvent = (s: ScenarioState, e: CaseEvent): boolean => s.events.includes(e);
const all = (s: ScenarioState, ...events: CaseEvent[]): boolean => events.every(e => hasCaseEvent(s,e));
export function caseEventAllowed(s: ScenarioState, e: CaseEvent): boolean {
  if(hasCaseEvent(s,'continuation-confirmed')||hasCaseEvent(s,'human-procedure-executed'))return false;
  if(e==='continuation-confirmed'&&hasCaseEvent(s,'witness-attested'))return false;
  switch(e) {
    case 'closure-compared': return s.liveService006Observed && s.historicClosureObserved && s.originalSources.length === 2;
    case 'notifications-traced': return hasCaseEvent(s,'closure-compared');
    case 'audit-queued': return hasCaseEvent(s,'closure-compared');
    case 'audit-accepted': return hasCaseEvent(s,'audit-queued');
    case 'human-read': return all(s,'audit-accepted','notifications-traced');
    case 'clinical-approved': return hasCaseEvent(s,'human-read');
    case 'harbor-acknowledged': case 'elm-acknowledged': return hasCaseEvent(s,'clinical-approved');
    case 'dependency-reviewed': return all(s,'harbor-acknowledged','elm-acknowledged');
    case 'welfare-compared': return hasCaseEvent(s,'dependency-reviewed');
    case 'controls-observed': return hasCaseEvent(s,'welfare-compared');
    case 'controls-repeated': case 'translation-reviewed': return hasCaseEvent(s,'controls-observed');
    case 'marsh-signed': case 'navarro-signed': case 'patel-verified': case 'onsite-staff-acknowledged': return hasCaseEvent(s,'translation-reviewed');
    case 'packet-verified': return all(s,'marsh-signed','navarro-signed','patel-verified','onsite-staff-acknowledged','harbor-acknowledged','elm-acknowledged') && s.originalSources.length === 2;
    case 'witness-attested': case 'continuation-confirmed': return hasCaseEvent(s,'packet-verified');
    case 'human-procedure-executed': return hasCaseEvent(s,'witness-attested');
  }
}
export function addCaseEvent(s: ScenarioState, e: CaseEvent): void {
  if (!s.outcome && !hasCaseEvent(s,e) && caseEventAllowed(s,e)) s.events.push(e);
}
export function caseMilestone(s: ScenarioState): number {
  if (s.outcome) return 7;
  if (hasCaseEvent(s,'packet-verified')) return 6;
  if (hasCaseEvent(s,'translation-reviewed')) return 5;
  if (hasCaseEvent(s,'welfare-compared')) return 4;
  if (hasCaseEvent(s,'dependency-reviewed') || hasCaseEvent(s,'harbor-acknowledged') || hasCaseEvent(s,'elm-acknowledged')) return 3;
  if (hasCaseEvent(s,'clinical-approved')) return 2;
  return hasCaseEvent(s,'audit-accepted') ? 1 : 0;
}
export const caseClock = (s: ScenarioState): string => CASE_CLOCK[caseMilestone(s)];
/** Compatibility projection only: the event ledger remains the source of v1.0 authority. */
export function caseOperating(s:ScenarioState, operating:import('./story-state').OperatingState):import('./story-state').OperatingState {
  const active=s.outcome!=='severance';
  return {...operating,annaBiologicallyAlive:active,clinicalSupportActive:active,service006Running:active};
}
export function caseFindings(s:ScenarioState):string[] {
  return [
    ...(s.liveService006Observed?['Retained controller observation: 06 NOV 2003 / 02:14.']:[]),
    ...(s.historicClosureObserved?['Administrative closure source: 18 SEP 2001.']:[]),
    ...s.events.map(e=>e.replaceAll('-',' ')),
    ...(s.outcome?[`Completed outcome: ${s.outcome}. Follow-up: ${caseClock(s)}.`]:[]),
  ];
}
export function scenarioCanRead(s: ScenarioState, scope: ScenarioScope, id: string): boolean {
  if (scope === 'severance' || scope === 'continuation') return s.outcome === scope;
  if (scope === 'C') return hasCaseEvent(s,'clinical-approved');
  if (scope === 'D') return hasCaseEvent(s,'dependency-reviewed');
  if (scope === 'E') return hasCaseEvent(s,'welfare-compared');
  if (scope === 'F') return id === 'NE-113' ? all(s,'marsh-signed','navarro-signed','patel-verified','onsite-staff-acknowledged') : hasCaseEvent(s,'translation-reviewed');
  return hasCaseEvent(s,'packet-verified');
}
export function decodeScenario(value: unknown): ScenarioState {
  const s = initialScenario();
  if (!value || typeof value !== 'object') return s;
  const v = value as Record<string,unknown>;
  if (v['version'] !== '1.0') return s;
  s.liveService006Observed = v['liveService006Observed'] === true;
  s.historicClosureObserved = v['historicClosureObserved'] === true;
  const sources = v['originalSources'];
  s.originalSources = Array.isArray(sources) && sources.length === 2 && sources[0] === 'authorization:18-SEP-2001' && sources[1] === 'controller-006:06-NOV-2003/02:14' ? [...sources] : [];
  if (Array.isArray(v['events'])) for (const e of v['events']) if (CASE_EVENTS.includes(e)) addCaseEvent(s,e);
  if (hasCaseEvent(s,'welfare-compared') && ['offered','awaiting-answer','answered','declined','deferred'].includes(String(v['motherQuestion']))) s.motherQuestion = v['motherQuestion'] as ScenarioState['motherQuestion'];
  s.deferred = v['deferred'] === true;
  if (hasCaseEvent(s,'human-procedure-executed')) s.outcome = 'severance';
  else if (hasCaseEvent(s,'continuation-confirmed')) s.outcome = 'continuation';
  if(s.outcome){s.deferred=false;if(['offered','awaiting-answer','deferred'].includes(s.motherQuestion))s.motherQuestion='declined';}
  if (!s.outcome && hasCaseEvent(s,'packet-verified') && ['continuation','severance'].includes(String(v['pendingChoice']))) s.pendingChoice = v['pendingChoice'] as ScenarioState['pendingChoice'];
  return s;
}
