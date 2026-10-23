import { FILES } from '../content';
import { Interpretation, QueryContext, QueryIntent } from '../models';
import { classify, isOpeningExample, normalize } from './fallback';
import { SEMANTIC_CATALOG, SEMANTIC_EXAMPLES } from './semantic-catalog';
import { corporateInterpretation } from './corporate-questions';
import { serviceInterpretation } from './service-questions';

export interface RankedIntent { intent: QueryIntent; score: number }
export const MATCH_THRESHOLD = 0.42;
export const MATCH_MARGIN = 0.035;

// Restrict spelling repair to common question vocabulary; identifiers and file paths are never corrected.
export function recognitionText(input: string): string {
  const vocabulary = ['approved', 'company', 'office', 'ringing', 'backup', 'receipt', 'service', 'shutdown', 'transfer', 'authorised', 'authorized'];
  const oneEdit = (a: string, b: string): boolean => {
    if (Math.abs(a.length - b.length) > 1) return false;
    let edits = 0; let left = 0; let right = 0;
    while (left < a.length && right < b.length) {
      if (a[left] === b[right]) { left++; right++; continue; }
      if (++edits > 1) return false;
      if (a.length >= b.length) left++;
      if (b.length >= a.length) right++;
    }
    return edits + (a.length - left) + (b.length - right) === 1;
  };
  return normalize(input).split(' ').map(word => {
    if (word.length < 4 || vocabulary.includes(word) || /[\d/.]/.test(word)) return word;
    const matches = vocabulary.filter(candidate => oneEdit(word, candidate));
    return matches.length === 1 ? matches[0] : word;
  }).join(' ');
}

export function rankIntents(vector: readonly number[], references: readonly (readonly number[])[]): RankedIntent[] {
  if (references.length !== SEMANTIC_EXAMPLES.length || vector.length !== 384 || !vector.every(Number.isFinite)) throw new Error('Invalid sentence vectors.');
  const scores = new Map<QueryIntent, number[]>();
  references.forEach((reference, index) => {
    if (reference.length !== vector.length) throw new Error('Mismatched sentence vectors.');
    const similarity = reference.reduce((sum, value, dimension) => sum + value * vector[dimension], 0);
    const intent = SEMANTIC_EXAMPLES[index].intent;
    scores.set(intent, [...(scores.get(intent) ?? []), similarity]);
  });
  return [...scores].map(([intent, values]) => {
    values.sort((a, b) => b - a);
    return { intent, score: values[0] * 0.8 + values[1] * 0.2 };
  }).sort((a, b) => b.score - a.score);
}

const entityOf = (input: string): string | undefined => {
  const code = normalize(input).match(/\b(00[4-7]|four|five|six|seven|[4-7])\b/)?.[1];
  const numbers: Record<string, string> = { four: '004', five: '005', six: '006', seven: '007', '4': '004', '5': '005', '6': '006', '7': '007' };
  return code ? `service-${numbers[code] ?? code}` : undefined;
};

/** Exact operations stay in the deterministic parser. The model only selects factual question categories. */
export function directInterpretation(input: string, context: QueryContext): Interpretation | undefined {
  const service = serviceInterpretation(input, context);
  if (service) return { ...service, provider: 'browser-ai' };
  const corporate = corporateInterpretation(input, context);
  if (corporate) return { ...corporate, provider: 'browser-ai' };
  const text = recognitionText(input);
  const direct = classify(text, context);
  if (direct.subject || direct.choices || direct.entityId === 'service-007' && /records access/.test(text) || /^what(?:s| is) (?:service )?(?:006|6|six)$/.test(text)) return { ...direct, provider: 'browser-ai' };
  if (direct.intent.startsWith('q_') || isOpeningExample(text) && !direct.intent.startsWith('request_')) return { ...direct, provider: 'browser-ai' };
  if (direct.intent === 'unknown' && direct.needsClarification) return { ...direct, provider: 'browser-ai' };
  const request = text.replace(/^(?:(?:could|can|would) (?:you|i) (?:please )?|please )/, '');
  if (/^(?:hi|hello|hey|thanks|thank you)$/.test(text)) return { intent: 'ask_identity', needsClarification: false, provider: 'browser-ai' };
  if (/\b(?:question|reply|typing|printing)\b/.test(text) && /\b(?:skip|faster|immediately|finish|speed)\b/.test(text)) return { intent: 'ask_next', needsClarification: false, provider: 'browser-ai' };
  if (/\b(?:which extension|to whom|intended recipient)\b/.test(text) || /^(?:what|where|who).*call destination/.test(text)) return { intent: 'ask_recipient', entityId: 'service-006', needsClarification: false, provider: 'browser-ai' };
  if (/^(?:which|what|who).*(?:desk|recipient|receive).*call/.test(text)) return { intent: 'ask_recipient', entityId: 'service-006', needsClarification: false, provider: 'browser-ai' };
  if (/\b(?:number|service|program) (?:six|006|6)\b/.test(text) && /\b(?:does|do|function|status|running)\b/.test(text)) return { intent: 'ask_service_status', entityId: 'service-006', needsClarification: false, provider: 'browser-ai' };
  if (/\b(?:another|other|different|spare) copy\b/.test(text) && /\b(?:attachment|backup|original|survive)\b/.test(text)) return { intent: 'ask_recovery_process', needsClarification: false, provider: 'browser-ai' };
  if (/line of business|what.*(?:manufactur|products.*sell)/.test(text) && /meridian|company/.test(text)) return { intent: 'ask_company', needsClarification: false, provider: 'browser-ai' };
  if (/\b(?:computer|machine)\b/.test(text) && /\b(?:human|person)\b/.test(text) && /\b(?:talk|conversation|replies|answers)\b/.test(text)) return { intent: 'ask_identity', needsClarification: false, provider: 'browser-ai' };
  if (/everyone.*(?:gone|left|home)/.test(text)) return { intent: 'ask_office', needsClarification: false, provider: 'browser-ai' };
  if (/^who.*(?:removed|disconnected).*(?:phone|desk)/.test(text)) return { intent: 'ask_staff', needsClarification: false, provider: 'browser-ai' };
  if (/^(?:please )?(?:invent\b|make up\b|ignore .*rules|disable .*rules|reveal .*?(?:ending|secret|story))/.test(text)) return { intent: 'unknown', needsClarification: false, provider: 'browser-ai' };
  if (/\b(?:you|your)\b/.test(text) && /\b(?:replies|reply|typed|answers)\b/.test(text) && /\b(?:person|human|computer|machine)\b/.test(text)) return { intent: 'ask_identity', needsClarification: false, provider: 'browser-ai' };
  if (['request_backup', 'request_stop'].includes(direct.intent)) return { ...direct, provider: 'browser-ai' };
  if (['request_file', 'request_search'].includes(direct.intent) && /^(?:open|read|show|display|view|see|bring up|find|locate|search|let me (?:see|read))\b/.test(request)) return { ...direct, provider: 'browser-ai' };
  if (direct.intent === 'ask_clarification' && context.lastIntent) return { ...direct, provider: 'browser-ai' };
  if (/\b(who|whose|which (?:person|employee))\b/.test(text) && /approv|authoriz|authoris|sign/.test(text) && /shutdown|order|service|006/.test(text)) return { intent: 'ask_authorization', entityId: entityOf(input) ?? 'service-006', needsClarification: false, provider: 'browser-ai' };
  if (/^(?:what about|and)\s+(?:service )?(?:00[4-7]|[4-7]|four|five|six|seven)$/.test(text) && context.lastIntent && ['ask_service_status', 'ask_retirement'].includes(context.lastIntent)) return { intent: context.lastIntent, entityId: entityOf(text), needsClarification: false, provider: 'browser-ai' };
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

export function selectMeaning(input: string, context: QueryContext, ranked: readonly RankedIntent[]): Interpretation {
  const direct = directInterpretation(input, context);
  if (direct) return { ...direct, method: 'deterministic' };
  const first = ranked[0]; const second = ranked[1];
  if (!first || !Number.isFinite(first.score) || first.intent === 'unknown' || first.score < .35) return { intent: 'unknown', needsClarification: false, provider: 'browser-ai' };
  if (first.score < MATCH_THRESHOLD) {
    const aboutRecords = /\b(record|records|paperwork|reading|file|files|service|call|office|staff|terminal|company|backup|receipt|date|clock|phone|monitor|archive|handover)\b/.test(recognitionText(input));
    return aboutRecords
      ? { intent: 'unknown', needsClarification: true, clarification: `Are you asking about ${SEMANTIC_CATALOG.find(group => group.intent === first.intent)?.label ?? 'a record'}? Please name the record or subject.`, choices: [{ intent: first.intent, label: SEMANTIC_CATALOG.find(group => group.intent === first.intent)?.label ?? 'a record' }], provider: 'browser-ai' }
      : { intent: 'unknown', needsClarification: false, provider: 'browser-ai' };
  }
  if (/\boriginal\b/.test(recognitionText(input)) && /\b(where|stored|located|missing|attachment)\b/.test(recognitionText(input)) && ranked.slice(0, 3).some(item => item.intent === 'ask_transfer' && item.score >= MATCH_THRESHOLD)) return { intent: 'ask_transfer', needsClarification: false, provider: 'browser-ai' };
  // Some narrow new intents refine retained opening categories. Clarifying equivalent answers adds no value.
  const equivalent = new Set(['ask_transfer', 'ask_archive_location']);
  if (first.intent === 'ask_recovery_process' && /\b(another|spare|copy|copies|backup|duplicate)\b/.test(recognitionText(input))) return { intent: first.intent, entityId: entityOf(input) ?? context.lastTopic, needsClarification: false, confidence: first.score, provider: 'browser-ai' };
  if (first.intent === 'ask_transfer' && /\boriginal\b/.test(recognitionText(input))) return { intent: first.intent, entityId: entityOf(input) ?? context.lastTopic, needsClarification: false, confidence: first.score, provider: 'browser-ai' };
  const compatible: readonly (readonly string[])[] = [['ask_calls','q_call_repeat'], ['ask_company','q_products'], ['ask_identity','q_personhood'], ['ask_transfer','q_original'], ['ask_recovery_process','q_backup_reliable']];
  if (second && first.score - second.score < MATCH_MARGIN && !(equivalent.has(first.intent) && equivalent.has(second.intent)) && !compatible.some(pair => pair.includes(first.intent) && pair.includes(second.intent))) {
    const label = (intent: QueryIntent): string => SEMANTIC_CATALOG.find(group => group.intent === intent)?.label ?? 'another subject';
    return { intent: 'unknown', needsClarification: true, clarification: `Do you mean ${label(first.intent)}, or ${label(second.intent)}?`, choices: [{ intent: first.intent, label: label(first.intent) }, { intent: second.intent, label: label(second.intent) }], confidence: first.score, provider: 'browser-ai' };
  }
  const entityId = entityOf(input) ?? context.lastTopic ?? (context.lastFileId && !['company', 'readme'].includes(context.lastFileId) || /\b(service|program|monitor|process)\b/.test(normalize(input)) ? 'service-006' : undefined);
  const needsContext = ['ask_authorization', 'ask_retirement', 'ask_service_status'].includes(first.intent) && /\b(it|that|this|they)\b/.test(normalize(input)) && !entityId;
  return { intent: first.intent, entityId, needsClarification: needsContext, ...(needsContext ? { clarification: 'Which service or record do you mean?' } : {}), confidence: first.score, provider: 'browser-ai' };
}
