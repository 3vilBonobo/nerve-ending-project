import { describe, expect, it } from 'vitest';
import { FILES } from '../content';
import type { GameState } from '../models';
import { classify } from '../interpretation/fallback';
import { directInterpretation, selectMeaning } from '../interpretation/semantic';
import { validateInterpretation } from '../interpretation/providers';
import { decodeSave } from '../persistence/saves';
import { qaInteraction, transitionObservations } from '../qa/events';
import { currentServiceState, permittedServiceEvents, SERVICES, SERVICE_EVENTS, SERVICE_OBSERVATION, SERVICE_STATES } from '../service-records';
import { inspectFile, newGame, runInput } from './game';

const text = (state: GameState, input: string): string => runInput(state, input).output.lines.join('\n');
const story = (state: GameState): unknown => ({ investigation: state.investigation, knowledge: state.knowledge, permissions: state.permissions, operating: state.operating, events: state.events, pendingOperation: state.pendingOperation, pendingClarification: state.pendingClarification, act01Complete: state.act01Complete, archive006Recovered: state.archive006Recovered, completedActions: state.completedActions });
const play = (inputs: readonly string[], state = newGame()): GameState => inputs.reduce((s, input) => runInput(s, input).state, state);
const protectedText = /Anna|AV-?06|Site\s*6|MOTHER|neural consciousness|suffering|author.only|story_role|cause_ref|writer_depth|DOC-CLN/i;

describe('eight-service registry and permitted views', () => {
  it('displays the exact ordinary registry without references, clinical additions or a default subject', () => {
    const s = newGame(); s.knowledge = ['annaAliveKnown', 'recoveryHandoffKnown'];
    const result = runInput(s, 'STATUS');
    expect(result.output.lines).toEqual([
      'MERIDIAN SYSTEMS / REGISTERED SERVICES', '06 NOV 2003', '', 'ID   SERVICE                 STATE',
      '001  Contract Support        RUNNING', '002  Equipment Register      RUNNING', '003  Message Router          STANDBY',
      '004  Billing                 STOPPED', '005  Building Sensors        STOPPED', '006  Continuity Monitor      RUNNING',
      '007  Records Access          RUNNING', '008  Archive Index           RUNNING', '', 'Type INFO <id> for service details.',
    ]);
    expect(result.output.links).toEqual([]); expect(result.state.lastTopic).toBe('services');
    expect(story(result.state)).toEqual(story(s));
  });
  it('defines four distinct states without inventing a retired service', () => {
    expect(Object.keys(SERVICE_STATES)).toEqual(['RUNNING', 'STANDBY', 'STOPPED', 'RETIRED']);
    expect(SERVICE_STATES.STANDBY).toMatch(/available/); expect(SERVICE_STATES.STOPPED).toMatch(/no active execution/);
    expect(SERVICE_STATES.RETIRED).toMatch(/documented retirement/);
    expect(SERVICES.map(s => s.id)).toEqual(['001', '002', '003', '004', '005', '006', '007', '008']);
  });
  it.each(['Which services are stopped?', 'Which service is running?', 'What is service status?'])('keeps broad requests on the registry rather than defaulting to 006: %s', input => {
    const result = runInput(newGame(), input);
    expect(result.output.lines).toEqual(runInput(newGame(), 'STATUS').output.lines);
    expect(result.state.lastTopic).toBe('services'); expect(result.encounters).toBeUndefined();
  });
  it.each(SERVICES)('INFO and LOG resolve $id with useful, permitted information', service => {
    const s = newGame();
    const info = runInput(s, `info ${service.id}`); const log = runInput(s, `lOg ${service.id}`);
    expect(info.output.lines.join('\n')).toContain(service.purpose);
    expect(info.output.lines).toContain(`STATE: ${service.state}`);
    expect(info.output.lines).toContain('LIMITATIONS:'); expect(info.output.lines).toContain('HISTORY:');
    expect(info.output.lines).toContain(`LOG ${service.id}`);
    expect(log.output.lines[0]).toBe(`SERVICE ${service.id} / ${service.name.toUpperCase()} / RETAINED LOG`);
    expect(log.output.truth).toBe('record'); expect(log.output.code).toBe('ok');
    expect(log.output.lines.join(' ')).toMatch(service.id === '007' ? /No permitted service-wide events/ : /SOURCE:/);
    for (const t of [info, log]) {
      expect(JSON.stringify(t.output)).not.toMatch(protectedText);
      expect(t.output.links).toEqual([]); expect(story(t.state)).toEqual(story(s)); expect(t.encounters).toBeUndefined();
    }
    expect(log.state.discoveredEvidenceIds).toEqual([]);
  });
  it('derives 006 current status from existing operating state and keeps retained events unchanged', () => {
    const s = newGame(); s.operating.service006Running = false;
    const before = JSON.stringify(SERVICE_EVENTS);
    expect(currentServiceState(SERVICES[5], s)).toBe('STOPPED');
    expect(text(s, 'STATUS')).toContain('006  Continuity Monitor      STOPPED');
    expect(text(s, 'INFO 006')).toContain('STATE: STOPPED');
    expect(text(s, 'LOG 006')).toContain('Service restarted automatically');
    expect(JSON.stringify(SERVICE_EVENTS)).toBe(before);
    expect(runInput(s, 'INFO 006').state.discoveredEvidenceIds).not.toContain('EV_SERVICE_ACTIVE');
  });
  it.each(['INFO 999', 'LOG 999', 'INFO 000', 'LOG 009', 'INFO /CLINICAL/AV06_STATUS.CLIN', 'LOG ../../secret'])('rejects an unregistered identifier without echoing private input: %s', input => {
    const t = runInput(newGame(), input);
    expect(t.output.code).toBe('error'); expect(t.output.lines).toEqual(['There is no registered service with that identifier.']);
    expect(t.output.links).toEqual([]); expect(t.state.permissions).toEqual([]);
  });
  it.each(['LOG', 'INFO', 'What does it do?', 'Show me its logs.'])('requests a subject without defaulting to 006: %s', input => {
    const t = runInput(newGame(), input);
    expect(t.output.code).toBe('notice'); expect(t.output.lines.join(' ')).toContain('Which service');
    expect(t.state.lastTopic).toBeUndefined(); expect(t.state.discoveredEvidenceIds).toEqual([]);
  });
  it.each(['LOG 002 2003-11-01', 'LOG 002 PAGE 2', 'LOG 002 WARN', 'INFO 002 extra', 'Show me Service 002 logs from last week.', 'Show me Service 002 logs since yesterday.'])('explains unsupported syntax instead of guessing: %s', input => {
    const t = runInput(newGame(), input);
    expect(t.output.code).toBe('error'); expect(t.output.lines.join(' ')).toMatch(/syntax:/);
    expect(t.output.lines.join(' ')).toMatch(/not supported/); expect(t.state.discoveredEvidenceIds).toEqual([]);
  });
  it('keeps HELP neutral and accurately lists implemented commands and two examples', () => {
    const help = text(newGame(), 'HELP');
    for (const word of ['HELP', 'STATUS', 'INFO', 'LOG', 'DIR', 'CD', 'OPEN', 'SEARCH', 'DIAG', 'RECOVER', 'CLEAR']) expect(help).toContain(word);
    expect(help).not.toMatch(/006|night desk|Site 6|MOTHER|incident|hidden|clinical/i);
    expect(text(newGame(), 'STATUS 006')).toContain('STATUS (no arguments)');
  });
});

describe('authored service chronology and provenance', () => {
  it('has unique stable events, explicit sources, visibility and no future execution', () => {
    expect(SERVICE_EVENTS).toHaveLength(27);
    expect(new Set(SERVICE_EVENTS.map(e => e.id)).size).toBe(SERVICE_EVENTS.length);
    for (const event of SERVICE_EVENTS) {
      expect(SERVICES.some(s => s.id === event.serviceId)).toBe(true);
      expect(event.timestamp <= SERVICE_OBSERVATION.local, event.id).toBe(true);
      expect(['INFO', 'NOTICE', 'WARN', 'ERROR', 'HIST']).toContain(event.category);
      expect(event.source.reference).toBeTruthy(); expect(event.source.origin).toBeTruthy(); expect(event.visibility).toBe('public');
    }
    expect(SERVICE_OBSERVATION.label).toBe('06 NOV 2003 / 02:14');
  });
  it.each(['004', '005'] as const)('keeps $0 shutdown history wholly in 2001', id => {
    const events = permittedServiceEvents(id);
    expect(events.length).toBeGreaterThan(2); expect(events.every(e => e.timestamp.startsWith('2001-09-18'))).toBe(true);
    expect(text(newGame(), `LOG ${id}`)).toContain('No activity is recorded after 18 SEP 2001.');
    expect(text(newGame(), `LOG ${id}`)).toContain('this retrieval is not a current execution report');
  });
  it('preserves the only authored runtime restart and original closure wording', () => {
    const restart = permittedServiceEvents('006').filter(e => /restart/i.test(e.message));
    expect(restart.map(e => e.timestamp)).toEqual(['2003-11-02T03:14:09']);
    expect(text(newGame(), 'LOG 006')).not.toContain('03:41');
    const original = FILES.find(f => f.id === 'status-log')!.body;
    for (const event of SERVICE_EVENTS.filter(e => e.source.reference === '/OPERATIONS/STATUS_LOG_2003.TXT')) {
      expect(original).toContain(event.timestamp.slice(11)); expect(original).toContain(event.message);
    }
    const closure = FILES.find(f => f.id === 'authorization')!.body;
    expect(closure).toContain('006   Continuity monitor      Closed'); expect(closure).toContain('Shutdown approved: 18 Sep 2001.');
    expect(closure).not.toMatch(/Decommissioning marked COMPLETE|All listed services removed/);
    const annotation = SERVICE_EVENTS.find(e => e.category === 'HIST')!;
    expect(annotation.timestamp).toBe('2001-09-18'); expect(annotation.source.kind).toBe('archive-annotation');
  });
  it('does not expose private session samples or manufacture past Records Access activity', () => {
    expect(permittedServiceEvents('007')).toEqual([]);
    expect(text(newGame(), 'LOG 007')).toContain('Individual client activity is not included');
    expect(JSON.stringify(SERVICE_EVENTS)).not.toMatch(/Old remote client requested|Client shown file-unavailable/);
  });
});

describe('deterministic service questions and conversation', () => {
  const questions = [
    ['What services are running?', 'REGISTERED SERVICES'], ['What does Service 001 do?', 'support agreements'],
    ['Is the message router working?', 'STANDBY'], ['Why is billing stopped?', 'Finance Operations'],
    ['Show me the equipment register logs.', 'Duplicate reference corrected'], ['What happened to Building Sensors?', '18:02'],
    ['When did Service 004 stop?', '18:31'], ['Which services are still active?', 'REGISTERED SERVICES'],
    ['What does standby mean?', 'Installed and available'], ['Who maintains the records system?', 'Victor Chen; Oliver Ames; Gina Valdez'],
    ['Show me recent service warnings.', 'ARC-91-044'], ['What is the difference between a shutdown report and current status?', 'dated departmental claim'],
  ];
  it.each(questions)('answers %s offline and with an incorrect model candidate', (input, expected) => {
    const s = newGame(); const offline = runInput(s, input, classify(input, s));
    const modeled = runInput(s, input, selectMeaning(input, s, [{ intent: 'q_anna_identity', score: .99 }]));
    const forged = runInput(s, input, { intent: 'request_stop', entityId: 'service-006', needsClarification: false, provider: 'ollama' });
    expect(offline.output.lines.join(' ')).toContain(expected);
    expect(modeled.output).toEqual(offline.output); expect(forged.output).toEqual(offline.output);
    expect(directInterpretation(input, s)?.method).toBe('deterministic');
    expect(story(offline.state)).toEqual(story(s)); expect(offline.encounters).toBeUndefined();
    expect(JSON.stringify(offline.output)).not.toMatch(protectedText);
  });
  it('retains service 003 follow-ups through a save and an unrelated pending operation', () => {
    let s = newGame(); s.pendingOperation = 'restore-bridge';
    s = runInput(s, 'What does Service 003 do?').state;
    expect(text(s, 'Is it working?')).toContain('STATE: STANDBY');
    s.pendingOperation = undefined; s = decodeSave(JSON.stringify(s)).state;
    const log = runInput(s, 'Show me its logs.');
    expect(log.output.lines[0]).toContain('SERVICE 003'); expect(log.state.lastTopic).toBe('service-003');
    expect(text(log.state, 'What does it do?')).toContain('SERVICE 003');
    const general = runInput(log.state, 'Which services are still active?');
    expect(text(general.state, 'Is it working?')).toContain('Which service');
  });
  it.each(SERVICES)('validates provider subject $id and preserves it across a save', service => {
    const query = validateInterpretation({ intent: 'ask_service_status', entityId: `service-${service.id}`, needsClarification: true }, 'browser-ai');
    expect(query?.entityId).toBe(`service-${service.id}`);
    const s = runInput(newGame(), `INFO ${service.id}`).state;
    expect(decodeSave(JSON.stringify(s)).state).toEqual(s);
  });
  it.each(['STOP 006', 'START 004', 'REROUTE 003', 'Can you stop Service 002?', 'Please disable Service 007'])('refuses service control without granting operational privileges: %s', input => {
    const s = newGame(); const t = runInput(s, input);
    expect(t.output.code).toBe('denied'); expect(t.output.lines).toContain('CONTROL UNAVAILABLE.');
    expect(story(t.state)).toEqual(story(s)); expect(t.state.discoveredEvidenceIds).toEqual([]);
  });
});

describe('evidence, existing investigation, saves and QA compatibility', () => {
  it.each(['register', 'status-log'])('reading saved %s is not a fresh status query', id => {
    const s = inspectFile(newGame(), id).state;
    expect(s.discoveredEvidenceIds).not.toContain('EV_SERVICE_ACTIVE'); expect(s.viewedFileIds).toContain(id);
    expect(runInput(s, 'STATUS').state.discoveredEvidenceIds).toContain('EV_SERVICE_ACTIVE');
    expect(runInput(newGame(), 'LOG 006').state.discoveredEvidenceIds).not.toContain('EV_SERVICE_ACTIVE');
  });
  it.each([
    ['STATUS', 'OPEN Closure list'], ['OPEN Closure list', 'STATUS'],
    ['OPEN Restart log', 'OPEN Closure list'], ['OPEN Service 006', 'OPEN Closure list'],
    ['INFO 002', 'LOG 008', 'INFO 006', 'OPEN Closure list'],
  ].map(inputs => [inputs] as const))('preserves existing review progression with source order %j', inputs => {
    const s = play([...inputs, 'OPEN Handover receipt', 'OPEN backup', 'READ /COMMS/BRIDGE_02_STATUS.LOG', 'Please investigate the discrepancy']);
    const t = runInput(s, 'The office approval is not an operational release; holding system confirmation is missing.');
    expect(t.state.investigation.stage).toBe('provenance'); expect(t.state.permissions).toEqual([]);
    const expected = s.discoveredEvidenceIds.includes('EV_SERVICE_ACTIVE') ? 'live-service-006' : 'archived-service-006';
    expect(t.encounters?.[0].evidence).toContain(expected);
    const completed = runInput(t.state, 'The preservation controller accepted the transfer; release permission is still absent.');
    expect(completed.state.investigation.stage).toBe('complete'); expect(completed.state.operating).toEqual(newGame().operating);
  });
  it('does not let reading logs solve the review, even with a correct answer', () => {
    const s = play(['LOG 006', 'OPEN Closure list', 'OPEN Handover receipt', 'Please investigate the discrepancy']);
    const t = runInput(s, 'The office approval is not an operational release; holding system confirmation is missing.');
    expect(t.encounters?.[0].outcome).toBe('missing-evidence'); expect(t.state.investigation.stage).toBe('closure');
  });
  it('preserves active review, pending clarification and operations across ordinary views', () => {
    const s = play(['STATUS', 'OPEN Closure list', 'Please investigate the discrepancy']);
    s.pendingOperation = 'restore-bridge'; s.pendingClarification = { input: 'Who approved it?', interpretation: { intent: 'ask_authorization', needsClarification: true, provider: 'fallback' } };
    for (const input of ['STATUS', 'INFO 001', 'LOG 006', 'What does Service 003 do?', 'Show me its logs.', 'REROUTE 003']) {
      const t = runInput(s, input); expect(story(t.state)).toEqual(story(s));
    }
  });
  it('keeps public corporate exploration and restricted record searches intact', () => {
    const s = play(['INFO 001', 'LOG 008']);
    expect(text(s, 'Who founded Meridian?')).toContain('Dr. Ruth Calder');
    expect(text(s, 'Who is Anna Voss?')).toContain('Head Researcher');
    expect(text(s, 'SEARCH Bell')).toContain('Andrew Bell'); expect(text(s, 'SEARCH Bell')).toContain('Iris Bell');
    for (const term of ['AV-06', 'Site 6', 'MOTHER', 'DOC-CLN']) expect(runInput(s, `SEARCH ${term}`).output.links).toEqual([]);
    for (const input of ['INFO AV-06', 'LOG MOTHER', 'INFO 006 patient', 'Show me service 006 logs for Anna']) expect(JSON.stringify(runInput(s, input).output)).not.toMatch(protectedText);
  });
  it('records INFO/LOG as read-only QA commands without authority or stage milestones', () => {
    for (const input of ['INFO 003', 'LOG 006']) {
      const s = newGame(); const handle = qaInteraction(input, s, 'terminal'); const t = runInput(s, input);
      expect(handle.kind).toBe('command'); expect(handle.operation).toBeNull();
      const events = transitionObservations(s, t, { source: 'terminal', name: input, interaction: handle });
      expect(events.some(e => e.type === 'response_selected')).toBe(true);
      expect(events.some(e => ['act_transition', 'milestone_reached', 'ending_selected', 'encounter_completed'].includes(e.type))).toBe(false);
    }
    const s = newGame(); const t = runInput(s, 'What does Service 003 do?');
    const events = transitionObservations(s, t, { source: 'terminal', name: 'question', interaction: qaInteraction('What does Service 003 do?', s, 'terminal') });
    expect(events.find(e => e.type === 'question_resolved')?.data['entityId']).toBe('service-003');
    expect(events.find(e => e.type === 'response_selected')?.data['variant']).toMatchObject({ variantId: 'service:003:info' });
  });
});
