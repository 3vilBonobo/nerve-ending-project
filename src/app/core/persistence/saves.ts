import { FILES, DIRECTORIES } from '../content/record-registry';
import { EVIDENCE, EvidenceId, GameState, INTENTS, TerminalEntry } from '../models';
import { deriveKnowledge, newGame, newLegacyGame } from '../engine/game';
import { decodeScenario, hasCaseEvent, caseOperating } from '../state/scenario-state';
import { canRead, OPERATION_DEFINITIONS } from '../engine/story/continuation';
import { ENDINGS, KNOWLEDGE, OPERATIONS, PERMISSIONS, initialStory } from '../state/story-state';
import { DIALOGUE_IDS } from '../interpretation/conversation/dialogue-catalog';
import { initialInvestigation } from '../engine/opening/investigation';
import { validateInterpretation } from '../interpretation/providers';
import { FRESH_INTENTS, LEGACY_FRESH_BRIDGE } from '../interpretation/conversation/fresh-topics';
import { MOTHER_INTENTS, motherTopic } from '../interpretation/conversation/mother-routing';
import { disclosureAllowed, restoreConversation } from '../engine/conversation/mother-conversation';
import { restoreObservations, observations } from '../investigation/observations';
export const SAVE_KEY = 'nerve-ending.save.v5';
export const SCENARIO_SAVE_KEY = 'nerve-ending.save.v6';
export const PREVIOUS_SAVE_KEY = 'nerve-ending.save.v4';
export const OPENING_SAVE_KEY = 'nerve-ending.save.v3';
export const LEGACY_SAVE_KEY = 'nerve-ending.save';
export interface SaveStore {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}
export interface LoadResult {
    state: GameState;
    warning?: string;
}
const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
function display(value: unknown): GameState['ui'] {
    const ui = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    return {
        crtEnabled: typeof ui['crtEnabled'] === 'boolean' ? ui['crtEnabled'] : true,
        fontScale: typeof ui['fontScale'] === 'number' && Number.isFinite(ui['fontScale']) ? Math.min(1.25, Math.max(0.9, ui['fontScale'])) : 1,
        terminalMode: ['maximized', 'restored', 'minimized'].includes(String(ui['terminalMode'])) ? ui['terminalMode'] as GameState['ui']['terminalMode'] : 'maximized',
    };
}
export function decodeSave(raw: string | null): LoadResult {
    if (!raw)
        return { state: newGame() };
    try {
        const data = JSON.parse(raw);
        if (data?.schemaVersion !== 6) {
            const legacy = decodeLegacySave(raw);
            if (legacy.state.schemaVersion === 5)
                legacy.warning = 'Legacy prototype session preserved. NEW SESSION starts the v1.0 story; old permissions do not authorize the revised clinical review.';
            return legacy;
        }
        if (typeof data.sessionId !== 'string' || !Array.isArray(data.discoveredEvidenceIds))
            throw new Error('Invalid save');
        const legacy = decodeLegacySave(JSON.stringify({ ...data, schemaVersion: 5 })).state;
        const scenario = decodeScenario(data.scenario);
        const state: GameState = { ...legacy, ...initialStory(), schemaVersion: 6, scenario, investigation: initialInvestigation(), act01Complete: hasCaseEvent(scenario, 'closure-compared'), pendingClarification: undefined };
        state.operating = caseOperating(scenario, state.operating);
        state.conversation = restoreConversation(state, data.conversation);
        if (data.serviceClarification === 'INFO' || data.serviceClarification === 'LOG')
            state.serviceClarification = data.serviceClarification;
        const pending = data.pendingClarification;
        const query = validateInterpretation(pending?.interpretation, pending?.interpretation?.provider === 'browser-ai' ? 'browser-ai' : 'fallback');
        if (typeof pending?.input === 'string' && query?.needsClarification && query.choices?.length && query.choices.every(c => FRESH_INTENTS.has(c.intent) || c.intent in LEGACY_FRESH_BRIDGE || !!motherTopic(c.intent) && disclosureAllowed(state, motherTopic(c.intent)!.gate)))
            state.pendingClarification = { input: pending.input.slice(0, 1000), interpretation: query };
        const allowed = FILES.filter(f => canRead(state, f)).map(f => f.id);
        state.viewedFileIds = strings(data.viewedFileIds).filter(id => allowed.includes(id));
        restoreObservations(scenario, data.scenario?.observations, state.viewedFileIds, allowed);
        if (scenario.liveService006Observed && !observations(scenario).some(o => o.scope === 'service-snapshot'))
            restoreObservations(scenario, [...observations(scenario), { sourceId: 'INFO:006' }], state.viewedFileIds, allowed);
        scenario.hypotheses = [];
        for (const [id, event] of [['closure', 'closure-compared'], ['routing', 'notifications-traced']] as const)
            if (hasCaseEvent(scenario, event))
                scenario.hypotheses.push({ id, sourceIds: observations(scenario).filter(o => id === 'closure' ? o.facts.some(f => f === 'closure-006' || f === 'running-006') : o.facts.some(f => ['destination-214', 'retired-desk', 'unacknowledged'].includes(f))).map(o => o.sourceId) });
        const hints = data.scenario?.hints;
        if (hints && typeof hints.objective === 'string' && ['closure', 'routing', 'referral', 'human-review', 'dependency', 'welfare', 'controls', 'interpretation', 'signatures', 'witness', 'completed'].includes(hints.objective) && Number.isFinite(hints.level))
            scenario.hints = { objective: hints.objective, level: Math.max(0, Math.min(3, Math.floor(hints.level))) };
        state.openFileIds = strings(data.openFileIds).filter(id => allowed.includes(id)).slice(-5);
        state.lastFileId = allowed.includes(data.lastFileId) ? data.lastFileId : undefined;
        state.lastIntent = typeof data.lastIntent === 'string' && (/^q_case_[a-z_]+$/.test(data.lastIntent) || FRESH_INTENTS.has(data.lastIntent) || MOTHER_INTENTS.has(data.lastIntent)) ? data.lastIntent : legacy.lastIntent;
        if (Array.isArray(data.terminalHistory))
            state.terminalHistory = data.terminalHistory.slice(-80).flatMap((e: TerminalEntry) => e && typeof e.input === 'string' && Array.isArray(e.lines) ? [{ input: e.input.slice(0, 1000), lines: strings(e.lines).slice(0, 120).map(l => l.slice(0, 16000)), links: Array.isArray(e.links) ? e.links.filter(l => allowed.includes(l?.fileId)).map(l => ({ fileId: l.fileId, label: FILES.find(f => f.id === l.fileId)!.path })) : [], code: ['ok', 'notice', 'denied', 'error'].includes(e.code) ? e.code : 'ok', truth: ['record', 'interpretation', 'withheld', 'system'].includes(e.truth) ? e.truth : 'system' }] : []);
        return { state };
    }
    catch {
        return { state: newGame(), warning: 'The saved session could not be read. A new session is available.' };
    }
}
function decodeLegacySave(raw: string | null): LoadResult {
    if (!raw)
        return { state: newGame() };
    try {
        const data = JSON.parse(raw) as Record<string, unknown>;
        if (!data || ![1, 2, 3, 4, 5].includes(Number(data['schemaVersion'])))
            throw new Error('Unsupported save version');
        if (typeof data['sessionId'] !== 'string' || !Array.isArray(data['discoveredEvidenceIds']))
            throw new Error('Invalid save');
        const base = Number(data['schemaVersion']) < 3 ? newGame() : newLegacyGame();
        if (Number(data['schemaVersion']) < 3)
            return {
                state: { ...base, ui: { ...display(data['ui']), terminalMode: 'maximized' } },
                warning: 'A new opening is ready. Your earlier session is still saved separately.',
            };
        const recovered = data['archive006Recovered'] === true;
        let story = initialStory();
        if (Number(data['schemaVersion']) >= 4) {
            story.knowledge = strings(data['knowledge']).filter((k): k is typeof KNOWLEDGE[number] => KNOWLEDGE.includes(k as typeof KNOWLEDGE[number]));
            story.permissions = strings(data['permissions']).filter((p): p is typeof PERMISSIONS[number] => PERMISSIONS.includes(p as typeof PERMISSIONS[number]));
            story.events = [...new Set(strings(data['events']).filter(e => OPERATIONS.some(id => e === `operation:${id}`)))];
            const o = data['operating'];
            if (o && typeof o === 'object') {
                const raw = o as Record<string, unknown>;
                for (const field of Object.keys(story.operating)) {
                    if (typeof story.operating[field as keyof typeof story.operating] === 'boolean' && typeof raw[field] === 'boolean')
                        Object.assign(story.operating, { [field]: raw[field] });
                }
                if (['archive', 'diagnostic', 'operational', 'isolated'].includes(String(raw['bridgeMode'])))
                    story.operating.bridgeMode = raw['bridgeMode'] as typeof story.operating.bridgeMode;
                if (ENDINGS.includes(raw['endingId'] as typeof ENDINGS[number]))
                    story.operating.endingId = raw['endingId'] as typeof ENDINGS[number];
                if (story.operating.vendorCredentialsRevoked)
                    story.operating.vendorRouteEnabled = false;
                if (story.operating.siteRelayIsolated)
                    story.operating.bridgeMode = 'isolated';
                if (!story.operating.siteRelayIsolated)
                    story.operating.isolationVerified = false;
                if (story.operating.outboundPackageTransmitted)
                    story.operating.outboundPackageQueued = false;
                if (story.operating.endingId === 'CONTAINMENT_CONTINUATION')
                    Object.assign(story.operating, { clinicalSupportActive: true, annaBiologicallyAlive: true, service006Running: true, siteRelayIsolated: true, bridgeMode: 'isolated', isolationVerified: true, outboundPackageTransmitted: false });
                else if (story.operating.endingId)
                    Object.assign(story.operating, { clinicalSupportActive: false, annaBiologicallyAlive: false, service006Running: false });
                else
                    Object.assign(story.operating, { clinicalSupportActive: true, annaBiologicallyAlive: true, service006Running: true });
                if (story.operating.endingId === 'SEVERANCE_COSTLY_COMPASSION')
                    Object.assign(story.operating, { vendorCredentialsRevoked: true, vendorRouteEnabled: false, siteRelayIsolated: true, bridgeMode: 'isolated', isolationVerified: true, outboundPackageTransmitted: false, outboundPackageQueued: false });
            }
            if (OPERATIONS.includes(data['pendingOperation'] as typeof OPERATIONS[number]) && !story.operating.endingId)
                story.pendingOperation = data['pendingOperation'] as typeof OPERATIONS[number];
            const counts = data['questionCounts'];
            if (counts && typeof counts === 'object')
                for (const [id, count] of Object.entries(counts))
                    if (DIALOGUE_IDS.has(id) && typeof count === 'number' && Number.isFinite(count))
                        story.questionCounts[id] = Math.max(0, Math.min(1000, Math.floor(count)));
            story.hintLevel = typeof data['hintLevel'] === 'number' && Number.isFinite(data['hintLevel']) ? Math.min(3, Math.max(0, data['hintLevel'])) : 0;
        }
        let investigation = initialInvestigation();
        const legacyAdvanced = Number(data['schemaVersion']) < 5 && (story.permissions.includes('archiveAuditAccess') || story.knowledge.includes('site6Known') || !!story.operating.endingId);
        if (legacyAdvanced)
            investigation = { ...investigation, stage: 'complete', status: 'complete', originEstablished: true, releaseBoundaryEstablished: true, legacy: true };
        else if (data['schemaVersion'] === 5 && data['investigation'] && typeof data['investigation'] === 'object') {
            const saved = data['investigation'] as Record<string, unknown>;
            const attempts = saved['attempts'] as Record<string, unknown> | undefined;
            const count = (key: string): number => typeof attempts?.[key] === 'number' && Number.isFinite(attempts[key]) ? Math.min(1000, Math.max(0, Math.floor(attempts[key] as number))) : 0;
            investigation = { stage: ['closure', 'provenance', 'complete'].includes(String(saved['stage'])) ? saved['stage'] as typeof investigation.stage : 'closure', status: ['dormant', 'active', 'deferred', 'complete'].includes(String(saved['status'])) ? saved['status'] as typeof investigation.status : 'dormant', attempts: { closure: count('closure'), provenance: count('provenance') }, originEstablished: saved['originEstablished'] === true, releaseBoundaryEstablished: saved['releaseBoundaryEstablished'] === true, ...(saved['legacy'] === true ? { legacy: true } : {}) };
            if (investigation.stage === 'complete')
                investigation.status = 'complete';
            else if (investigation.status === 'complete')
                investigation.status = 'dormant';
        }
        if (Number(data['schemaVersion']) < 5 && !legacyAdvanced) {
            // Old backup reads established this automatically; retain observations, not that inference.
            story.knowledge = story.knowledge.filter(k => k !== 'clinicalHoldKnown');
        }
        const allowedIds = FILES.filter(file => canRead({ ...base, ...story, archive006Recovered: recovered }, file)).map(file => file.id);
        const history: TerminalEntry[] = [];
        if (Array.isArray(data['terminalHistory']))
            for (const item of data['terminalHistory'].slice(-80)) {
                if (!item || typeof item !== 'object' || typeof item.input !== 'string' || !Array.isArray(item.lines))
                    continue;
                history.push({
                    input: item.input.slice(0, 1000), lines: strings(item.lines).map(line => line.slice(0, 16000)).slice(0, 50),
                    links: Array.isArray(item.links) ? item.links.filter((link: {
                        fileId?: string;
                    }) => allowedIds.includes(link?.fileId ?? '')).map((link: {
                        fileId: string;
                    }) => ({ fileId: link.fileId, label: FILES.find(file => file.id === link.fileId)!.path })) : [],
                    code: ['ok', 'denied', 'error', 'notice'].includes(item.code) ? item.code : 'ok',
                    truth: ['record', 'interpretation', 'withheld', 'system'].includes(item.truth) ? item.truth : 'system',
                });
            }
        const state = deriveKnowledge({
            ...base, ...story, investigation, sessionId: data['sessionId'].slice(0, 30),
            startedAt: typeof data['startedAt'] === 'string' ? data['startedAt'] : base.startedAt,
            currentDirectory: DIRECTORIES.includes(data['currentDirectory'] as typeof DIRECTORIES[number]) ? data['currentDirectory'] as string : '/',
            discoveredEvidenceIds: [...new Set(strings(data['discoveredEvidenceIds']).filter((id): id is EvidenceId => EVIDENCE.includes(id as EvidenceId) && (recovered || !['EV_RECOVERED_FRAGMENT', 'EV_AUTHORIZATION'].includes(id))))],
            viewedFileIds: strings(data['viewedFileIds']).filter(id => allowedIds.includes(id)),
            openFileIds: strings(data['openFileIds']).filter(id => allowedIds.includes(id)).slice(-5),
            completedActions: recovered ? ['recover-006', 'restore-legacy-references'] : [],
            archive006Recovered: recovered, act01Complete: investigation.stage === 'complete',
            hasStarted: data['hasStarted'] === true,
            lastTopic: typeof data['lastTopic'] === 'string' ? data['lastTopic'].slice(0, 60) : undefined,
            lastFileId: typeof data['lastFileId'] === 'string' && allowedIds.includes(data['lastFileId']) ? data['lastFileId'] : undefined,
            lastIntent: INTENTS.includes(data['lastIntent'] as typeof INTENTS[number]) || DIALOGUE_IDS.has(String(data['lastIntent'])) ? data['lastIntent'] as GameState['lastIntent'] : undefined,
            terminalHistory: history.length ? history : base.terminalHistory,
            ui: display(data['ui']),
        });
        const pending = data['pendingClarification'];
        if (pending && typeof pending === 'object') {
            const p = pending as Record<string, unknown>;
            const rawQuery = p['interpretation'] as Record<string, unknown> | undefined;
            const provider = rawQuery && ['fallback', 'browser-ai', 'ollama'].includes(String(rawQuery['provider'])) ? rawQuery['provider'] as 'fallback' | 'browser-ai' | 'ollama' : 'fallback';
            const query = validateInterpretation(rawQuery, provider);
            if (typeof p['input'] === 'string' && query?.needsClarification)
                state.pendingClarification = { input: p['input'].slice(0, 1000), interpretation: query };
        }
        if (state.pendingOperation && !OPERATION_DEFINITIONS.find(o => o.id === state.pendingOperation)?.available(state))
            state.pendingOperation = undefined;
        return { state, ...(Number(data['schemaVersion']) < 5 ? { warning: legacyAdvanced ? 'Earlier investigation progress preserved. New sessions use the revised opening verification.' : 'Opening observations preserved. The revised handover investigation requires applying evidence through the terminal. Your original save is preserved.' } : {}) };
    }
    catch {
        return { state: newGame(), warning: 'The saved session could not be read. A new session is available.' };
    }
}
export function loadSave(storage: SaveStore): LoadResult {
    try {
        return decodeSave(storage.getItem(SCENARIO_SAVE_KEY) ?? storage.getItem(SAVE_KEY) ?? storage.getItem(PREVIOUS_SAVE_KEY) ?? storage.getItem(OPENING_SAVE_KEY) ?? storage.getItem(LEGACY_SAVE_KEY));
    }
    catch {
        return { state: newGame(), warning: 'Browser storage is restricted. You can play, but progress may not survive closing this page.' };
    }
}
export function writeSave(storage: SaveStore, state: GameState): boolean {
    try {
        storage.setItem(state.scenario ? SCENARIO_SAVE_KEY : SAVE_KEY, JSON.stringify(state));
        return true;
    }
    catch {
        return false;
    }
}
export function resetSave(storage: SaveStore): boolean {
    try {
        storage.removeItem(SCENARIO_SAVE_KEY);
        return true;
    }
    catch {
        return false;
    }
}
