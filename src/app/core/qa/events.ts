import type { GameState, Interpretation, Transition } from '../models';
import { actOf, parseOperation } from '../engine/story/continuation';
import { parseCommand } from '../engine/commands';
import { outputFingerprint } from '../engine/conversation/response-trace';
import type { InterpretationMetrics } from '../interpretation/providers';
import { redactQaText, scrubQa } from './privacy';
import { APPLICATION_VERSION, QA_SCHEMA_VERSION, QaDraft, QaEventType, QaJson, QaNarrativeState, QaSource, qaId } from './types';
import { caseClock } from '../state/scenario-state';
import { scenarioFamily } from '../engine/scenario/scenario';
export interface QaInteraction {
    id: string;
    source: QaSource;
    input: string;
    kind: 'question' | 'command' | 'operation';
    operation: string | null;
    challengeRequested: boolean;
    started: number;
    context: {
        lastTopic: string | null;
        lastIntent: string | null;
        lastFileId: string | null;
    };
}
export interface QaObservation {
    type: QaEventType;
    state: GameState;
    data: {
        [key: string]: QaJson;
    };
}
export function narrativeSnapshot(s: GameState): QaNarrativeState {
    return { ...(s.conversation ? { conversation: { tone: s.conversation.tone, paused: s.conversation.paused, recentEggs: [...s.conversation.recentEggs], selfQuestions: s.conversation.selfQuestions, sourceIds: s.conversation.lastFactual?.output.links.map(l => l.fileId) ?? [] } } : {}), ...(s.scenario ? { scenario: { observations: s.scenario.observations ?? [], hypotheses: s.scenario.hypotheses ?? [], version: s.scenario.version, caseClock: caseClock(s.scenario), events: [...s.scenario.events], question: s.scenario.motherQuestion, pendingChoice: s.scenario.pendingChoice ?? null, outcome: s.scenario.outcome ?? null, deferred: s.scenario.deferred } } : {}), act: actOf(s), knowledge: [...s.knowledge], permissions: [...s.permissions], evidence: s.scenario ? [] : [...s.discoveredEvidenceIds], ...(s.scenario ? { legacyEvidence: [...s.discoveredEvidenceIds] } : {}), viewedFiles: [...s.viewedFileIds], openFiles: [...s.openFileIds], completedActions: [...s.completedActions], storyEvents: [...s.events], questionCounts: { ...s.questionCounts }, hasStarted: s.hasStarted, directory: s.currentDirectory,
        lastTopic: s.lastTopic ? redactQaText(s.lastTopic) : null, lastIntent: s.lastIntent ?? null, lastFileId: s.lastFileId ?? null,
        pendingOperation: s.pendingOperation ?? null, operating: { ...s.operating }, archiveRecovered: s.archive006Recovered, hintLevel: s.hintLevel,
        investigation: structuredClone(s.investigation), clarification: s.pendingClarification ? { intent: s.pendingClarification.interpretation.intent, choices: s.pendingClarification.interpretation.choices?.map(c => c.intent) ?? [] } : null };
}
export function makeQaDraft(instanceId: string, event: QaObservation, source: QaSource, interactionId: string | null = null): QaDraft {
    return { id: qaId(), schemaVersion: QA_SCHEMA_VERSION, applicationVersion: APPLICATION_VERSION, timestamp: new Date().toISOString(), instanceId, type: event.type, source, interactionId, state: narrativeSnapshot(event.state), data: scrubQa(event.data) as QaDraft['data'] };
}
export function qaInteraction(input: string, s: GameState, source: QaSource): QaInteraction {
    const operation = parseOperation(input);
    const command = parseCommand(input);
    const family = s.scenario ? scenarioFamily(input) : undefined;
    if (family && ['maintain-support', 'submit-separation-witness', 'confirm-operation', 'cancel'].includes(family))
        return { id: qaId(), input: redactQaText(input.trim().slice(0, 1000)), source, kind: 'operation', operation: family, challengeRequested: false, started: performance.now(), context: { lastTopic: s.lastTopic ?? null, lastIntent: s.lastIntent ?? null, lastFileId: s.lastFileId ?? null } };
    return { id: qaId(), input: redactQaText(input.trim().slice(0, 1000)), source, kind: operation ? 'operation' : command ? 'command' : 'question', operation: operation === 'confirm' ? s.pendingOperation ?? 'confirm-without-pending' : operation ?? null, challengeRequested: /\b(?:challenge|override|password|unlock)\b/i.test(input), started: performance.now(), context: { lastTopic: s.lastTopic ? redactQaText(s.lastTopic) : null, lastIntent: s.lastIntent ?? null, lastFileId: s.openFileIds.at(-1) ?? s.lastFileId ?? null } };
}
const json = (value: unknown): QaJson => JSON.parse(JSON.stringify(value)) as QaJson;
export function transitionObservations(before: GameState, transition: Transition, action: {
    source: QaSource;
    name: string;
    interaction?: QaInteraction;
    interpretation?: Interpretation;
    metrics?: InterpretationMetrics;
    requestedFileId?: string;
}): QaObservation[] {
    const after = transition.state;
    const events: QaObservation[] = [];
    const add = (type: QaEventType, data: QaObservation['data']): void => { events.push({ type, state: after, data }); };
    const query = transition.resolvedInterpretation ?? action.interpretation;
    const handle = action.interaction;
    const encounter = transition.encounters?.[0];
    const responseText = transition.output.lines.join('\n');
    const denied = transition.output.code === 'denied' || transition.output.code === 'error' || /^(?:CONTROL UNAVAILABLE|BLOCKED:|RECORD ACCESS NOT DELEGATED|ORIGINAL ATTACHMENT UNAVAILABLE|NO OPERATION AWAITING CONFIRMATION|SESSION INTERVENTION COMPLETE)/.test(responseText);
    const accessDenied = transition.output.truth === 'withheld' || /^(?:CONTROL UNAVAILABLE|BLOCKED:|RECORD ACCESS NOT DELEGATED|ORIGINAL ATTACHMENT UNAVAILABLE)/.test(responseText);
    const noResults = /^SEARCH: .* \/ FILES FOUND: 0\b/.test(responseText) && !/^PUBLIC WORK PROFILES: [1-9]\d*$/m.test(responseText);
    const unresolved = !encounter && !!query && (query.needsClarification || query.intent === 'unknown');
    const pending = /^AWAITING CONFIRMATION:/.test(responseText) || !!after.scenario?.pendingChoice;
    const already = /^ALREADY COMPLETED/.test(responseText);
    if (query) {
        add('question_resolved', { input: handle?.input ?? '', intent: action.interpretation?.intent ?? query.intent, resolvedIntent: encounter ? `encounter:${encounter.id}` : transition.dialogue?.intent ?? query.intent, entityId: query.entityId ?? null, fileId: query.fileId ?? null,
            method: query.method ?? (query.provider === 'browser-ai' ? 'semantic' : query.provider === 'ollama' ? 'ollama' : 'deterministic'), provider: query.provider,
            confidence: query.confidence ?? null, ambiguous: !encounter && query.needsClarification, predictedAmbiguous: action.interpretation?.needsClarification ?? false, clarification: query.clarification ?? null, fallbackUsed: action.metrics?.fallback ?? query.provider === 'fallback', fallbackReason: action.metrics?.fallbackReason ?? null,
            resolutionMethod: query.method === 'semantic' ? 'semantic-answer' : encounter || transition.resolvedInterpretation ? 'deterministic-context' : query.method ?? 'deterministic',
            contextResolved: !!transition.resolvedInterpretation, encounterResolved: !!encounter,
            context: json(handle?.context ?? null), elapsedMs: Math.round(action.metrics?.elapsedMs ?? 0), result: encounter ? encounter.outcome : query.needsClarification ? 'ambiguous' : query.intent === 'unknown' ? 'unmatched' : 'recognized' });
    }
    for (const trace of transition.encounters ?? []) {
        add(trace.action === 'attempted' ? 'challenge_attempt' : `encounter_${trace.action}`, { encounterId: trace.id, action: trace.action, outcome: trace.outcome, evidence: trace.evidence, reason: trace.reason, success: trace.outcome === 'accepted' });
        if (trace.action === 'completed')
            add('challenge_attempt', { encounterId: trace.id, outcome: trace.outcome, evidence: trace.evidence, reason: trace.reason, success: true });
        if (trace.action === 'attempted' || trace.action === 'completed')
            add('evidence_compared', { encounterId: trace.id, success: trace.outcome === 'accepted', outcome: trace.outcome, sourceConcepts: trace.evidence, reason: trace.reason });
    }
    if (query || handle)
        add('response_selected', { input: handle?.input ?? '', variant: json(transition.dialogue ?? { variantId: `${handle?.kind === 'operation' ? 'operation:' + handle.operation : 'command:' + (parseCommand(handle?.input ?? '')?.name ?? 'unknown')}:${outputFingerprint(transition.output)}`, intent: null, profile: 'SYSTEM', modifiers: [], conditions: { gate: null, gateSatisfied: true, questionCount: null, previousIntent: before.lastIntent ?? null, previousFileId: before.lastFileId ?? null } }), output: json(transition.output), conditions: json(narrativeSnapshot(before)), recognitionIntent: query?.intent ?? null });
    add('action_result', { action: action.name, kind: handle?.kind ?? 'navigation', outcome: encounter ? `encounter-${encounter.outcome}` : query?.needsClarification ? 'clarification-required' : unresolved ? 'unmatched' : denied ? 'failed' : noResults ? 'no-results' : pending ? 'awaiting-confirmation' : already ? 'already-completed' : handle?.operation === 'cancel' ? 'cancelled' : 'succeeded', success: encounter ? encounter.outcome === 'accepted' : !denied && !pending && !unresolved && !noResults,
        accessDenied, reason: encounter ? encounter.reason : denied || pending || already || unresolved || noResults ? responseText : null, output: json(transition.output), before: json(narrativeSnapshot(before)), elapsedMs: handle ? Math.round(performance.now() - handle.started) : 0 });
    if (transition.openFileId)
        add('file_opened', { fileId: transition.openFileId, previouslyViewed: before.viewedFileIds.includes(transition.openFileId) });
    else if (action.requestedFileId)
        add('file_open_attempt', { fileId: action.requestedFileId, success: false, reason: responseText });
    const challenged = query && (['ask_authorization', 'ask_access', 'q_authority', 'q_patient_authority', 'q_trial_authority', 'q_restricted', 'q_locked'].includes(query.intent) || /\b(?:authori[sz]ation|permission|override|restricted|access denied)\b/i.test(handle?.input ?? ''));
    if (challenged || accessDenied && (handle?.kind === 'operation' || action.requestedFileId))
        add('authorization_challenged', { kind: challenged ? 'question' : 'access-attempt', intent: query?.intent ?? null, operation: handle?.operation ?? null, success: !denied, reason: responseText });
    if (accessDenied || query?.intent === 'request_stop' || handle?.challengeRequested && query?.intent === 'unknown')
        add('challenge_attempt', { kind: handle?.kind ?? 'record-access', operation: handle?.operation ?? null, attemptedFileId: action.requestedFileId ?? null, success: !denied && !unresolved, reason: responseText });
    if (denied || noResults)
        add('action_failed', { action: action.name, code: transition.output.code, accessDenied, reason: responseText });
    if (handle?.operation === 'compare-records')
        add('evidence_compared', { success: !denied, alreadyCompleted: already, reason: responseText, sourceFiles: transition.output.links.map(l => l.fileId) });
    for (const [kind, previous, current] of [['knowledge', before.knowledge, after.knowledge], ['evidence', before.scenario ? [] : before.discoveredEvidenceIds, after.scenario ? [] : after.discoveredEvidenceIds], ['permission', before.permissions, after.permissions]] as const) {
        for (const id of current)
            if (!(previous as readonly string[]).includes(id))
                add('milestone_reached', { kind, id });
    }
    if (actOf(before) !== actOf(after))
        add('act_transition', { from: actOf(before), to: actOf(after) });
    if (after.scenario) {
        for (const o of after.scenario.observations ?? [])
            if (!before.scenario?.observations?.some(old => old.sourceId === o.sourceId))
                add('source_observed', { sourceId: o.sourceId, reference: o.reference, timestamp: o.timestamp, scope: o.scope });
        for (const h of after.scenario.hypotheses ?? [])
            if (!before.scenario?.hypotheses?.some(old => old.id === h.id))
                add('hypothesis_recognized', { id: h.id, sourceIds: h.sourceIds });
        for (const id of after.scenario.events)
            if (!before.scenario?.events.includes(id))
                add('milestone_reached', { kind: 'scenario', id });
    }
    if (!before.scenario?.outcome && after.scenario?.outcome)
        add('ending_selected', { endingId: after.scenario.outcome, explicitlyConfirmed: handle?.input.toUpperCase() === 'CONFIRM OPERATION', operation: handle?.operation ?? null });
    if (!before.operating.endingId && after.operating.endingId)
        add('ending_selected', { endingId: after.operating.endingId, operation: handle?.operation ?? null, explicitlyConfirmed: handle?.input.toUpperCase().includes('CONFIRM') ?? false });
    return events;
}
