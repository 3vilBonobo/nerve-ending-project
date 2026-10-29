import { TestBed } from '@angular/core/testing';
import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GameState, Interpretation } from '../models';
import { inspectFile, newLegacyGame as newGame, runInput } from '../engine/game';
import { GOLDEN_PATHS, INVESTIGATION_PATH } from '../engine/playthroughs';
import { DIALOGUE } from '../interpretation/dialogue-catalog';
import { classify } from '../interpretation/fallback';
import { interpretSafely } from '../interpretation/providers';
import { Session } from '../session';
import { openQaDatabase, QaStore } from './database';
import { narrativeSnapshot } from './events';
import { APPLICATION_VERSION, QaEvent } from './types';
import { QA_STORE_FACTORY, QaTelemetry, qaJsonLines } from './telemetry';
import { redactQaText } from './privacy';
import { decodeSave } from '../persistence/saves';

describe('opt-in playtest telemetry', () => {
  let store: QaStore; let qa: QaTelemetry;
  let state: GameState;
  beforeEach(async () => {
    store = await openQaDatabase(new IDBFactory());
    TestBed.configureTestingModule({ providers: [{ provide: QA_STORE_FACTORY, useValue: () => Promise.resolve(store) }] });
    qa = TestBed.inject(QaTelemetry); state = newGame('2026-10-20T12:00:00.000Z', 'MR-TEST');
    qa.observe(state); await qa.ready;
  });
  function submit(input: string, interpretation?: Interpretation): void {
    const handle = qa.beginInput(input, state, 'terminal');
    const query = handle?.kind === 'question' ? interpretation ?? classify(input, { lastTopic: state.lastTopic, lastIntent: state.lastIntent }) : undefined;
    const transition = runInput(state, input, query);
    qa.finishInput(handle, state, transition, query ? { interpretation: query, metrics: { elapsedMs: 2, fallback: query.provider === 'fallback', provider: query.provider } } : undefined);
    state = transition.state;
  }
  async function rows(): Promise<QaEvent[]> { await qa.flush(); return store.events(); }

  it('stores nothing by default, including questions, navigation, feedback and exports', async () => {
    submit('Who are you?'); qa.transition(state, inspectFile(state, 'call'), 'OPEN RECORD', 'file-browser', 'call');
    expect(qa.feedback(state, 'missing', 'confusing', 'note')).toBe(false);
    expect(await rows()).toEqual([]); expect((await qa.export('all')).text).toBe('');
    expect(await store.enabled()).toBe(false);
  });
  it('records every submitted question and exact selected response with shared interaction and state', async () => {
    await qa.setEnabled(true, state); const before = structuredClone(state);
    const query: Interpretation = { intent: 'q_greeting', provider: 'browser-ai', method: 'semantic', confidence: .82, needsClarification: false };
    const expected = runInput(state, 'Hello there', query);
    submit('Hello there', query);
    const events = await rows(); const question = events.find(r => r.type === 'question_submitted')!;
    const resolved = events.find(r => r.type === 'question_resolved')!; const response = events.find(r => r.type === 'response_selected')!;
    expect(question.data['input']).toBe('Hello there'); expect(resolved.data).toMatchObject({ intent: 'q_greeting', method: 'semantic', confidence: .82, fallbackUsed: false, result: 'recognized' });
    expect(response.data['variant']).toEqual(expected.dialogue);
    expect(response.data['output']).toEqual(expected.output); expect(response.data['conditions']).toEqual(narrativeSnapshot(before));
    expect(response.interactionId).toBe(question.interactionId); expect(resolved.interactionId).toBe(question.interactionId);
    for (const e of events) { expect(e.timestamp).toMatch(/^2026-/); expect(e.applicationVersion).toBe(APPLICATION_VERSION); expect(e.sessionId).toBeTruthy(); expect(e.state.act).toBe(1); }
    expect(state).toEqual(expected.state); expect(qa.stats().questions).toBe(1);
  });
  it('identifies early, revealed, repetition and legacy response variants without altering the engine', async () => {
    await qa.setEnabled(true, state);
    const entry = DIALOGUE.find(e => e.gate)!;
    const query: Interpretation = { intent: entry.id, provider: 'fallback', needsClarification: false };
    submit(entry.examples[0], query);
    state = { ...state, knowledge: [...state.knowledge, entry.gate!] };
    submit(entry.examples[0], query); submit(entry.examples[0], query); submit(entry.examples[0], query);
    submit('Who is calling?', { intent: 'ask_calls', provider: 'fallback', needsClarification: false });
    const variants = (await rows()).filter(e => e.type === 'response_selected').map(e => e.data['variant']);
    expect(variants[0]).toMatchObject({ variantId: `${entry.id}:early`, conditions: { gateSatisfied: false } });
    expect(variants[1]).toMatchObject({ variantId: `${entry.id}:revealed`, conditions: { gateSatisfied: true } });
    expect(variants[3]).toMatchObject({ modifiers: ['repetition-review'] });
    expect(variants[4]).toMatchObject({ variantId: expect.stringMatching(/^legacy:ask_calls:/) });
  });
  it('captures ambiguity, unmatched intent, deterministic classification and fallback reason', async () => {
    await qa.setEnabled(true, state);
    state = { ...state, lastIntent: 'ask_calls' };
    submit('What about it?', { intent: 'ask_clarification', provider: 'browser-ai', method: 'semantic', confidence: .44, needsClarification: true, clarification: 'Which record?' });
    submit('purple teapot universe', { intent: 'unknown', provider: 'browser-ai', method: 'semantic', needsClarification: false });
    const result = await interpretSafely('Who are you?', {}, { id: 'broken', isAvailable: async () => false, interpret: vi.fn() });
    const handle = qa.beginInput('Who are you?', state, 'terminal'); const transition = runInput(state, 'Who are you?', result.interpretation);
    qa.finishInput(handle, state, transition, result); state = transition.state;
    const resolved = (await rows()).filter(e => e.type === 'question_resolved');
    expect(resolved[0].data).toMatchObject({ ambiguous: true, result: 'ambiguous', clarification: 'Which record?' });
    expect((await rows()).find(e => e.type === 'response_selected')?.data['variant']).toMatchObject({ intent: 'ask_clarification' });
    expect(resolved[1].data).toMatchObject({ result: 'unmatched', confidence: null });
    expect(resolved[2].data).toMatchObject({ method: 'deterministic', fallbackUsed: true, fallbackReason: 'unavailable' });
    expect(qa.stats()).toMatchObject({ questions: 3, ambiguities: 1, unknown: 1, fallbacks: 1 });
  });
  it('records encounter source checks, wrong and partial answers, deferral, reload and contextual resolution', async () => {
    await qa.setEnabled(true, state);
    for (const input of ['STATUS', 'READ Closure list', 'READ Handover receipt', 'Investigate 006', 'J. Kell approved it, so we can stop the service', 'DEFER', 'RESUME INVESTIGATION', 'The office approval is not an operational release; confirmation from the holding system is missing.', 'OPEN backup', 'CHECK BRIDGE STATUS', 'The preservation controller, through BRIDGE-02']) submit(input);
    state = decodeSave(JSON.stringify(state)).state;
    submit('No, transfer acceptance is not release permission. The hold still needs a reply.');
    submit('Online'); state = decodeSave(JSON.stringify(state)).state; submit('007');
    const events = await rows();
    expect(events.some(e => e.type === 'challenge_attempt' && e.data['outcome'] === 'incorrect')).toBe(true);
    expect(events.some(e => e.type === 'challenge_attempt' && e.data['outcome'] === 'partial')).toBe(true);
    expect(events.some(e => e.type === 'challenge_attempt' && e.data['success'] === true)).toBe(true);
    expect(events.some(e => e.type === 'encounter_deferred')).toBe(true); expect(events.some(e => e.type === 'encounter_resumed')).toBe(true);
    expect(events.find(e => e.type === 'encounter_completed' && e.data['encounterId'] === 'handover-provenance')?.data['evidence']).toEqual(expect.arrayContaining(['handover-backup','bridge-02-status']));
    const contextual = events.filter(e => e.type === 'question_resolved').at(-1)!;
    expect(contextual.data).toMatchObject({ contextResolved: true, resolutionMethod: 'deterministic-context', resolvedIntent: 'ask_service_status' });
    const exported = (await qa.export('current')).text.trim().split('\n').map(line => JSON.parse(line));
    expect(exported.map(e => e.sequence)).toEqual(events.map(e => e.sequence));
    expect(state.permissions).toEqual(['archiveAuditAccess','bridgeStatusAccess']); expect(state.operating).toEqual(newGame().operating);
  });
  it('records file opens, access denials, failed operations, authorization questions and challenge attempts', async () => {
    await qa.setEnabled(true, state);
    const before = structuredClone(state);
    qa.transition(state, inspectFile(state, 'call'), 'OPEN RECORD', 'file-browser', 'call');
    qa.transition(state, inspectFile(state, 'revocation'), 'OPEN RECORD', 'record-link', 'revocation');
    submit('RESTORE BRIDGE'); submit('Who authorized this?', { intent: 'ask_authorization', provider: 'fallback', needsClarification: false });
    const events = await rows();
    expect(events.find(e => e.type === 'file_opened')?.data).toMatchObject({ fileId: 'call', previouslyViewed: false });
    expect(events.find(e => e.type === 'file_open_attempt')?.data).toMatchObject({ fileId: 'revocation', success: false });
    expect(events.filter(e => e.type === 'action_failed').length).toBeGreaterThanOrEqual(2);
    expect(events.some(e => e.type === 'authorization_challenged')).toBe(true);
    expect(events.some(e => e.type === 'challenge_attempt')).toBe(true);
    expect(events.find(e => e.type === 'operation_requested')?.data['operation']).toBe('restore-bridge');
    expect(events.find(e => e.type === 'action_failed')?.data['reason']).toBeTruthy();
    expect(before.viewedFileIds).toEqual([]);
  });
  it('distinguishes unsuccessful searches, malformed commands and unmatched questions from permission challenges', async () => {
    await qa.setEnabled(true, state); submit('SEARCH zzzz-no-match-zzzz'); submit('CD /DOES_NOT_EXIST');
    submit('purple teapot universe', { intent: 'unknown', provider: 'browser-ai', needsClarification: false });
    const events = await rows(); const outcomes = events.filter(e => e.type === 'action_result');
    expect(outcomes.map(e => e.data['success'])).toEqual([false, false, false]);
    expect(outcomes.map(e => e.data['outcome'])).toEqual(['no-results', 'failed', 'unmatched']);
    expect(outcomes.every(e => !!e.data['reason'])).toBe(true);
    expect(events.some(e => e.type === 'challenge_attempt')).toBe(false);
  });
  it('records a public personnel search as successful even with zero document matches', async () => {
    await qa.setEnabled(true, state); submit('SEARCH Leah Morgan'); submit('Who is Anna Voss?');
    const events = await rows();
    expect(events.filter(e => e.type === 'action_result').map(e => e.data['outcome'])).toEqual(['succeeded', 'succeeded']);
    expect(events.filter(e => e.type === 'action_failed')).toEqual([]);
    expect(events.filter(e => ['milestone_reached', 'act_transition', 'encounter_prompted'].includes(e.type))).toEqual([]);
    expect(events.find(e => e.type === 'response_selected' && e.data['input'] === 'Who is Anna Voss?')?.data['variant']).toMatchObject({ variantId: 'corporate:personnel:P025' });
    expect(state.knowledge).toEqual([]); expect(state.permissions).toEqual([]);
  });
  it('keeps repeated intervention requests pending and records confirmation without a pending action as unsuccessful', async () => {
    state = INVESTIGATION_PATH.reduce((s, input) => runInput(s, input).state, state);
    await qa.setEnabled(true, state); submit('RELEASE PATIENT'); submit('RELEASE PATIENT'); submit('CANCEL'); submit('CONFIRM OPERATION');
    const outcomes = (await rows()).filter(e => e.type === 'action_result');
    expect(outcomes.map(e => e.data['outcome'])).toEqual(['awaiting-confirmation', 'awaiting-confirmation', 'cancelled', 'failed']);
    expect(outcomes.map(e => e.data['success'])).toEqual([false, false, true, false]);
    expect(state.operating.endingId).toBeUndefined(); expect(state.operating.annaBiologicallyAlive).toBe(true);
  });
  for (const [ending, path] of Object.entries(GOLDEN_PATHS)) {
    it(`reconstructs the complete ordered ${ending} path, comparisons and narrative milestones`, async () => {
      await qa.setEnabled(true, state); const initial = structuredClone(state);
      for (const input of path) submit(input);
      const events = await rows();
      expect(state).toEqual(path.reduce((s, input) => runInput(s, input).state, initial));
      expect(events.map(e => e.sequence)).toEqual(events.map((_, i) => i + 1));
      expect(events.find(e => e.type === 'ending_selected')?.data).toMatchObject({ endingId: ending, explicitlyConfirmed: true });
      expect(events.some(e => e.type === 'evidence_compared' && e.data['success'])).toBe(true);
      expect(events.some(e => e.type === 'milestone_reached')).toBe(true);
      expect(events.some(e => e.type === 'act_transition')).toBe(true);
      const results = events.filter(e => e.type === 'action_result');
      expect(results).toHaveLength(path.length);
      expect(results.map(e => e.data['action'])).toEqual([...path]);
      const responses = events.filter(e => e.type === 'response_selected');
      expect(responses.map(e => e.data['output'])).toEqual(results.map(e => e.data['output']));
      expect(responses).toHaveLength(path.length);
      expect(responses[2].data['variant']).toMatchObject({ profile: 'ADMINISTRATIVE', variantId: 'encounter:closure-discrepancy:prompted:pending' });
      expect(events.filter(e => e.type === 'encounter_completed').map(e => e.data['encounterId'])).toEqual(['closure-discrepancy', 'handover-provenance']);
      for (let n = 1; n < results.length; n++) expect(results[n].data['before']).toEqual(results[n - 1].state);
      submit('RESTORE BRIDGE');
      expect((await rows()).filter(e => e.type === 'action_result').at(-1)?.data).toMatchObject({ success: false, outcome: 'failed', accessDenied: false });
    });
  }
  it('exports one valid JSON object per line in persistent order, scoped to current or all sessions', async () => {
    await qa.setEnabled(true, state); submit('First question\nsecond line?');
    const firstId = qa.currentSession()?.id; await qa.flush();
    state = newGame('2026-10-20T13:00:00.000Z', 'MR-SECOND'); qa.observe(state); submit('Who are you?');
    const current = await qa.export('current'); const all = await qa.export('all');
    const parse = (text: string): QaEvent[] => text.trim().split('\n').map(line => JSON.parse(line));
    expect(current.filename).toMatch(/^nerve-ending-qa-.*\.jsonl$/);
    expect(new Set(parse(current.text).map(e => e.sessionId)).size).toBe(1);
    expect(new Set(parse(all.text).map(e => e.sessionId)).size).toBe(2);
    const exported = parse(all.text); expect(exported.map(e => e.order)).toEqual([...exported.map(e => e.order)].sort((a,b) => a-b));
    expect(exported.some(e => e.data['input'] === 'First question\nsecond line?')).toBe(true);
    expect(qaJsonLines(exported.reverse())).toBe(all.text);
    expect(firstId).toBeTruthy();
  });
  it('persists opt-in and resumes the same anonymous session after service recreation', async () => {
    await qa.setEnabled(true, state); submit('Who are you?'); await qa.flush();
    const id = qa.currentSession()!.id; const count = qa.currentSession()!.eventCount;
    // Recreate service state; the database adapter separately tests connection close/reopen.
    const second = TestBed.runInInjectionContext(() => new QaTelemetry());
    second.observe({ ...state, hasStarted: true }); await second.ready; await second.flush();
    expect(second.enabled()).toBe(true); expect(second.currentSession()!.id).toBe(id);
    expect(second.currentSession()!.eventCount).toBe(count + 1);
    expect(second.recent().at(-1)?.type).toBe('session_resumed');
  });
  it('stops on opt-out including in-flight results, without backfilling disabled play', async () => {
    await qa.setEnabled(true, state); const handle = qa.beginInput('Who are you?', state, 'terminal');
    await qa.setEnabled(false, state);
    qa.finishInput(handle, state, runInput(state, 'Who are you?')); submit('What is this place?');
    const off = await rows(); expect(off.at(-1)?.type).toBe('qa_disabled'); expect(off.some(e => e.type === 'response_selected')).toBe(false);
    await qa.setEnabled(true, state); expect((await rows()).length).toBe(off.length + 1);
  });
  it('redacts credentials and common personal data before IndexedDB writes, including echoes and feedback', async () => {
    await qa.setEnabled(true, state);
    const input = 'password=game-secret token: secret-token email tester@example.com Bearer private-token https://site.test/private';
    const handle = qa.beginInput(input, state, 'terminal');
    const query: Interpretation = { intent: 'unknown', provider: 'fallback', needsClarification: false };
    const transition = runInput(state, input, query); transition.output.lines.push(input);
    qa.finishInput(handle, state, transition, { interpretation: query, metrics: { elapsedMs: 1, provider: 'fallback', fallback: true } });
    await qa.flush(); const target = qa.responses()[0];
    expect(qa.feedback(state, target.id, 'confusing', 'api_key=note-secret phone +30 6912345678')).toBe(true);
    const stored = JSON.stringify(await rows());
    for (const secret of ['game-secret', 'secret-token', 'tester@example.com', 'private-token', 'site.test', 'note-secret', '6912345678']) expect(stored).not.toContain(secret);
    expect(stored).toContain('REDACTED'); expect((await rows()).some(e => e.type === 'challenge_attempt')).toBe(true);
    expect(redactQaText('AUTH 0417 / 17 APR 1996 / 2003-11-06 / 612 cycles / 88 attempts')).toBe('AUTH 0417 / 17 APR 1996 / 2003-11-06 / 612 cycles / 88 attempts');
    expect(redactQaText('my password hunter2')).not.toContain('hunter2');
    expect(redactQaText('sk-abcdefghijklmnop eyJhbGciOiJIUzI1NiJ9.payload.signature')).not.toContain('abcdefghijklmnop');
  });
  it('links optional feedback to a stored response and keeps game state unchanged', async () => {
    await qa.setEnabled(true, state); submit('Who are you?'); await qa.flush(); const before = structuredClone(state);
    const response = qa.responses()[0];
    expect(qa.feedback(state, response.id, 'effective', 'The source link helped.')).toBe(true);
    expect(qa.feedback(state, 'missing', 'incorrect', 'not valid')).toBe(false);
    const feedback = (await rows()).find(e => e.type === 'feedback')!;
    expect(feedback.data).toMatchObject({ responseEventId: response.id, responseSequence: response.sequence, tag: 'effective' });
    expect(feedback.interactionId).toBe(response.interactionId); expect(state).toEqual(before);
  });
  it('records Session entry points and retains QA through investigation resets', async () => {
    localStorage.clear(); const session = TestBed.inject(Session);
    await qa.setEnabled(true, session.state()); session.start(); session.openFile('call', 'file-browser'); session.focusFile('call'); session.closeFile('call'); session.directory('/ADMIN');
    const request = session.submit('Who are you?'); session.playback.skip(); await request;
    await qa.flush(); const first = qa.currentSession()!.id;
    session.reset(); session.start(); await qa.flush();
    expect(qa.sessions()).toHaveLength(2); expect(qa.currentSession()!.id).not.toBe(first);
    const events = await store.events(first);
    for (const type of ['session_started', 'file_opened', 'file_focused', 'file_closed', 'directory_changed', 'question_resolved', 'response_selected', 'session_reset']) expect(events.some(e => e.type === type)).toBe(true);
    expect((await qa.export('all')).text).toContain(first);
  });
  it('clears QA only, disables consent and preserves saves and other site storage', async () => {
    await qa.setEnabled(true, state); submit('Who are you?');
    localStorage.setItem('nerve-ending-save', 'unchanged'); localStorage.setItem('other-feature', 'untouched');
    const before = structuredClone(state); await qa.clear();
    expect(await store.events()).toEqual([]); expect(await store.sessions()).toEqual([]); expect(await store.enabled()).toBe(false);
    expect(qa.enabled()).toBe(false); expect((await qa.export('all')).text).toBe('');
    expect(localStorage.getItem('nerve-ending-save')).toBe('unchanged'); expect(localStorage.getItem('other-feature')).toBe('untouched'); expect(state).toEqual(before);
  });
  it('stops recording on storage failure while gameplay and previously recorded exports remain available', async () => {
    const session = TestBed.inject(Session); await qa.setEnabled(true, session.state());
    const commit = vi.spyOn(store, 'commit').mockRejectedValueOnce(new Error('Quota exceeded'));
    session.openFile('call'); await qa.flush();
    expect(session.state().viewedFileIds).toContain('call'); expect(qa.enabled()).toBe(false);
    expect(qa.warning()).toContain('Recording has stopped'); expect((await qa.export('all')).text).toContain('qa_enabled');
    commit.mockRestore(); await qa.clear(); expect(qa.warning()).toBe('');
  });
});

describe('unavailable QA storage', () => {
  it('keeps recording off and allows gameplay when IndexedDB cannot be opened', async () => {
    localStorage.clear(); TestBed.configureTestingModule({ providers: [{ provide: QA_STORE_FACTORY, useValue: () => Promise.reject(new Error('blocked')) }] });
    const session = TestBed.inject(Session); await session.qa.ready;
    session.start(); session.openFile('call');
    expect(session.state().viewedFileIds).toContain('call'); expect(session.qa.enabled()).toBe(false);
    expect(session.qa.warning()).toContain('storage is unavailable');
    await session.qa.setEnabled(true, session.state()); expect(session.qa.enabled()).toBe(false);
  });
  it('shows recording off if loading previously enabled recordings fails', async () => {
    const store = await openQaDatabase(new IDBFactory()); await store.commit('game', [], true);
    vi.spyOn(store, 'sessions').mockRejectedValue(new Error('read error'));
    TestBed.configureTestingModule({ providers: [{ provide: QA_STORE_FACTORY, useValue: () => Promise.resolve(store) }] });
    const qa = TestBed.inject(QaTelemetry); await qa.ready;
    expect(qa.enabled()).toBe(false); expect(qa.warning()).toContain('Recording is off');
  });
});
