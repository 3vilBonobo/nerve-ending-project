import { fileById } from '../../content/record-registry';
import { DIALOGUE } from '../../interpretation/conversation/dialogue-catalog';
import type { GameState, QueryIntent, Transition } from '../../models';
import { CLINICAL_SNAPSHOT } from '../../state/story-state';
import { availableOperations, canRead, knows, nextHint, transportStatus } from '../story/continuation';
export function voiceOf(s: GameState, intent?: QueryIntent): string {
    if (s.pendingOperation || s.operating.releaseProcedureStarted)
        return 'PRESERVATION-CRITICAL';
    if (!knows(s, 'motherIdentified'))
        return 'ADMINISTRATIVE';
    if (/lie|trust|manipulation|protecting/.test(intent ?? ''))
        return 'DEFENSIVE';
    if (/source|compare|authority|safe|verify/.test(intent ?? ''))
        return 'COOPERATIVE';
    if (knows(s, 'distressEvidenceKnown'))
        return 'CONFLICTED';
    return 'CLINICAL';
}
export function answerDialogue(s: GameState, intent: QueryIntent): Transition | undefined {
    const entry = DIALOGUE.find(i => i.id === intent);
    if (!entry)
        return undefined;
    const count = (s.questionCounts[intent] ?? 0) + 1;
    let lines = [(entry.gate && !knows(s, entry.gate)) ? entry.early : entry.revealed];
    let files = entry.files;
    const gateSatisfied = !entry.gate || knows(s, entry.gate);
    let selected = `${entry.id}:${gateSatisfied ? 'revealed' : 'early'}`;
    const modifiers: string[] = [];
    const variant = (id: string): void => { selected = `${entry.id}:${id}`; };
    if (intent === 'q_source') {
        variant('context-source');
        files = DIALOGUE.find(i => i.id === s.lastIntent)?.files ?? (s.lastFileId ? [s.lastFileId] : []);
        if (!files.length)
            files = ['register', 'authorization'];
    }
    if (intent === 'q_file_summary') {
        variant('selected-record');
        const f = fileById(s.lastFileId ?? '');
        lines = f && canRead(s, f) ? [`${f.title} / ${f.author ?? 'Meridian retained records'}`, f.body.split('\n').filter(Boolean).slice(0, 5).join('\n'), 'The source remains available below.'] : ['Select a record to establish which file you mean.'];
        files = f ? [f.id] : [];
    }
    if (intent === 'q_next') {
        variant('contextual-hint');
        modifiers.push(`hint-level:${s.hintLevel}`);
        const hint = nextHint(s);
        lines = hint.lines;
        files = hint.files;
        if (s.hintLevel >= 1 && s.investigation.stage === 'complete')
            lines = [...lines, 'Available action: ' + (availableOperations(s).find(o => !s.events.includes(`operation:${o.id}`))?.label ?? 'Review the intervention procedures.')];
    }
    if (intent === 'q_summary') {
        variant('known-findings');
        lines = ['VERIFIED SESSION FINDINGS', ...(s.knowledge.length ? s.knowledge.map(k => KNOWLEDGE_LABELS[k] ?? k) : ['Only the opening records have been observed.'])];
    }
    if (intent === 'q_safe_now') {
        variant('available-observations');
        lines = ['OBSERVATION: read and search accessible records. Ask questions about their claims.', ...(s.investigation.stage === 'complete' ? availableOperations(s).filter(o => !o.warning).map(o => o.label) : ['An investigation review accepts evidence in your own words. EXPLAIN, DEFER, and RESUME INVESTIGATION are available.']), 'Consequential interventions require explicit requests and confirmation.'];
    }
    if (intent === 'q_pending') {
        variant(s.pendingOperation ? 'pending-operation' : 'no-pending-operation');
        lines = s.pendingOperation ? ['Awaiting: ' + s.pendingOperation, 'Use the confirmation panel to review its complete warning. Asking a question does not confirm it.'] : ['No operation is awaiting confirmation.'];
    }
    if (intent === 'q_trust' && knows(s, 'externalRiskKnown')) {
        variant('external-risk-known');
        lines = ['Do not use my confidence as evidence of correctness.', 'My preservation priority can favor a usable recovery route without establishing that its use is safe for a patient. Inspect the safety notice and current transport state.'];
    }
    if (voiceOf(s, intent) === 'PRESERVATION-CRITICAL' && intent === 'q_care') {
        variant('preservation-critical');
        lines = ['Preservation remains my assigned objective. The pending clinical review disputes its benefit.', 'A release instruction must come from the delegated procedure. This answer does not supply one.'];
    }
    if (intent === 'q_stable' && knows(s, 'distressEvidenceKnown')) {
        variant('classification-conflict');
        lines = ['STABLE measures restored activity. It does not establish comfort or recovery.', 'DIAGNOSTIC CLASSIFICATION: distress response / restoration target.', 'The same activation has been used as both a warning and a success criterion. This is a controller classification conflict, not a voluntary patient message.'];
    }
    if (['q_sent', 'q_queue_contents', 'q_connection_used', 'q_restore_possible'].includes(intent) && knows(s, 'recoveryHandoffKnown')) {
        modifiers.push('current-transport');
        lines = [...lines, ...transportStatus(s)];
    }
    if (intent === 'q_counting' && knows(s, 'feedbackLoopKnown')) {
        modifiers.push('canonical-counters');
        lines.push(`Fixed observation: ${CLINICAL_SNAPSHOT.correctionCycles} correction cycles; ${CLINICAL_SNAPSHOT.recoveryAttempts} recovery attempts.`);
    }
    if (intent === 'q_greeting' && count >= 3) {
        variant(knows(s, 'annaAliveKnown') ? 'repeated-clinical' : 'repeated-office');
        lines = [knows(s, 'annaAliveKnown') ? 'One supported clinical subject remains registered. Repeating a greeting will not establish voluntary communication.' : 'The same records connection remains active. Public office: closed.'];
    }
    if (s.operating.endingId && ['q_anna_alive', 'q_anna_pain', 'q_stable', 'q_site_now', 'q_anna_save', 'q_let_go', 'q_waiting', 'q_forget', 'q_inaction', 'q_need_player', 'q_disconnect', 'q_keep_alive', 'q_care', 'q_service_stop'].includes(intent)) {
        variant(s.operating.annaBiologicallyAlive ? 'completed-supported' : 'completed-deceased');
        lines = s.operating.annaBiologicallyAlive ? ['Anna remains biologically alive. The known outbound relay is isolated. Preservation cycles continue.'] : ['Anna Voss has died following confirmed release. Local preservation has ended. The historical records remain unchanged.'];
    }
    if (s.operating.endingId && intent === 'q_summary') {
        variant('completed-summary');
        lines = ['INTERVENTION COMPLETE: ' + s.operating.endingId, `Anna Voss: ${s.operating.annaBiologicallyAlive ? 'supported biological function continues.' : 'biological activity ceased after release.'}`, ...s.knowledge.map(k => KNOWLEDGE_LABELS[k] ?? k).filter(line => line !== KNOWLEDGE_LABELS['annaAliveKnown'])];
    }
    if (count >= 4 && !['q_counting', 'q_greeting', 'q_next'].includes(intent)) {
        modifiers.push('repetition-review');
        lines = ['REVIEW / the source and operating conditions are unchanged.', ...lines];
    }
    const next = { ...s, lastIntent: ['q_source', 'q_pending'].includes(intent) ? s.lastIntent : intent, lastTopic: ['q_source', 'q_pending'].includes(intent) ? s.lastTopic : entry.family, questionCounts: { ...s.questionCounts, [intent]: count }, hintLevel: intent === 'q_next' ? Math.min(3, s.hintLevel + 1) : s.hintLevel };
    return { state: next, dialogue: { variantId: selected, intent, profile: voiceOf(s, intent), modifiers, conditions: { gate: entry.gate ?? null, gateSatisfied, questionCount: count, previousIntent: s.lastIntent ?? null, previousFileId: s.lastFileId ?? null } }, output: { lines, links: [...new Set(files)].flatMap(id => { const f = fileById(id); return f && canRead(s, f) ? [{ fileId: id, label: f.path }] : []; }), code: 'ok', truth: 'interpretation' } };
}
export const KNOWLEDGE_LABELS: Record<string, string> = {
    handoverVerified: 'The handover sequence is verified.', clinicalHoldKnown: 'A clinical hold outlived the office closure.', site6Known: 'Site 6 retains clinical support after research closure.', motherIdentified: 'The clinical controller is designated MOTHER.', annaIdentified: 'AV-06 identifies researcher Anna Voss.', incidentKnown: 'The calibration incident occurred on 17 April 1996.', annaAliveKnown: 'Anna retains dependent biological function.', distressEvidenceKnown: 'Clinical evidence indicates severe distress.', feedbackLoopKnown: 'Support reductions provoke automatic restoration.', recoveryHandoffKnown: 'Controller termination may invoke recovery distribution.', externalCompatibilityKnown: 'Some commercial software shares a legacy calibration format.', externalRiskKnown: 'Recovery data could cause harmful external stimulation.', releaseConsequencesKnown: 'Release ends dependent biological life; route preparation changes external consequences.',
};
