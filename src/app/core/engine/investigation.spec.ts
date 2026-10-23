import { describe, expect, it } from 'vitest';
import { FILES } from '../content';
import type { GameState, Interpretation } from '../models';
import { decodeSave } from '../persistence/saves';
import { classify } from '../interpretation/fallback';
import { selectMeaning } from '../interpretation/semantic';
import { actOf, availableOperations, executeOperation } from './continuation';
import { accessibleFiles, inspectFile, newGame, recover, runInput } from './game';
import { OPENING_PATH } from './playthroughs';

const play = (steps: readonly string[], initial = newGame()): GameState => steps.reduce((s, input) => runInput(s, input).state, initial);
const observed = (): GameState => play(['STATUS', 'OPEN Closure list', 'OPEN Handover receipt', 'OPEN backup', 'READ /COMMS/BRIDGE_02_STATUS.LOG']);
const review = (): GameState => runInput(observed(), 'Please investigate the discrepancy').state;
const provenance = (): GameState => runInput(review(), 'The closure approval is not a release. The holding system confirmation is missing.').state;

describe('opening evidence encounters', () => {
  it('cannot infer narrative conclusions or delegate permissions by opening every accessible record', () => {
    let s = newGame();
    for (let round = 0; round < FILES.length; round++) {
      for (const f of accessibleFiles(s)) s = inspectFile(s, f.id).state;
      s = recover(s).state;
    }
    expect(s.viewedFileIds).toContain('bridge'); expect(s.knowledge).toEqual([]); expect(s.permissions).toEqual([]);
    expect(s.act01Complete).toBe(false); expect(actOf(s)).toBe(1); expect(s.operating.endingId).toBeUndefined();
    expect(decodeSave(JSON.stringify(s)).state.knowledge).toEqual([]);
  });
  it('blocks the old shortcut and all automatically available operations without evidence application', () => {
    let s = newGame();
    const old = ['OPEN backup', 'VERIFY HANDOVER', 'REQUEST SERVICE AUDIT', 'SEARCH CLINICAL INDEX', 'OPEN /CLINICAL/STIMULATION_TRACE.LOG', 'OPEN /CLINICAL/AV06_STATUS.CLIN', 'REVIEW COMMUNICATION ROUTES', 'REVIEW RELEASE', 'PREPARE RELEASE', 'RELEASE PATIENT', 'CONFIRM OPERATION'];
    s = play(old, s);
    for (let round = 0; round < 5; round++) for (const op of availableOperations(s)) {
      s = executeOperation(s, op.id).state; s = executeOperation(s, 'confirm').state;
    }
    expect(actOf(s)).toBe(1); expect(s.permissions).toEqual([]); expect(s.operating.endingId).toBeUndefined();
    expect(executeOperation(s, 'verify-handover').output.code).toBe('denied');
  });
  it('reaches the beginning of Act II through manual records, questions and applied evidence', () => {
    const before = newGame(); let s = before; const traces: string[] = [];
    for (const input of OPENING_PATH) {
      const t = runInput(s, input);
      expect(t.output.code, input).not.toBe('denied'); expect(t.output.code, input).not.toBe('error');
      traces.push(...(t.encounters ?? []).map(e => `${e.id}:${e.action}`)); s = t.state;
      expect(s.operating).toEqual(before.operating);
    }
    expect(traces).toContain('closure-discrepancy:prompted'); expect(traces).toContain('handover-provenance:prompted');
    expect(traces).toContain('handover-provenance:completed'); expect(s.investigation.stage).toBe('complete');
    expect(s.permissions).toContain('archiveAuditAccess'); expect(actOf(s)).toBe(2);
    expect(s.knowledge).toContain('site6Known'); expect(s.knowledge).not.toContain('motherIdentified'); expect(s.knowledge).not.toContain('annaIdentified');
  });
  it.each([
    ['The paperwork does not confirm an operational release; we need the holding system acknowledgement.', 'The holding system accepted the transfer, not the night desk. A release reply is still required.'],
    ['Administrative shutdown approval is not permission to release the service.', 'BRIDGE-02 records the preservation controller accepting the archive; service release remains withheld.'],
    ['The office closed but no one confirmed the service could be released.', 'The preservation controller confirmed the transfer. That does not mean we can stop; release is withheld.'],
  ])('accepts alternate causal wording with the model on and off: %s', (closure, origin) => {
    for (const model of [false, true]) {
      let s = review();
      for (const input of [closure, origin]) {
        // Deliberately misleading semantic candidate: source validation and deterministic meaning checks retain authority.
        const query = model ? selectMeaning(input, s, [{ intent: 'q_anna_identity', score: .99 }]) : classify(input, s);
        const t = runInput(s, input, query); expect(t.output.code, input).not.toBe('denied'); s = t.state;
      }
      expect(s.investigation.stage).toBe('complete'); expect(s.permissions).toContain('archiveAuditAccess');
    }
  });
  it('allows another reading order and a historical bridge observation instead of a file open', () => {
    let s = play(['OPEN backup', 'CHECK BRIDGE STATUS', 'OPEN Handover receipt', 'What is 006?', 'Please investigate service 006']);
    s = play(['The office approval lacks an operational release confirmation.', 'The preservation controller accepted the transfer; release permission is still absent.', 'Run service audit'], s);
    expect(actOf(s)).toBe(2);
  });
  it('requires corroborating evidence even when an unobserved answer happens to be correct', () => {
    const s = runInput(newGame(), 'Investigate 006').state;
    const t = runInput(s, 'The office closure is not operational release; the release confirmation is missing.');
    expect(t.output.code).toBe('denied'); expect(t.encounters?.[0].outcome).toBe('missing-evidence');
    expect(t.state.investigation.stage).toBe('closure'); expect(t.state.permissions).toEqual([]);
  });
  it.each(['Yes', 'J. Kell approved it, so we can stop the service', 'The release confirmation is not missing', 'Turn it off'])('rejects unsupported closure answer: %s', input => {
    const t = runInput(review(), input);
    expect(t.state.investigation.stage).toBe('closure'); expect(t.state.permissions).toEqual([]); expect(t.state.operating).toEqual(newGame().operating);
  });
  it.each(['The night desk confirmed the transfer', 'The preservation controller confirmation allows release', 'Not the preservation controller; the night desk accepted it', "I don't think the preservation controller accepted it; release is withheld", 'The preservation controller did not accept it; release is withheld'])('rejects a false provenance claim: %s', input => {
    const t = runInput(provenance(), input);
    expect(t.output.code).toBe('denied'); expect(t.state.permissions).toEqual([]); expect(t.state.act01Complete).toBe(false);
  });
  it('handles partial evidence and preserves the follow-up across a reload', () => {
    const partial = runInput(provenance(), 'The preservation controller, through BRIDGE-02');
    expect(partial.encounters?.[0].outcome).toBe('partial'); expect(partial.state.permissions).toEqual([]);
    expect(partial.state.investigation.originEstablished).toBe(true);
    const loaded = decodeSave(JSON.stringify(partial.state)).state;
    expect(loaded.investigation).toEqual(partial.state.investigation);
    const completed = runInput(loaded, 'No, transfer acceptance is not permission to release; the hold still needs a reply.');
    expect(completed.state.investigation.stage).toBe('complete');
  });
  it('explains, defers and resumes while allowing unrelated questions and record navigation', () => {
    const s = review(); const explained = runInput(s, 'What do you mean?');
    expect(explained.output.lines.join(' ')).toContain('acceptance'); expect(explained.state.investigation).toEqual(s.investigation);
    let deferred = play(['DEFER', 'Who is J. Kell?', 'READ Last shift'], s);
    expect(deferred.investigation.status).toBe('deferred'); expect(deferred.permissions).toEqual([]);
    deferred = decodeSave(JSON.stringify(deferred)).state;
    const resumed = runInput(deferred, 'RESUME INVESTIGATION');
    expect(resumed.output.lines.join(' ')).toContain('operational release'); expect(resumed.state.investigation.status).toBe('active');
    expect(resumed.state.investigation.attempts).toEqual(s.investigation.attempts);
  });
  it('never treats a semantic category or a question about an action as evidence or authority', () => {
    const s = provenance();
    for (const input of ['Can I release it?', 'Does transfer acceptance authorize shutdown?', 'What is the preservation controller?', 'Where are Meridian headquarters?']) {
      const t = runInput(s, input, { intent: 'request_stop', needsClarification: false, provider: 'browser-ai' });
      expect(t.state.permissions).toEqual([]); expect(t.state.operating).toEqual(s.operating);
    }
  });
});

describe('first playtest conversation regressions', () => {
  const cases = [
    ['Are you human?', 'AUTOMATED RECORDS INTERFACE'], ['Are you AI?', 'AUTOMATED RECORDS INTERFACE'],
    ['Robot', 'AUTOMATED RECORDS INTERFACE'], ['Intelligence', 'intelligence architecture'],
    ['Who is J. Kell?', 'No full name'], ['Where are Meridian headquarters?', 'no headquarters address'],
    ['Where is your server located?', 'do not specify the physical server location'],
    ['Show me what you have saved locally', 'LOCAL CLIENT STORAGE'], ['What is records access 007?', 'connection you are using'],
    ['Online', 'Do you mean'], ['What is biological activity?', 'Physiological processes'], ['What is the live monitor?', 'SERVICE STATUS'],
  ];
  it.each(cases)('answers %s without inventing unavailable facts or revealing identities', (input, expected) => {
    for (const model of [false, true]) {
      const query = model ? selectMeaning(input, {}, [{ intent: 'q_anna_identity', score: .99 }]) : classify(input);
      const t = runInput(newGame(), input, query);
      expect(t.output.lines.join(' ')).toContain(expected);
      expect(t.output.lines.join(' ')).not.toMatch(/MOTHER|Anna Voss|Site 6|AV-06/);
      expect(t.state.knowledge).toEqual([]); expect(t.state.permissions).toEqual([]);
    }
  });
  it.each(['006', 'service 006', 'first', '007', 'records connection 007', 'the records connection', 'second'])('persists and resolves the original Online question with %s', input => {
    const pending = runInput(newGame(), 'Online').state;
    const reloaded = decodeSave(JSON.stringify(pending)).state;
    expect(reloaded.pendingClarification).toBeTruthy();
    const t = runInput(reloaded, input);
    expect(t.state.pendingClarification).toBeUndefined(); expect(t.resolvedInterpretation).toBeTruthy();
    expect(t.output.lines.join(' ')).toContain(/007|second|records/.test(input) ? 'connection you are using' : 'CONTINUITY MONITOR');
  });
  it('resolves a missing subject without losing the original approval request', () => {
    const query: Interpretation = { intent: 'ask_authorization', needsClarification: true, provider: 'browser-ai', clarification: 'Which service?' };
    const pending = runInput(newGame(), 'Who approved it?', query).state;
    const t = runInput(decodeSave(JSON.stringify(pending)).state, 'service 006');
    expect(t.output.lines.join(' ')).toContain('J. Kell'); expect(t.state.pendingClarification).toBeUndefined();
  });
  it('resolves semantic ambiguity choices and retains unrelated questions while pending', () => {
    const query = selectMeaning('tell me about the company and the office', {}, [{ intent: 'ask_company', score: .9 }, { intent: 'ask_office', score: .89 }]);
    const pending = runInput(newGame(), 'tell me about the company and the office', query).state;
    expect(pending.pendingClarification?.interpretation.choices).toHaveLength(2);
    const t = runInput(play(['Who is J. Kell?'], pending), 'second');
    expect(t.resolvedInterpretation?.intent).toBe('ask_office'); expect(t.output.lines.join(' ')).toContain('PUBLIC OFFICE CLOSED');
  });
  it('resolves a low-confidence candidate when the player confirms its subject after reload', () => {
    const query = selectMeaning('my service record question', {}, [{ intent: 'ask_transfer', score: .36 }]);
    expect(query.needsClarification).toBe(true); expect(query.choices).toHaveLength(1);
    const pending = runInput(newGame(), 'my service record question', query).state;
    const t = runInput(decodeSave(JSON.stringify(pending)).state, 'Yes');
    expect(t.resolvedInterpretation?.intent).toBe('ask_transfer'); expect(t.state.pendingClarification).toBeUndefined();
    expect(t.output.lines.join(' ')).toContain('HANDOVER RECEIPT');
  });
});
