import { describe, expect, it } from 'vitest';
import { FILES } from '../content';
import { DIALOGUE } from '../interpretation/dialogue-catalog';
import { classify } from '../interpretation/fallback';
import { resolveFollowup } from '../interpretation/dialogue-matching';
import { selectMeaning } from '../interpretation/semantic';
import { GameState } from '../models';
import { decodeSave } from '../persistence/saves';
import { ENDINGS, KNOWLEDGE } from '../story-state';
import { actOf, availableOperations, canRead, endingText, executeOperation, OPERATION_DEFINITIONS, parseOperation } from './continuation';
import { answerDialogue, voiceOf } from './dialogue';
import { accessibleFiles, inspectFile, newGame, runInput } from './game';
import { GOLDEN_PATHS, INVESTIGATION_PATH, OPENING_PATH } from './playthroughs';

const play = (steps: readonly string[], initial = newGame()): GameState => steps.reduce((s, input) => {
  const result = runInput(s, input);
  expect(['denied', 'error'], input).not.toContain(result.output.code);
  return result.state;
}, initial);
const ready = (): GameState => play(INVESTIGATION_PATH);

describe('complete investigation and final interventions', () => {
  it.each(ENDINGS)('reaches %s through deterministic gameplay and survives reload', ending => {
    let s = newGame('2003-11-06T02:14:00Z', 'GOLDEN');
    const acts = new Set([actOf(s)]);
    for (const input of GOLDEN_PATHS[ending]) {
      const t = runInput(s, input);
      expect(t.output.code, input).not.toBe('denied'); expect(t.output.code, input).not.toBe('error');
      s = t.state; acts.add(actOf(s));
      expect(decodeSave(JSON.stringify(s)).state, input).toEqual(s);
    }
    expect([...acts].sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(s.operating.endingId).toBe(ending);
    expect(endingText(s).length).toBeGreaterThan(4);
    expect(s.operating.annaBiologicallyAlive).toBe(ending === 'CONTAINMENT_CONTINUATION');
    expect(s.operating.outboundPackageTransmitted).toBe(ending === 'MERCY_PROPAGATION');
    expect(s.operating.clinicalSupportActive).toBe(ending === 'CONTAINMENT_CONTINUATION');
    expect(runInput(s, 'RELEASE PATIENT').state.operating).toEqual(s.operating);
    expect(runInput(s, 'CONFIRM OPERATION').state.operating).toEqual(s.operating);
    expect(availableOperations(s)).toHaveLength(0);
    expect(inspectFile(s, 'personal-note').openFileId).toBe('personal-note');
  });
  it('keeps a standard-release package queued when no outbound bridge was restored', () => {
    const s = play(['RELEASE PATIENT', 'CONFIRM OPERATION'], ready());
    expect(s.operating.endingId).toBe('MERCY_PROPAGATION');
    expect(s.operating.outboundPackageQueued).toBe(true);
    expect(s.operating.outboundPackageTransmitted).toBe(false);
    expect(endingText(s).join(' ')).toContain('no external receipt');
    expect(endingText(s).join(' ')).not.toContain('delivered to');
  });
  it('isolates a staged but untransmitted package and keeps it held through standard release', () => {
    const s = play(['RESTORE BRIDGE', 'CONFIRM OPERATION', 'TEST RECOVERY ROUTE', 'CONFIRM OPERATION', 'ISOLATE BRIDGE', 'CONFIRM OPERATION', 'RELEASE PATIENT', 'CONFIRM OPERATION'], ready());
    expect(s.operating.outboundPackageQueued).toBe(true); expect(s.operating.outboundPackageTransmitted).toBe(false);
  });
  it('blocks every late operation in a new session without leaking identities', () => {
    for (const id of ['release-patient', 'controlled-release', 'revoke-vendor', 'restore-bridge', 'contain-site'] as const) {
      const r = executeOperation(newGame(), id);
      expect(r.output.code).toBe('denied'); expect(r.state.operating).toEqual(newGame().operating);
      expect(r.output.lines.join(' ')).not.toMatch(/Anna Voss|MOTHER|Site 6/);
    }
  });
  it('requires separate confirmation and allows cancellation without consequences', () => {
    const s = ready(); const pending = runInput(s, 'RELEASE PATIENT').state;
    expect(pending.pendingOperation).toBe('release-patient'); expect(pending.operating).toEqual(s.operating);
    expect(runInput(pending, 'CANCEL').state.operating).toEqual(s.operating);
    expect(runInput(pending, 'Can I confirm this?').state.operating).toEqual(s.operating);
    expect(runInput(runInput(pending, 'CANCEL').state, 'CONFIRM OPERATION').state.operating).toEqual(s.operating);
  });
  it('rechecks authorization when a pending operation is loaded or confirmed', () => {
    const pending = runInput(ready(), 'RELEASE PATIENT').state;
    pending.permissions = []; pending.operating.releaseProcedureStarted = false;
    expect(executeOperation(pending, 'confirm').output.code).toBe('denied');
    expect(decodeSave(JSON.stringify(pending)).state.pendingOperation).toBeUndefined();
  });
  it('keeps the later technical operation fixture reachable without reading every document', () => {
    const s = play([...INVESTIGATION_PATH, 'RELEASE PATIENT', 'CONFIRM OPERATION']);
    expect(s.operating.endingId).toBe('MERCY_PROPAGATION');
    expect(s.viewedFileIds.length).toBeLessThan(10);
    expect(s.knowledge).toContain('motherIdentified');
  });
  it('all safe investigations preserve operating state, and all read operations preserve historical bodies', () => {
    const s = ready(); const records = JSON.stringify(FILES);
    for (const op of availableOperations(s).filter(o => !o.warning)) expect(executeOperation(s, op.id).state.operating).toEqual(s.operating);
    for (const f of accessibleFiles(s)) expect(inspectFile(s, f.id).state.operating).toEqual(s.operating);
    expect(JSON.stringify(FILES)).toBe(records);
  });
  it('repeated audits and requests do not duplicate events or effects', () => {
    const first = play(OPENING_PATH);
    const repeated = play(['VERIFY HANDOVER', 'REQUEST SERVICE AUDIT'], first);
    expect(repeated.events.filter(e => e !== 'operation:verify-handover')).toEqual(first.events); expect(repeated.permissions).toEqual(first.permissions);
  });
  it('temporary isolation is reversible and revocation remains irreversible', () => {
    const s = play(['ISOLATE BRIDGE', 'CONFIRM OPERATION', 'VERIFY ISOLATION', 'RESTORE ISOLATION', 'CONFIRM OPERATION'], ready());
    expect(s.operating.bridgeMode).toBe('operational'); expect(s.operating.isolationVerified).toBe(false);
    const revoked = play(['OPEN /CONTROL/VENDOR_REVOCATION.MAN', 'REVOKE VENDOR', 'CONFIRM OPERATION'], s);
    expect(runInput(revoked, 'RESTORE BRIDGE').output.code).toBe('denied');
    expect(runInput(revoked, 'CONTROLLED RELEASE').output.code).toBe('denied');
  });
});
describe('dialogue boundaries, reveals and follow-ups', () => {
  it('does not expose identities through initial questions, search, file links or model guesses', () => {
    const s = newGame();
    for (const i of DIALOGUE) {
      const r = answerDialogue(s, i.id)!;
      expect(r.output.lines.join(' '), i.id).not.toMatch(/MOTHER|Anna Voss|Site 6|AV-06/i);
      expect(r.output.links.every(l => canRead(s, FILES.find(f => f.id === l.fileId)!)), i.id).toBe(true);
      expect(r.state.operating).toEqual(s.operating);
    }
    for (const term of ['MOTHER', 'AV-06', 'Site 6']) expect(runInput(s, `SEARCH ${term}`).output.links).toHaveLength(0);
    const publicAnna = runInput(s, 'SEARCH Anna Voss');
    expect(publicAnna.output.lines.join(' ')).toContain('Head Researcher');
    expect(publicAnna.output.lines.join(' ')).not.toMatch(/AV-06|Site 6|clinical|patient/i);
    expect(publicAnna.state.knowledge).toEqual(s.knowledge);
    expect(runInput(s, 'OPEN /SYSTEM/CONTROLLER_ID.TXT').openFileId).toBeUndefined();
  });
  it('questions and model similarities cannot execute medical or network operations', () => {
    const s = ready();
    for (const input of ['Can I disconnect?', 'Was the bridge restored?', 'Would terminating support kill Anna?', 'Can I save Anna?', 'Is a controlled release safe?', 'What happens if I release her?', 'Confirm?', 'Please explain isolation']) {
      expect(parseOperation(input), input).toBeUndefined();
      const forged = { intent: 'request_stop' as const, needsClarification: false, provider: 'browser-ai' as const };
      expect(runInput(s, input, forged).state.operating, input).toEqual(s.operating);
    }
    const matched = selectMeaning('Could release harm someone else?', {}, [{ intent: 'q_release_outcome', score: .95 }]);
    expect(runInput(s, 'Could release harm someone else?', matched).state.operating).toEqual(s.operating);
  });
  it('answers the same question differently when evidence and live state change', () => {
    expect(runInput(newGame(), 'Is Anna alive?').output.lines.join(' ')).toContain('No current');
    expect(runInput(ready(), 'Is Anna alive?').output.lines.join(' ')).toContain('supported biological');
    const ended = play(GOLDEN_PATHS.SEVERANCE_COSTLY_COMPASSION);
    expect(runInput(ended, 'Is Anna alive?').output.lines.join(' ')).toContain('has died');
  });
  it('resolves short follow-ups with a subject, and clarifies without one', () => {
    expect(classify('Who is she?').needsClarification).toBe(true);
    expect(selectMeaning('Who is she?', {}, [{ intent: 'q_anna_identity', score: .99 }]).needsClarification).toBe(true);
    const s = runInput(ready(), 'Who is Anna Voss?').state;
    expect(classify('What happened to her?', s).intent).toBe('q_anna_incident');
    expect(resolveFollowup('When?', s)).toBe('q_incident_date');
    expect(resolveFollowup('Who approved it?', s)).toBe('q_trial_authority');
    expect(runInput(s, 'Show me the evidence').output.links.map(l => l.fileId)).toContain('voss');
  });
  it('supports repetition without losing useful facts and derives behavioral modes from state', () => {
    let s = ready(); const initial = runInput(s, 'Does it hurt her?').output.lines.join(' ');
    for (let i = 0; i < 5; i++) s = runInput(s, 'Does it hurt her?').state;
    const repeated = runInput(s, 'Does it hurt her?');
    expect(repeated.output.lines.join(' ')).toContain(initial);
    expect(voiceOf(newGame())).toBe('ADMINISTRATIVE');
    expect(voiceOf({ ...s, operating: { ...s.operating, releaseProcedureStarted: false } }, 'q_lie')).toBe('DEFENSIVE');
    expect(voiceOf(s)).toBe('PRESERVATION-CRITICAL');
  });
  it('gates unusual questions and never treats Anna as a deliberate speaker', () => {
    expect(runInput(newGame(), 'Goodnight').output.lines.join(' ')).toContain('Session closure');
    expect(runInput(ready(), 'Goodnight').output.lines.join(' ')).toContain('not a recognized clinical state');
    expect(runInput(ready(), 'Is she sending these messages?').output.lines.join(' ')).toContain('not her deliberately typing');
  });
  it('has valid reveal conditions, distinct examples, accessible late variants and real references', () => {
    const ids = new Set<string>(); const phrases = new Map<string, string>();
    for (const i of DIALOGUE) {
      expect(ids.has(i.id)).toBe(false); ids.add(i.id);
      if (i.gate) expect(KNOWLEDGE).toContain(i.gate);
      expect(i.examples.length, i.id).toBeGreaterThanOrEqual(6);
      expect(i.early, i.id).not.toEqual(i.revealed);
      for (const id of i.files) expect(FILES.some(f => f.id === id), i.id + ' / ' + id).toBe(true);
      for (const example of i.examples) {
        const key = example.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
        expect(phrases.has(key), example + ' / ' + phrases.get(key)).toBe(false); phrases.set(key, i.id);
        expect(parseOperation(example), example).toBeUndefined();
      }
    }
    expect(DIALOGUE.length).toBeGreaterThanOrEqual(180);
    for (const o of OPERATION_DEFINITIONS) expect(parseOperation(o.label), o.label).toBe(o.id);
  });
});
