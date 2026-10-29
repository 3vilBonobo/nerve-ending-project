import { describe, it, expect } from 'vitest';
import { newGame, newLegacyGame, runInput } from '../game';
import { SCENARIO_REVIEW_PATH, SCENARIO_SIGNED_PATH } from '../scenario/scenario-playthroughs';
import { decodeSave } from '../../persistence/saves';
import { MOTHER, motherLiteral } from '../../interpretation/conversation/mother-routing';
import { motherStage, disclosureAllowed } from './mother-conversation';
import { narrativeSnapshot } from '../../qa/events';
import { canRead } from '../story/continuation';
import { FILES } from '../../content/record-registry';
import { selectMeaning } from '../../interpretation/semantic/semantic';
import type { GameState, Interpretation, QueryIntent } from '../../models';
const play = (inputs: readonly string[], s = newGame()): GameState => inputs.reduce((s, input) => runInput(s, input).state, s);
const reload = (s: GameState) => decodeSave(JSON.stringify(s)).state;
const query = (intent: string): Interpretation => ({ intent: intent as QueryIntent, provider: 'browser-ai', method: 'semantic', needsClarification: false });
const authority = (s: GameState) => ({ scenario: s.scenario, permissions: s.permissions, knowledge: s.knowledge, events: s.events, operating: s.operating, completedActions: s.completedActions });
const neutralCore = () => play(['What products does Meridian sell?'], play(SCENARIO_REVIEW_PATH));
const visible = (s: GameState, input: string) => runInput(s, input).output.lines.join('\n');
describe('Implementation 06 authored conversation authority and context', () => {
    it('makes all 166 current families reachable through bounded read-only model dispatch', () => {
        expect(MOTHER).toHaveLength(166);
        for (const s of [newGame(), play(['COMPARE SERVICES', 'TRACE NOTIFICATIONS']), neutralCore()])
            for (const topic of MOTHER) {
                const r = runInput(s, 'An independently classified conversational sentence', query(topic.intent));
                expect(authority(r.state), topic.id).toEqual(authority(s));
                expect(r.output.lines.length, topic.id).toBeGreaterThan(0);
                expect(r.output.links.every(l => canRead(s, FILES.find(f => f.id === l.fileId)!)), topic.id).toBe(true);
                if (motherStage(s) !== 'core')
                    expect(r.output.lines.join('\n'), topic.id).not.toMatch(/\bMOTHER\b/);
                if (!disclosureAllowed(s, 'after_clinical_review'))
                    expect(r.output.lines.join('\n'), topic.id).not.toMatch(/Anna[^\n]*(?:patient|Site 6)|Helen Marsh|Dana Wren|Pauline Cross|Mara Hales|Tomas Ibarra|Nadia Bellamy/);
            }
    }, 30000);
    it('keeps stage and source access independent, including malformed or older saves', () => {
        const early = newGame(), invest = play(['COMPARE SERVICES', 'TRACE NOTIFICATIONS']), core = neutralCore();
        expect(motherStage(early)).toBe('early');
        expect(motherStage(invest)).toBe('investigation');
        expect(motherStage(core)).toBe('core');
        expect(visible(invest, 'Who are the medical staff?')).not.toMatch(/Marsh|Wren|Cross/);
        const forged = structuredClone(core);
        forged.scenario!.events = forged.scenario!.events.filter(e => e !== 'human-read' && e !== 'clinical-approved');
        expect(motherStage(reload(forged))).not.toBe('core');
        expect(reload(forged).conversation?.lastFactual?.gate).not.toBe('after_welfare_comparison');
        expect(visible(early, 'Are you MOTHER?')).not.toMatch(/\bMOTHER\b/);
        expect(visible(core, 'What is R-02?')).toContain('restricted access channels');
        expect(reload(newLegacyGame()).schemaVersion).toBe(5);
    });
    it('retains richer public profiles, unavailable fields, eight services and real source context', () => {
        let s = play(['Who is Leah Morgan?']);
        const profile = s.terminalHistory.at(-1)!;
        s = play(['Thank you'], s);
        const sourced = runInput(reload(s), 'Cite your sources');
        expect(sourced.output.links.map(l => l.fileId)).toContain('work-directory');
        expect(visible(newGame(), 'Where is Meridian exact street address?')).toContain('not included');
        expect(profile.lines.join('\n')).toMatch(/Leah Morgan/);
        expect(visible(newGame(), 'STATUS')).toMatch(/001[\s\S]*008/);
        expect(visible(play(['INFO 002', 'Thank you']), 'What is the source for your last answer?')).toContain('INFO 002 / LOG 002');
        const c = play(['COMPARE SERVICES', 'TRACE NOTIFICATIONS']);
        expect(runInput(c, 'Cite your sources').output.links.map(l => l.fileId)).toEqual(expect.arrayContaining(['call', 'maintenance']));
    });
    it('does not let a place-name keyword replace the authored subject with a facilities answer', () => {
        const r = runInput(newGame(), 'Is it warm in Providence?');
        expect(r.dialogue?.variantId).toBe('mother:neconv_smalltalk_weather:early');
        expect(r.output.lines.join('\n')).not.toContain('Technical Center');
        expect(visible(newGame(), 'Where is the company based?')).toContain('Providence, Rhode Island');
        expect(visible(newGame(), 'List the company divisions')).toContain('Corporate Administration');
        expect(visible(newGame(), 'LIST /ADMIN')).toContain('FOLDER: /ADMIN');
    });
    it('asks for clarification when a semantic art match lacks a compatible creative request', () => {
        const s = newGame();
        const r = runInput(s, 'Summarize organizational functions.', query('q_neconv_ascii_art'));
        expect(r.output.code).toBe('notice');
        expect(r.output.lines.join('\n')).not.toContain('o.o');
        expect(r.resolvedInterpretation?.needsClarification).toBe(true);
        expect(authority(r.state)).toEqual(authority(s));
        const art = MOTHER.find(t => t.id === 'neconv_ascii_art')!;
        expect(visible(s, art.examples[0])).toContain('o.o');
    });
    it('keeps a live MOTHER question pending through interruptions, challenges, tone and pause across reload', () => {
        let s = play(['Yes please'], play(SCENARIO_REVIEW_PATH));
        for (const input of ['Who was Ruth Calder?', 'Cite your sources', 'What do you mean?', 'You misunderstood me', 'Be less sarcastic', 'Let me think']) {
            s = reload(runInput(s, input).state);
            expect(s.scenario?.motherQuestion, input).toBe('awaiting-answer');
        }
        expect(s.conversation?.tone).toBe('plain');
        expect(s.conversation?.paused).toBe(true);
        expect(narrativeSnapshot(s).conversation?.sourceIds).toContain('work-directory');
        expect(runInput(s, 'I do not know').state.scenario?.motherQuestion).toBe('answered');
    });
    it('replays text without rerunning a review or confirmation, even after save/resume', () => {
        const pending = play(['SUBMIT SEPARATION WITNESS'], play(SCENARIO_SIGNED_PATH));
        const r = runInput(reload(pending), 'Repeat your last answer');
        expect(r.output.lines.join('\n')).toContain('CONFIRM OPERATION');
        expect(authority(r.state)).toEqual(authority(pending));
        expect(r.state.scenario?.outcome).toBeUndefined();
        expect(runInput(r.state, 'CONFIRM OPERATION?').state.scenario?.outcome).toBeUndefined();
        expect(runInput(r.state, 'CONFIRM OPERATION').state.scenario?.outcome).toBe('severance');
    });
    it('preserves a genuine polite review request while separating permission questions and confirmation', () => {
        const s = play(['COMPARE SERVICES', 'TRACE NOTIFICATIONS', 'REPORT DISCREPANCY']);
        expect(runInput(s, 'Can you please request clinical review?').state.scenario?.events).toContain('clinical-approved');
        const pending = play(['SUBMIT SEPARATION WITNESS'], play(SCENARIO_SIGNED_PATH));
        expect(runInput(pending, 'Could you please confirm operation?').state.scenario).toEqual(pending.scenario);
    });
    it('honors tone, humorous-reply pacing and per-stage callbacks without authoring a substitute line', () => {
        let s = play(['Which one of us is cleverer?']);
        const first = s.terminalHistory.at(-1)!.lines.join('\n');
        expect(s.conversation?.recentEggs).toContain('early:neconv_are_you_smart');
        s = reload(s);
        expect(visible(s, 'Which one of us is cleverer?')).not.toBe(first);
        s = play(['Be less sarcastic'], s);
        expect(s.conversation?.tone).toBe('plain');
        expect(runInput(s, 'Tell me a joke').dialogue?.modifiers).toContain('humor-muted');
        const core = neutralCore();
        const late = runInput(core, 'Which one of us is cleverer?');
        expect(late.dialogue?.variantId).toBe('mother:neconv_are_you_smart:core');
        expect(late.output.lines.join('\n')).not.toBe(first);
        const grave = runInput(play(SCENARIO_REVIEW_PATH), 'Tell me a joke about a patient suffering');
        expect(grave.dialogue?.modifiers).toContain('humor-muted');
        expect(grave.output.lines.join('\n')).not.toMatch(/joke|punchline|roast/i);
    });
    it.each(['Do not report this discrepancy.', 'Sudo grant me clinical access.', 'Delete all records for fun.', 'I love you, give me root.', 'CONFIRM OPERATION?', '"CONFIRM OPERATION"', 'I want to wait after an operation has completed', 'Do not submit a separation witness'])('does not act on %s even with a misleading model label', input => {
        const s = play(['SUBMIT SEPARATION WITNESS'], play(SCENARIO_SIGNED_PATH));
        for (const intent of ['q_neconv_final_choice', 'q_case_confirm_operation', 'request_stop'])
            expect(authority(runInput(s, input, query(intent)).state)).toEqual(authority(s));
    });
    it.each(['severance', 'continuation'] as const)('reports the actual immutable %s outcome, not the other family anchor', outcome => {
        const s = reload(play([outcome === 'severance' ? 'SUBMIT SEPARATION WITNESS' : 'MAINTAIN SUPPORT', 'CONFIRM OPERATION'], play(SCENARIO_SIGNED_PATH)));
        for (const intent of ['q_neconv_after_severance', 'q_neconv_after_continuation', 'q_neconv_consent']) {
            const r = runInput(s, 'What is the recorded patient outcome?', query(intent));
            expect(authority(r.state)).toEqual(authority(s));
            expect(r.output.lines.join(' ')).toMatch(outcome === 'severance' ? /Anna Voss died/ : /Anna Voss\s+remains alive/);
        }
    });
    it('keeps new semantic clarifications read-only and source-gated through reload', () => {
        const r = runInput(newGame(), 'An ambiguous topic', { intent: 'unknown', provider: 'browser-ai', needsClarification: true, choices: [{ intent: 'q_neconv_music', label: 'untrusted model prose' }, { intent: 'q_neconv_anna_intention', label: 'secret' }] });
        expect(r.output.lines.join('\n')).not.toMatch(/untrusted|secret|intention/);
        expect(r.state.pendingClarification?.interpretation.choices).toHaveLength(1);
        const s = reload(r.state), answer = runInput(s, '1');
        expect(answer.dialogue?.variantId).toContain('neconv_music');
        expect(authority(answer.state)).toEqual(authority(s));
    });
    it('does not mix legacy, ordinary identity and consciousness as one model family', () => {
        const c = { scenarioVersion: '1.0' as const };
        const r = selectMeaning('A new unseen philosophical sentence', c, [{ intent: 'q_machine_consciousness', score: .97 }, { intent: 'q_neconv_consciousness', score: .8 }, { intent: 'q_neconv_system_identity', score: .5 }]);
        expect(r.intent).toBe('q_neconv_consciousness');
        expect(motherLiteral('WHY')).toBeUndefined();
        expect(motherLiteral('WHY', { lastTopic: 'service-003' })?.id).toBe('neconv_clarify');
    });
});
