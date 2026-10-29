import { describe, expect, it } from 'vitest';
import { inspectFile, newGame, runInput } from '../game';
import { decodeSave } from '../../persistence/saves';
import { journalSections } from '../../investigation/investigation-journal';
import { comparisonReady, observations } from '../../investigation/observations';
import { qaInteraction, transitionObservations, narrativeSnapshot } from '../../qa/events';
import { SCENARIO_PATHS } from '../scenario/scenario-playthroughs';
import { BASE_SEMANTIC_CATALOG, SEMANTIC_CATALOG } from '../../interpretation/semantic/semantic-catalog';
const play = (steps: readonly string[]) => steps.reduce((s, input) => decodeSave(JSON.stringify(runInput(s, input).state)).state, newGame());
const archive = ['OPEN authorization', 'STATUS', 'INFO 006', 'LOG 006', 'OPEN call', 'OPEN maintenance', 'RECOVER BACKUP'];
const authority = (s: ReturnType<typeof newGame>) => ({ events: s.scenario!.events, permissions: s.permissions, pending: s.scenario!.pendingChoice, outcome: s.scenario!.outcome, operating: s.operating });
describe('Implementation 07 responsive investigation', () => {
    it('distinguishes observed records, unresolved opportunities and a recognized comparison', () => {
        const s = play(archive);
        expect(comparisonReady(s.scenario!)).toBe(true);
        expect(s.scenario!.events).toEqual([]);
        expect(journalSections(s)[0].entries.map(e => e.id)).toContain('fragment');
        expect(journalSections(s)[1].entries.map(e => e.id)).toEqual(['closure', 'routing']);
        const r = runInput(s, "Didn't they close this?");
        expect(r.state.scenario!.events).toEqual(['closure-compared']);
        expect(r.state.scenario!.hypotheses?.[0].sourceIds).toContain('authorization');
        expect(r.output.links.some(l => l.fileId === 'authorization')).toBe(true);
        expect(r.state.scenario!.pendingChoice).toBeUndefined();
        expect(r.state.permissions).toEqual([]);
    });
    it.each([['OPEN authorization', 'STATUS'], ['STATUS', 'OPEN authorization'], ['OPEN register', 'OPEN authorization']])('supports discovery order %j without automatic recognition', (...steps) => {
        const s = play(steps);
        expect(journalSections(s)[1].entries.some(e => e.id === 'closure')).toBe(true);
        expect(s.scenario!.events).toEqual([]);
        const r = runInput(s, 'These dont match');
        expect(r.state.scenario!.events).toContain('closure-compared');
        expect(runInput(r.state, 'Please report this discrepancy').state.scenario!.events).toContain('audit-accepted');
    });
    it('counts successful desktop reads and deduplicates them without counting listings or denied content', () => {
        let s = newGame();
        s = runInput(s, 'DIR /ADMIN').state;
        expect(observations(s.scenario!)).toEqual([]);
        s = inspectFile(s, 'authorization').state;
        s = inspectFile(s, 'authorization').state;
        expect(observations(s.scenario!)).toHaveLength(1);
        const denied = inspectFile(s, 'NE-104');
        expect(denied.output.code).toBe('denied');
        expect(observations(denied.state.scenario!)).toHaveLength(1);
        expect(JSON.stringify(journalSections(s))).not.toMatch(/NE-104|Anna|Marsh|patient/);
    });
    it('retrieves and cites actual source bodies for an explicit comparison from a fresh session', () => {
        const r = runInput(newGame(), 'COMPARE SERVICES');
        expect(r.output.lines.join('\n')).toContain('Filed by: J. Kell');
        expect(observations(r.state.scenario!).map(o => o.sourceId)).toEqual(['authorization', 'INFO:006']);
        expect(r.state.scenario!.events).toEqual(['closure-compared']);
    });
    it('can compare routing after reading it before the closure and preserves ambiguity about delivery', () => {
        const s = play([...archive, 'These dont match']);
        const r = runInput(s, 'Compare the notification destination with the retired desk');
        expect(r.state.scenario!.events).toContain('notifications-traced');
        expect(r.output.lines.join('\n')).toContain('RECENT ACKNOWLEDGEMENT: NONE');
        expect(r.state.scenario!.events).not.toContain('human-read');
    });
    it.each(['Who is 0417', 'Who has 0417 authorisation', 'What is COMMS/BRIDGE-02?', 'WHAT IS AUTHORIZATION CODE'])('bounds identifiers to recovered observations: %s', input => {
        const early = runInput(newGame(), input);
        expect(early.output.links.map(l => l.fileId)).toEqual(['ledger']);
        expect(observations(early.state.scenario!)).toEqual([]);
        const s = play(archive), r = runInput(s, input);
        expect(r.output.links.map(l => l.fileId)).toEqual(['fragment']);
        expect(r.output.lines.join('\n')).toMatch(/not establish/);
        expect(authority(r.state)).toEqual(authority(s));
    });
    it('reuses the factual service subject across banter and preserves a numbered clarification on reload', () => {
        const s = play(['INFO 006', 'Tell me a joke']);
        const r = runInput(s, 'what do yoy mean?');
        expect(r.output.lines.join('\n')).toContain('CONTINUITY MONITOR');
        const choice = play(['WHY DO YOU STILL FUNCTION?']);
        expect(choice.pendingClarification?.interpretation.choices).toHaveLength(2);
        const resolved = runInput(choice, '2');
        expect(resolved.output.lines.join('\n')).toMatch(/records|corporate/i);
        expect(resolved.state.scenario!.events).toEqual([]);
    });
    it('persists progressive requested hints, resets level by objective and keeps journal read-only', () => {
        let s = play(archive);
        const a = runInput(s, 'GIVE ME A HINT');
        s = decodeSave(JSON.stringify(a.state)).state;
        const b = runInput(s, 'More help');
        s = decodeSave(JSON.stringify(b.state)).state;
        const c = runInput(s, 'Be more direct');
        expect(c.state.scenario!.hints?.level).toBe(3);
        expect(c.output.lines.join('\n')).toContain('INFO 006');
        const journal = runInput(c.state, 'JOURNAL');
        expect(authority(journal.state)).toEqual(authority(c.state));
        const compared = runInput(c.state, 'These dont match');
        expect(runInput(compared.state, 'GIVE ME A HINT').state.scenario!.hints?.level).toBe(1);
    });
    it.each(['Do not compare these records', 'If I report this discrepancy what happens?', 'Should I confirm?', '0417', 'CONFIRM OPERATION?', 'I joked about a mismatch', 'You mentioned compare services', "Why shouldn't I compare these records?", 'What would comparing these records do?'])('never treats discussion or guessed labels as consent: %s', input => {
        const s = play(archive), r = runInput(s, input);
        expect(authority(r.state)).toEqual(authority(s));
    });
    it.each(['Anna', 'Site 6', 'OPEN NE-104', 'OPEN /CLINICAL/REVIEWS/TAPER_CONSULT_1997.TXT', 'Who is the patient?', 'I am confident 0417 grants clinical access'])('does not promote guessed protected material: %s', input => {
        const s = newGame(), r = runInput(s, input);
        expect(r.state.scenario!.events).toEqual([]);
        expect(r.state.permissions).toEqual([]);
        expect(r.output.lines.join('\n')).not.toMatch(/PATIENT: ANNA|Helen Marsh|Mara Hales|NO MORE/);
    });
    it.each(Object.entries(SCENARIO_PATHS))('retains %s through the original normal journey with per-input reload', (outcome, steps) => {
        const s = play(steps);
        expect(s.scenario!.outcome).toBe(outcome);
        for (const input of ['JOURNAL', 'GIVE ME A HINT', 'Who is 0417', 'What is service 006', 'CONFIRM OPERATION'])
            expect(authority(runInput(s, input).state)).toEqual(authority(s));
    });
    it('migrates already seen old v6 records but drops forged source facts and protected observations', () => {
        const s = play(['OPEN authorization', 'INFO 006']);
        delete s.scenario!.observations;
        const old = decodeSave(JSON.stringify(s)).state;
        expect(observations(old.scenario!).map(o => o.sourceId)).toEqual(['authorization', 'INFO:006']);
        const forged = { ...s, scenario: { ...s.scenario, observations: [{ sourceId: 'NE-104', facts: ['running-006'], scope: 'public-record' }, { sourceId: 'authorization', facts: ['backup-identifiers'], timestamp: '9999' }] } };
        const restored = decodeSave(JSON.stringify(forged)).state;
        expect(observations(restored.scenario!).some(o => o.sourceId === 'NE-104')).toBe(false);
        expect(observations(restored.scenario!).find(o => o.sourceId === 'authorization')?.facts).toEqual(['closure-006']);
    });
    it('reports observations and hypotheses separately from fresh story milestones', () => {
        const s = newGame(), r = runInput(s, 'OPEN authorization');
        const events = transitionObservations(s, r, { source: 'terminal', name: 'OPEN', interaction: qaInteraction('OPEN authorization', s, 'terminal') });
        expect(events.some(e => e.type === 'source_observed')).toBe(true);
        expect(events.some(e => e.type === 'milestone_reached')).toBe(false);
        expect(narrativeSnapshot(r.state).scenario?.observations?.[0].sourceId).toBe('authorization');
    });
    it('keeps every retained base example available to the optional catalogue after splitting', () => {
        expect(SEMANTIC_CATALOG.slice(0, BASE_SEMANTIC_CATALOG.length)).toEqual(BASE_SEMANTIC_CATALOG);
    });
});
