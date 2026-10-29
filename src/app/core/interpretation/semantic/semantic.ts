import { recognitionText, directInterpretation, entityOf } from '../deterministic';
export { recognitionText, directInterpretation } from '../deterministic';
import { FILES } from '../../content/record-registry';
import { Interpretation, QueryContext, QueryIntent } from '../../models';
import { classify, isOpeningExample, normalize } from '../basic/fallback';
import { SEMANTIC_CATALOG, SEMANTIC_EXAMPLES } from './semantic-catalog';
import { corporateInterpretation } from '../basic/corporate-questions';
import { serviceInterpretation } from '../basic/service-questions';
import { freshInterpretation, FRESH_INTENTS, LEGACY_FRESH_BRIDGE } from '../conversation/fresh-topics';
import { MOTHER_INTENTS, canonicalMotherIntent } from '../conversation/mother-routing';
export interface RankedIntent {
    intent: QueryIntent;
    score: number;
}
export const MATCH_THRESHOLD = 0.42;
export const MATCH_MARGIN = 0.035;
export function rankIntents(vector: readonly number[], references: readonly (readonly number[])[]): RankedIntent[] {
    if (references.length !== SEMANTIC_EXAMPLES.length || vector.length !== 384 || !vector.every(Number.isFinite))
        throw new Error('Invalid sentence vectors.');
    const scores = new Map<QueryIntent, number[]>();
    references.forEach((reference, index) => {
        if (reference.length !== vector.length)
            throw new Error('Mismatched sentence vectors.');
        const similarity = reference.reduce((sum, value, dimension) => sum + value * vector[dimension], 0);
        const intent = SEMANTIC_EXAMPLES[index].intent;
        scores.set(intent, [...(scores.get(intent) ?? []), similarity]);
    });
    return [...scores].map(([intent, values]) => {
        values.sort((a, b) => b - a);
        return { intent, score: values[0] * 0.8 + values[1] * 0.2 };
    }).sort((a, b) => b.score - a.score);
}
export function selectMeaning(input: string, context: QueryContext, ranked: readonly RankedIntent[]): Interpretation {
    const direct = directInterpretation(input, context);
    if (direct)
        return { ...direct, method: 'deterministic' };
    // The old broad labels retain their references for prototype sessions. In fresh semantic
    // retrieval their authored replacements compete directly; generic parents must not drown
    // out narrower current topics. Existing exact rules and public facts still run first.
    const narrowPublicBridges = new Set(['q_personhood', 'q_functions', 'q_designation', 'q_source', 'q_repeat', 'q_plain', 'q_mistakes', 'q_funding', 'q_trust', 'q_lie']);
    const eligible = context.scenarioVersion === '1.0' ? [...ranked.filter(item => MOTHER_INTENTS.has(item.intent) || FRESH_INTENTS.has(item.intent) || narrowPublicBridges.has(item.intent) || item.intent === 'ask_service_status' || item.intent === 'unknown').reduce((groups, item) => {
            const intent = canonicalMotherIntent(item.intent) ?? item.intent;
            if (!groups.has(intent) || groups.get(intent)!.score < item.score)
                groups.set(intent, { ...item, intent });
            return groups;
        }, new Map<QueryIntent, RankedIntent>()).values()].sort((a, b) => b.score - a.score) : ranked.filter(item => !item.intent.startsWith('q_fresh_') && !MOTHER_INTENTS.has(item.intent));
    const first = eligible[0];
    const second = eligible[1];
    if (!first || !Number.isFinite(first.score) || first.intent === 'unknown' || first.score < .35)
        return { intent: 'unknown', needsClarification: false, provider: 'browser-ai' };
    if (first.score < MATCH_THRESHOLD) {
        const aboutRecords = /\b(record|records|paperwork|reading|file|files|service|call|office|staff|terminal|company|backup|receipt|date|clock|phone|monitor|archive|handover)\b/.test(recognitionText(input));
        return aboutRecords
            ? { intent: 'unknown', needsClarification: true, clarification: `Are you asking about ${SEMANTIC_CATALOG.find(group => group.intent === first.intent)?.label ?? 'a record'}? Please name the record or subject.`, choices: [{ intent: first.intent, label: SEMANTIC_CATALOG.find(group => group.intent === first.intent)?.label ?? 'a record' }], provider: 'browser-ai' }
            : { intent: 'unknown', needsClarification: false, provider: 'browser-ai' };
    }
    if (/\boriginal\b/.test(recognitionText(input)) && /\b(where|stored|located|missing|attachment)\b/.test(recognitionText(input)) && ranked.slice(0, 3).some(item => item.intent === 'ask_transfer' && item.score >= MATCH_THRESHOLD))
        return { intent: 'ask_transfer', needsClarification: false, provider: 'browser-ai' };
    // Some narrow new intents refine retained opening categories. Clarifying equivalent answers adds no value.
    const equivalent = new Set(['ask_transfer', 'ask_archive_location']);
    if (first.intent === 'ask_recovery_process' && /\b(another|spare|copy|copies|backup|duplicate)\b/.test(recognitionText(input)))
        return { intent: first.intent, entityId: entityOf(input) ?? context.lastTopic, needsClarification: false, confidence: first.score, provider: 'browser-ai' };
    if (first.intent === 'ask_transfer' && /\boriginal\b/.test(recognitionText(input)))
        return { intent: first.intent, entityId: entityOf(input) ?? context.lastTopic, needsClarification: false, confidence: first.score, provider: 'browser-ai' };
    const compatible: readonly (readonly string[])[] = [['ask_calls', 'q_call_repeat'], ['ask_company', 'q_products'], ['ask_identity', 'q_personhood'], ['ask_transfer', 'q_original'], ['ask_recovery_process', 'q_backup_reliable']];
    const freshEquivalent = context.scenarioVersion === '1.0' && second && ((canonicalMotherIntent(first.intent) && canonicalMotherIntent(first.intent) === canonicalMotherIntent(second.intent)) || (LEGACY_FRESH_BRIDGE[first.intent] ?? first.intent.replace('q_fresh_', '')) === (LEGACY_FRESH_BRIDGE[second.intent] ?? second.intent.replace('q_fresh_', '')));
    if (second && first.score - second.score < MATCH_MARGIN && !freshEquivalent && !(equivalent.has(first.intent) && equivalent.has(second.intent)) && !compatible.some(pair => pair.includes(first.intent) && pair.includes(second.intent))) {
        const label = (intent: QueryIntent): string => SEMANTIC_CATALOG.find(group => group.intent === intent)?.label ?? 'another subject';
        return { intent: 'unknown', needsClarification: true, clarification: `Do you mean ${label(first.intent)}, or ${label(second.intent)}?`, choices: [{ intent: first.intent, label: label(first.intent) }, { intent: second.intent, label: label(second.intent) }], confidence: first.score, provider: 'browser-ai' };
    }
    const entityId = entityOf(input) ?? context.lastTopic ?? (context.lastFileId && !['company', 'readme'].includes(context.lastFileId) || /\b(service|program|monitor|process)\b/.test(normalize(input)) ? 'service-006' : undefined);
    const needsContext = ['ask_authorization', 'ask_retirement', 'ask_service_status'].includes(first.intent) && /\b(it|that|this|they)\b/.test(normalize(input)) && !entityId;
    return { intent: first.intent, entityId, needsClarification: needsContext, ...(needsContext ? { clarification: 'Which service or record do you mean?' } : {}), confidence: first.score, provider: 'browser-ai' };
}
