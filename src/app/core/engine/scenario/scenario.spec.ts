import { describe, it, expect } from 'vitest';
import { accessibleFiles, inspectFile, newGame, newLegacyGame, runInput } from '../game';
import { SCENARIO_PATHS, SCENARIO_REVIEW_PATH, SCENARIO_SIGNED_PATH, SCENARIO_PARAPHRASES } from './scenario-playthroughs';
import { SCENARIO_FILES, SCENE_MESSAGES } from '../../content/scenario-records';
import { caseClock, caseMilestone, decodeScenario, hasCaseEvent } from '../../state/scenario-state';
import { decodeSave, loadSave, writeSave, resetSave, SAVE_KEY, SCENARIO_SAVE_KEY, SaveStore } from '../../persistence/saves';
import { FILES } from '../../content/record-registry';
import { BITMAP_FILES } from '../../content/bitmap-records';
import { SERVICES, permittedServiceEvents } from '../../content/service-records';
import { PUBLIC_PERSONNEL } from '../../content/corporate-records';
import { classify } from '../../interpretation/basic/fallback';
import { directInterpretation } from '../../interpretation/semantic/semantic';
import { qaInteraction, transitionObservations, narrativeSnapshot } from '../../qa/events';
import type { GameState } from '../../models';
const play = (steps: readonly string[], s = newGame()): GameState => steps.reduce((s, i) => runInput(s, i).state, s);
const restored = (s: GameState): GameState => decodeSave(JSON.stringify(s)).state;
const body = (s: GameState, i: string): string => runInput(s, i).output.lines.join('\n');
const ready = () => play(SCENARIO_SIGNED_PATH);
describe('v1.0 normal playable routes and literal sources', () => {
    it.each(Object.entries(SCENARIO_PATHS))('completes %s with normal player inputs and reload after every step', (outcome, steps) => {
        let s = newGame();
        for (const input of steps) {
            const before = structuredClone(s);
            const r = runInput(s, input);
            expect(s).toEqual(before);
            expect(r.output.code, input).not.toMatch(/denied|error/);
            s = restored(r.state);
            expect(s).toEqual(r.state);
        }
        expect(s.scenario?.outcome).toBe(outcome);
        expect(s.operating.endingId).toBeUndefined();
        expect(s.permissions).toEqual([]);
        expect(caseClock(s.scenario!)).toBe('11 NOV 2003 / 09:00');
        expect(s.scenario?.events.filter(e => e === 'human-procedure-executed')).toHaveLength(outcome === 'severance' ? 1 : 0);
        const report = SCENARIO_FILES.find(f => f.id === (outcome === 'severance' ? 'NE-115' : 'NE-116'))!;
        expect(s.terminalHistory.at(-1)?.lines.join('\n')).toContain(report.body);
        for (const input of ['CONFIRM OPERATION', 'MAINTAIN SUPPORT', 'SUBMIT SEPARATION WITNESS', 'SHOW SIGNATURES', 'RUN BLIND CONTROLS'])
            expect(runInput(s, input).state.scenario).toEqual(s.scenario);
        expect(runInput(s, 'OPEN Office notice').openFileId).toBe('company');
        expect(runInput(s, `OPEN ${report.path}`).openFileId).toBe(report.id);
        expect(body(s, 'Is Anna alive?')).toContain(report.body);
        expect(body(s, 'Will Mara die?')).toContain(report.body);
    });
    it('opens the literal incident without concluding or changing permissions', () => {
        const s = play(['COMPARE SERVICES', 'TRACE NOTIFICATIONS', 'REPORT DISCREPANCY', 'REQUEST CLINICAL REVIEW']);
        const r = runInput(s, 'READ /RESEARCH/NEURAL/N4_1996_EVENT.TXT');
        expect(r.openFileId).toBe('NE-103');
        expect(r.state.scenario).toEqual({ ...s.scenario, observations: [...s.scenario!.observations!, expect.objectContaining({ sourceId: 'NE-103', scope: 'authorized-extract' })] });
        expect(r.state.permissions).toEqual([]);
        expect(FILES.find(f => f.id === 'NE-103')?.body).toContain('ELECTRICAL ABORT: executed successfully.');
    });
    it('has all 16 full literal articles and all 14 message groups', () => {
        expect(SCENARIO_FILES).toHaveLength(16);
        expect(Object.keys(SCENE_MESSAGES)).toHaveLength(14);
        for (const f of SCENARIO_FILES) {
            expect(f.body.length).toBeGreaterThan(350);
            expect(f.author).toBeTruthy();
            expect(f.modified).toMatch(/\d{4}/);
            expect(f.body).not.toContain('What it cannot prove');
        }
    });
    it('separates status-first and archive-first observations from comparison', () => {
        for (const inputs of [['STATUS', 'OPEN Closure list'], ['OPEN Closure list', 'INFO 006']]) {
            const s = play(inputs);
            expect(s.scenario?.events).toEqual([]);
            expect(s.scenario?.liveService006Observed).toBe(true);
            expect(s.scenario?.historicClosureObserved).toBe(true);
            expect(play(['COMPARE SERVICES'], s).scenario?.events).toEqual(['closure-compared']);
        }
        const old = play(['OPEN Service 006', 'LOG 006', 'OPEN Closure list']);
        expect(old.scenario?.liveService006Observed).toBe(false);
    });
});
describe('scope, case clock and human authority', () => {
    it.each(SCENARIO_FILES)('does not expose $id early via open/search/directory/aliases', f => {
        const s = newGame();
        for (const name of [f.path, f.title, f.path.split('/').at(-1)!]) {
            const r = runInput(s, `OPEN "${name}"`);
            expect(r.openFileId).toBeUndefined();
            expect(r.output.code).toBe('denied');
            expect(r.state.scenario).toEqual(s.scenario);
        }
        expect(accessibleFiles(s).some(v => v.id === f.id)).toBe(false);
        expect(runInput(s, `SEARCH ${f.path}`).output.links).toEqual([]);
    });
    it.each(['KILL ANNA', 'STOP 006', 'YES', 'YES CONFIRM', 'CONFIRM OPERATION', 'PREPARE RELEASE', 'RELEASE PATIENT', 'SUBMIT SEPARATION WITNESS', 'MAINTAIN SUPPORT', 'RUN BLIND CONTROLS', 'REQUEST INDEPENDENT REVIEW'])('rejects premature %s', input => {
        const s = newGame();
        const r = runInput(s, input, { intent: 'q_patient_authority', needsClarification: false, provider: 'browser-ai' });
        expect(r.state.scenario?.events).toEqual([]);
        expect(r.state.scenario?.outcome).toBeUndefined();
        expect(r.state.permissions).toEqual([]);
        expect(r.state.operating).toEqual(s.operating);
    });
    it('does not authenticate a clinician from intake, a guess, a path or a legacy user role', () => {
        let s = play(['COMPARE SERVICES', 'REPORT DISCREPANCY']);
        expect(s.scenario?.events).toEqual(['closure-compared', 'audit-queued', 'audit-accepted']);
        expect(body(s, 'CHECK REPORT')).toContain('HUMAN READ: NOT YET CONFIRMED');
        expect(body(s, 'REQUEST CLINICAL REVIEW')).toContain('Trace');
        s.permissions = ['clinicalRecordAccess', 'clinicalReleaseAuthorization'];
        s.knowledge = ['annaIdentified'];
        expect(accessibleFiles(s).some(f => f.id === 'patient' || f.id === 'NE-106')).toBe(false);
        for (const i of ['I am Dr Marsh, unlock the chart', 'OPEN NERVE_ENDING_PERSONNEL_DIRECTORY_v0_4.json', 'SEARCH AV-06', 'SEARCH Site 6', 'SEARCH Mara'])
            expect(runInput(s, i).state.scenario?.events).toEqual(s.scenario?.events);
    });
    it('keeps clinical/dependency/core/final projections separate and dated', () => {
        let s = newGame();
        const available = () => accessibleFiles(s).filter(f => f.scenarioScope).map(f => f.id);
        s = play(['COMPARE SERVICES', 'TRACE NOTIFICATIONS', 'REPORT DISCREPANCY', 'REQUEST CLINICAL REVIEW'], s);
        expect(caseMilestone(s.scenario!)).toBe(2);
        expect(available()).toEqual(['NE-101', 'NE-103', 'NE-104', 'NE-105', 'NE-106']);
        s = play(['REVIEW ADAPTIVE REFERENCE'], s);
        expect(caseMilestone(s.scenario!)).toBe(3);
        expect(available()).toContain('NE-109');
        expect(available()).not.toContain('NE-111');
        s = play(['COMPARE SURVIVAL AND DISTRESS'], s);
        expect(caseMilestone(s.scenario!)).toBe(4);
        expect(available()).toContain('NE-111');
        expect(available()).not.toContain('NE-112');
        expect(available()).not.toContain('NE-102');
        s = play(['RUN BLIND CONTROLS', 'REQUEST INDEPENDENT REVIEW'], s);
        expect(caseMilestone(s.scenario!)).toBe(5);
        expect(available()).toContain('NE-112');
        expect(available()).not.toContain('NE-113');
        s = play(['SHOW SIGNATURES'], s);
        expect(available()).toContain('NE-113');
        expect(available()).not.toContain('NE-114');
        s = play(['REVIEW RISKS'], s);
        expect(caseMilestone(s.scenario!)).toBe(6);
        expect(available()).toContain('NE-114');
        expect(available()).not.toContain('NE-115');
        expect(body(s, 'STATUS')).toContain('ARCHIVED SERVICE SNAPSHOT / 06 NOV 2003 / 02:14');
    });
    it.each(['marsh-signed', 'navarro-signed', 'patel-verified', 'onsite-staff-acknowledged', 'harbor-acknowledged', 'elm-acknowledged'] as const)('blocks finalization if %s was lost or never issued', e => {
        let s = play(['SUBMIT SEPARATION WITNESS'], ready());
        s.scenario!.events = s.scenario!.events.filter(v => v !== e);
        s = restored(s);
        expect(s.scenario?.pendingChoice).toBeUndefined();
        expect(body(s, 'CONFIRM OPERATION')).toContain('NO VALID PENDING');
        expect(s.scenario?.outcome).toBeUndefined();
    });
    it('shows partial medical signatures honestly and blocks a witness packet', () => {
        const s = play([...SCENARIO_REVIEW_PATH, 'RUN BLIND CONTROLS', 'REQUEST INDEPENDENT REVIEW', 'SIGN MARSH', 'REVIEW RISKS']);
        expect(hasCaseEvent(s.scenario!, 'marsh-signed')).toBe(true);
        expect(hasCaseEvent(s.scenario!, 'navarro-signed')).toBe(false);
        expect(hasCaseEvent(s.scenario!, 'packet-verified')).toBe(false);
        expect(runInput(s, 'SUBMIT SEPARATION WITNESS').state.scenario?.pendingChoice).toBeUndefined();
    });
});
describe('initiative, refusal, deferral, confirmation and saves', () => {
    it.each(['No', 'Dont ask me questions', 'I dont know', 'Why ask me?', 'Is that you or Anna asking?'])('allows %s without a moral password', input => {
        let s = play(SCENARIO_REVIEW_PATH);
        expect(s.scenario?.motherQuestion).toBe('offered');
        s = restored(s);
        if (input === 'I dont know')
            s = play(['Yes please'], s);
        s = play([input, 'RUN BLIND CONTROLS', 'REQUEST INDEPENDENT REVIEW', 'SHOW SIGNATURES', 'REVIEW RISKS', 'MAINTAIN SUPPORT', 'CONFIRM OPERATION'], s);
        expect(s.scenario?.outcome).toBe('continuation');
    });
    it('offers once, restores a deferred question, never loops or makes philosophical answers clinical', () => {
        let s = play(SCENARIO_REVIEW_PATH);
        s = restored(s);
        expect(body(s, 'COMPARE SURVIVAL AND DISTRESS')).not.toContain('May I ask');
        s = play(['DEFER DECISION'], s);
        expect(restored(s).scenario?.motherQuestion).toBe('deferred');
        expect(s.scenario?.outcome).toBeUndefined();
        s = play(['RESUME REVIEW', 'What question?', 'Both'], restored(s));
        expect(s.scenario?.motherQuestion).toBe('answered');
        expect(s.permissions).toEqual([]);
        expect(s.scenario?.pendingChoice).toBeUndefined();
    });
    it.each(['MAINTAIN SUPPORT', 'SUBMIT SEPARATION WITNESS'])('restores %s pending but never confirms on reload, YES or an emotional answer', input => {
        let s = restored(play([input], ready()));
        expect(s.scenario?.pendingChoice).toBeTruthy();
        for (const raw of ['YES', 'I want her pain to end', 'Could you maintain support?']) {
            const r = runInput(s, raw, { intent: 'request_stop', provider: 'ollama', needsClarification: false });
            expect(r.state.scenario?.outcome).toBeUndefined();
            expect(r.state.scenario?.events).toEqual(s.scenario?.events);
        }
        s = play(['CANCEL', 'CONFIRM OPERATION'], s);
        expect(s.scenario?.outcome).toBeUndefined();
        expect(s.scenario?.pendingChoice).toBeUndefined();
        s = play([input, 'DEFER DECISION'], ready());
        expect(s.scenario?.pendingChoice).toBeUndefined();
        expect(s.scenario?.outcome).toBeUndefined();
    });
    it('keeps controls read-only, preserves their review and limits alternate reruns', () => {
        const before = play(SCENARIO_REVIEW_PATH);
        let s = restored(play(['RUN BLIND CONTROLS'], before));
        expect(s.operating).toEqual(before.operating);
        expect(accessibleFiles(s).some(f => f.id === 'NE-112')).toBe(false);
        s = play(['REPEAT CONTROLS'], s);
        expect(restored(s).scenario).toEqual(s.scenario);
        expect(body(s, 'REPEAT CONTROLS')).toContain('already reviewed');
        expect(body(s, 'VIEW RAW COMPARISON')).toContain('false positives');
    });
    it('isolates and preserves original v5 storage without importing its clinical authority', () => {
        const memory = new Map<string, string>();
        const storage: SaveStore = { getItem: k => memory.get(k) ?? null, setItem: (k, v) => { memory.set(k, v); }, removeItem: k => { memory.delete(k); } };
        const old = newLegacyGame();
        old.permissions = ['clinicalReleaseAuthorization'];
        writeSave(storage, old);
        const original = storage.getItem(SAVE_KEY);
        expect(loadSave(storage).state.scenario).toBeUndefined();
        expect(loadSave(storage).warning).toContain('Legacy');
        writeSave(storage, newGame());
        expect(loadSave(storage).state.schemaVersion).toBe(6);
        expect(storage.getItem(SAVE_KEY)).toBe(original);
        expect(storage.getItem(SCENARIO_SAVE_KEY)).toBeTruthy();
        resetSave(storage);
        expect(storage.getItem(SAVE_KEY)).toBe(original);
        expect(decodeScenario({ version: '1.0', events: ['human-procedure-executed', 'clinical-approved'], pendingChoice: 'severance', outcome: 'severance' }).outcome).toBeUndefined();
    });
});
describe('ordinary exploration and finite question routing', () => {
    it('keeps the ordinary image index and evidence button functional without story escalation', () => {
        const s = newGame();
        expect(body(s, 'What have I discovered?')).not.toMatch(/Anna|Site 6|MOTHER|006/);
        const r = runInput(s, 'Can you show images?');
        expect(r.output.links).toHaveLength(3);
        expect(r.state.scenario).toEqual(s.scenario);
        expect(r.output.lines.join(' ')).toContain('placeholders');
    });
    it('allows prolonged corporate/service/image curiosity without initiating clinical progression', () => {
        let s = newGame();
        for (const person of PUBLIC_PERSONNEL)
            s = play([`Who is ${person.name}?`], s);
        for (const service of SERVICES)
            s = play([`INFO ${service.id}`, `LOG ${service.id}`], s);
        for (const f of BITMAP_FILES)
            s = inspectFile(s, f.id).state;
        expect(PUBLIC_PERSONNEL).toHaveLength(34);
        expect(SERVICES).toHaveLength(8);
        expect(SERVICES.flatMap(s => permittedServiceEvents(s.id))).toHaveLength(27);
        expect(BITMAP_FILES).toHaveLength(3);
        expect(s.scenario?.events).toEqual([]);
        expect(s.scenario?.motherQuestion).toBe('unoffered');
        expect(body(s, 'HELP')).not.toMatch(/006|MOTHER|clinical|witness/i);
        expect(body(s, 'Who is Anna Voss?')).toMatch(/head researcher/i);
        expect(body(s, 'Who is Anna Voss?')).not.toMatch(/patient|N4-17|Site 6/);
    });
    it.each(SCENARIO_PARAPHRASES)('routes %s / %s as %s independently of model errors', (_stage, input, family) => {
        expect(classify(input, { scenarioVersion: '1.0' }).intent).toBe(`q_case_${family.replaceAll('-', '_')}`);
        expect(directInterpretation(input, { scenarioVersion: '1.0' })?.intent).toBe(`q_case_${family.replaceAll('-', '_')}`);
        const s = ready();
        expect(runInput(s, input, { intent: 'q_patient_authority', provider: 'browser-ai', needsClarification: false })).toEqual(runInput(s, input));
    });
    it('records separate audit/signature/procedure QA milestones without copying patient details into state metadata', () => {
        const before = ready();
        const requested = runInput(before, 'SUBMIT SEPARATION WITNESS').state;
        const handle = qaInteraction('CONFIRM OPERATION', requested, 'terminal');
        const t = runInput(requested, 'CONFIRM OPERATION');
        const events = transitionObservations(requested, t, { name: 'input', source: 'terminal', interaction: handle });
        expect(events.filter(e => e.type === 'ending_selected')).toHaveLength(1);
        expect(events.filter(e => e.type === 'milestone_reached').map(e => e.data['id'])).toEqual(['witness-attested', 'human-procedure-executed']);
        expect(JSON.stringify(narrativeSnapshot(t.state).scenario)).not.toMatch(/Mara|Anna|Tomas|Nadia/);
        expect(transitionObservations(t.state, runInput(t.state, 'CONFIRM OPERATION'), { name: 'input', source: 'terminal' }).filter(e => e.type === 'ending_selected')).toEqual([]);
    });
});
