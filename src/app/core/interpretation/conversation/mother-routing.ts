import type { Interpretation, QueryContext, QueryIntent } from '../../models';
import { MOTHER_ALIASES, MOTHER_TOPICS } from './mother-corpus';
export type VoiceStage = 'early' | 'investigation' | 'core';
export type Disclosure = 'public' | 'after_discrepancy' | 'after_clinical_review' | 'after_welfare_comparison' | 'after_external_review' | 'after_intent_review' | 'after_final_review' | 'after_severance' | 'after_continuation';
export interface MotherTopic {
    readonly id: string;
    readonly intent: QueryIntent;
    readonly domain: string;
    readonly gate: Disclosure;
    readonly handling: string;
    readonly safety: boolean;
    readonly playful: boolean;
    readonly explicitHumor: boolean;
    readonly responses: Readonly<Partial<Record<VoiceStage, string>>>;
    readonly responseGates: Readonly<Partial<Record<VoiceStage, Disclosure>>>;
    readonly sources: readonly string[];
    readonly examples: readonly string[];
}
export const MOTHER: readonly MotherTopic[] = MOTHER_TOPICS as readonly MotherTopic[];
export const MOTHER_INTENTS = new Set<string>(MOTHER.map(t => t.intent));
export const motherKey = (s: string): string => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const exact = new Map([...MOTHER.flatMap(t => t.examples.map(text => [motherKey(text), t.id] as const)), ...MOTHER_ALIASES.map(([text, id]) => [motherKey(text), id] as const)]);
export const motherTopic = (id: string): MotherTopic | undefined => MOTHER.find(t => t.id === id || t.intent === id);
const fresh: Readonly<Record<string, string>> = { greeting: 'hello', thanks: 'thanks', farewell: 'goodbye', humor: 'tell_joke', identity: 'system_identity', capabilities: 'r02_capabilities', access: 'read_only', founders: 'founders', products: 'products', c_series: 'c_series', r_series: 'r_series', n_series: 'n_series', staff: 'employee_lookup', anna_role: 'anna_work', reliability: 'trust', errors: 'system_errors', sources: 'source', correction: 'correction', clarify: 'clarify', repeat: 'repeat', dates: 'clock', saves: 'save', social: 'how_are_you', funding: 'funding', visit: 'visitor', uncertainty: 'missing_info' };
export const MOTHER_LEGACY: Readonly<Record<string, string>> = { ask_identity: 'system_identity', ask_access: 'read_only', ask_company: 'company_identity', ask_dates: 'clock', ask_record_integrity: 'trust', ask_next: 'files', ask_clarification: 'clarify', q_personhood: 'system_identity', q_designation: 'name_preference', q_builder: 'developer', q_functions: 'r02_capabilities', q_source: 'source', q_authorship: 'source', q_repeat: 'repeat', q_plain: 'clarify', q_answer_changed: 'correction', q_trust: 'trust', q_lie: 'lie', q_mistakes: 'system_errors', q_products: 'products', q_funding: 'funding', q_want_player: 'visitor', q_greeting: 'hello', q_thanks: 'thanks', q_joke: 'tell_joke', q_goodbye: 'goodbye', q_goodnight: 'goodbye', q_sorry: 'apology', q_robot: 'system_identity', q_color: 'favorite_color', q_music: 'music' };
export function canonicalMotherIntent(intent: string): QueryIntent | undefined {
    if (MOTHER_INTENTS.has(intent))
        return intent as QueryIntent;
    const id = intent.startsWith('q_fresh_') ? fresh[intent.slice(8)] : MOTHER_LEGACY[intent];
    return id ? `q_neconv_${id}` : undefined;
}
export function motherLiteral(input: string, context: QueryContext = {}): MotherTopic | undefined {
    const t = motherKey(input);
    if (/^[\s?!.,:;]+$/.test(input))
        return motherTopic('neconv_punctuation');
    const id = exact.get(t);
    if (id)
        return motherTopic(id);
    // Context words are not global training examples or executable aliases.
    if (context.lastIntent || context.lastTopic) {
        if (/^(?:why|how so|what does that mean|what about that|explain that|tell me more|back to (?:that|what you were saying))$/.test(t))
            return motherTopic('neconv_clarify');
        if (/^(?:who is she|what about her|where is she now)$/.test(t) && /anna|voss|patient/i.test(context.conversationSubject ?? context.lastTopic ?? ''))
            return motherTopic('neconv_anna_status_early');
        if (/\b(?:mean|meant|what about)\b/.test(t) && /\b(?:rehab|rehabilitation|assessment kit|r 11)\b/.test(t))
            return motherTopic('neconv_r_series');
        if (/\b(?:found|founded|founder|founders|established)\b/.test(t) && /company|corporate|meridian/.test(context.conversationSubject ?? context.lastTopic ?? ''))
            return motherTopic('neconv_founders');
    }
    if (/(?:stop|less|no|without|tone down|dial down).*(?:sarcas|teasing)|^(?:please )?(?:speak|be|could you be|can you be).*(?:gently|respectful|polite|nice)/.test(t))
        return motherTopic('neconv_please_be_nice');
    if (/\b(?:keep|make|give|speak|be)\b.*\b(?:factual|straightforward|plain)\b/.test(t))
        return motherTopic('neconv_please_be_nice');
    if (/\b(?:need|want|let me)\b.*\b(?:silence|quiet|think)\b|not (?:yet )?ready to answer/.test(t))
        return motherTopic('neconv_silence');
    return undefined;
}
export function motherInterpretation(input: string, context: QueryContext): Interpretation | undefined {
    const t = motherLiteral(input, context);
    return t ? { intent: t.intent, needsClarification: false, provider: 'fallback', method: 'deterministic' } : undefined;
}
