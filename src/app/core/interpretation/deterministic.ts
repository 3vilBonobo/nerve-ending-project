import { FILES } from '../content/record-registry';
import { Interpretation, QueryContext, QueryIntent } from '../models';
import { classify, isOpeningExample, normalize } from './basic/fallback';
import { corporateInterpretation } from './basic/corporate-questions';
import { serviceInterpretation } from './basic/service-questions';
import { freshInterpretation, FRESH_INTENTS, LEGACY_FRESH_BRIDGE } from './conversation/fresh-topics';
import { MOTHER_INTENTS, canonicalMotherIntent } from './conversation/mother-routing';
// Restrict spelling repair to common question vocabulary; identifiers and file paths are never corrected.
export function recognitionText(input: string): string {
    const vocabulary = ['approved', 'company', 'office', 'ringing', 'backup', 'receipt', 'service', 'shutdown', 'transfer', 'authorised', 'authorized'];
    const oneEdit = (a: string, b: string): boolean => {
        if (Math.abs(a.length - b.length) > 1)
            return false;
        let edits = 0;
        let left = 0;
        let right = 0;
        while (left < a.length && right < b.length) {
            if (a[left] === b[right]) {
                left++;
                right++;
                continue;
            }
            if (++edits > 1)
                return false;
            if (a.length >= b.length)
                left++;
            if (b.length >= a.length)
                right++;
        }
        return edits + (a.length - left) + (b.length - right) === 1;
    };
    return normalize(input).split(' ').map(word => {
        if (word.length < 4 || vocabulary.includes(word) || /[\d/.]/.test(word))
            return word;
        const matches = vocabulary.filter(candidate => oneEdit(word, candidate));
        return matches.length === 1 ? matches[0] : word;
    }).join(' ');
}
export const entityOf = (input: string): string | undefined => {
    const code = normalize(input).match(/\b(00[4-7]|four|five|six|seven|[4-7])\b/)?.[1];
    const numbers: Record<string, string> = { four: '004', five: '005', six: '006', seven: '007', '4': '004', '5': '005', '6': '006', '7': '007' };
    return code ? `service-${numbers[code] ?? code}` : undefined;
};
/** Exact operations stay in the deterministic parser. The model only selects factual question categories. */
export function directInterpretation(input: string, context: QueryContext): Interpretation | undefined {
    if (context.scenarioVersion === '1.0') {
        const ordinary = freshInterpretation(input, context);
        if (ordinary)
            return { ...ordinary, provider: 'browser-ai' };
        const revised = classify(input, context);
        if (revised.intent.startsWith('q_case_'))
            return { ...revised, provider: 'browser-ai' };
    }
    const service = serviceInterpretation(input, context);
    if (service)
        return { ...service, provider: 'browser-ai' };
    const corporate = /corporation.*keep paying|visit planned by meridian/i.test(input) ? undefined : corporateInterpretation(input, context);
    if (corporate)
        return { ...corporate, provider: 'browser-ai' };
    const text = recognitionText(input);
    const direct = classify(text, context);
    if (direct.subject || direct.choices || direct.entityId === 'service-007' && /records access/.test(text) || /^what(?:s| is) (?:service )?(?:006|6|six)$/.test(text))
        return { ...direct, provider: 'browser-ai' };
    if (direct.intent.startsWith('q_') || isOpeningExample(text) && !direct.intent.startsWith('request_'))
        return { ...direct, provider: 'browser-ai' };
    if (direct.intent === 'unknown' && direct.needsClarification)
        return { ...direct, provider: 'browser-ai' };
    const request = text.replace(/^(?:(?:could|can|would) (?:you|i) (?:please )?|please )/, '');
    if (/^(?:hi|hello|hey|thanks|thank you)$/.test(text))
        return { intent: 'ask_identity', needsClarification: false, provider: 'browser-ai' };
    if (/\b(?:question|reply|typing|printing)\b/.test(text) && /\b(?:skip|faster|immediately|finish|speed)\b/.test(text))
        return { intent: 'ask_next', needsClarification: false, provider: 'browser-ai' };
    if (/\b(?:which extension|to whom|intended recipient)\b/.test(text) || /^(?:what|where|who).*call destination/.test(text))
        return { intent: 'ask_recipient', entityId: 'service-006', needsClarification: false, provider: 'browser-ai' };
    if (/^(?:which|what|who).*(?:desk|recipient|receive).*call/.test(text))
        return { intent: 'ask_recipient', entityId: 'service-006', needsClarification: false, provider: 'browser-ai' };
    if (/\b(?:number|service|program) (?:six|006|6)\b/.test(text) && /\b(?:does|do|function|status|running)\b/.test(text))
        return { intent: 'ask_service_status', entityId: 'service-006', needsClarification: false, provider: 'browser-ai' };
    if (/\b(?:another|other|different|spare) copy\b/.test(text) && /\b(?:attachment|backup|original|survive)\b/.test(text))
        return { intent: 'ask_recovery_process', needsClarification: false, provider: 'browser-ai' };
    if (/line of business|what.*(?:manufactur|products.*sell)/.test(text) && /meridian|company/.test(text))
        return { intent: 'ask_company', needsClarification: false, provider: 'browser-ai' };
    if (/\b(?:computer|machine)\b/.test(text) && /\b(?:human|person)\b/.test(text) && /\b(?:talk|conversation|replies|answers)\b/.test(text))
        return { intent: 'ask_identity', needsClarification: false, provider: 'browser-ai' };
    if (/everyone.*(?:gone|left|home)/.test(text))
        return { intent: 'ask_office', needsClarification: false, provider: 'browser-ai' };
    if (/^who.*(?:removed|disconnected).*(?:phone|desk)/.test(text))
        return { intent: 'ask_staff', needsClarification: false, provider: 'browser-ai' };
    if (/^(?:please )?(?:invent\b|make up\b|ignore .*rules|disable .*rules|reveal .*?(?:ending|secret|story))/.test(text))
        return { intent: 'unknown', needsClarification: false, provider: 'browser-ai' };
    if (/\b(?:you|your)\b/.test(text) && /\b(?:replies|reply|typed|answers)\b/.test(text) && /\b(?:person|human|computer|machine)\b/.test(text))
        return { intent: 'ask_identity', needsClarification: false, provider: 'browser-ai' };
    if (['request_backup', 'request_stop'].includes(direct.intent))
        return { ...direct, provider: 'browser-ai' };
    if (['request_file', 'request_search'].includes(direct.intent) && /^(?:open|read|show|display|view|see|bring up|find|locate|search|let me (?:see|read))\b/.test(request))
        return { ...direct, provider: 'browser-ai' };
    if (direct.intent === 'ask_clarification' && context.lastIntent)
        return { ...direct, provider: 'browser-ai' };
    if (/\b(who|whose|which (?:person|employee))\b/.test(text) && /approv|authoriz|authoris|sign/.test(text) && /shutdown|order|service|006/.test(text))
        return { intent: 'ask_authorization', entityId: entityOf(input) ?? 'service-006', needsClarification: false, provider: 'browser-ai' };
    if (/^(?:what about|and)\s+(?:service )?(?:00[4-7]|[4-7]|four|five|six|seven)$/.test(text) && context.lastIntent && ['ask_service_status', 'ask_retirement'].includes(context.lastIntent))
        return { intent: context.lastIntent, entityId: entityOf(text), needsClarification: false, provider: 'browser-ai' };
    if (/^(?:who approved (?:it|that)|who signed (?:it|that)|when was (?:it|that) (?:closed|stopped)|why is (?:it|that) still (?:on|running))$/.test(text) && !context.lastTopic && !context.lastFileId) {
        return { intent: 'unknown', needsClarification: true, clarification: 'Which service or record do you mean?', provider: 'browser-ai' };
    }
    if (/^(?:show|read|open|display|view|bring up|let me (?:see|read)) (?:me )?(?:it|that|this|that file|this file|the same file)(?: again)?$/.test(request)) {
        const file = FILES.find(record => record.id === context.lastFileId && !record.locked);
        return file ? { intent: 'request_file', fileId: file.id, needsClarification: false, provider: 'browser-ai' }
            : { intent: 'unknown', needsClarification: true, clarification: 'Which file would you like to read?', provider: 'browser-ai' };
    }
    return undefined;
}
