import type { Interpretation } from '../../models';
/** Narrow QA regressions shared by offline and semantic recognition; no new catalogue entries. */
export function openingQuestion(input: string): Interpretation | undefined {
    const text = input.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
    const make = (intent: Interpretation['intent'], subject?: Interpretation['subject'], extra: Partial<Interpretation> = {}): Interpretation => ({ intent, subject, needsClarification: false, provider: 'fallback', method: 'deterministic', ...extra });
    if (/^(?:are you (?:a |an )?(?:human|ai|robot|artificial intelligence)|robot|intelligence)$/.test(text))
        return make('ask_identity', 'identity');
    if (/\b(?:meridian|company)\b/.test(text) && /\bheadquarters?\b/.test(text))
        return make('ask_company', 'headquarters');
    if (/\b(?:your|this|the) server\b/.test(text) && /\b(?:where|location|located|hosted)\b/.test(text))
        return make('ask_identity', 'server');
    if (/\b(?:saved|stored|save|store|keep|kept)\b/.test(text) && /\b(?:locally|local|browser)\b/.test(text))
        return make('ask_access', 'local-save');
    if (/\bwho\b.*\bj kell\b/.test(text))
        return make('ask_staff', 'kell');
    if (/\b(?:what|explain|define)\b.*\bbiological activity\b/.test(text))
        return make('ask_service_status', 'biological');
    if (/\b(?:what|explain|define)\b.*\blive monitor\b/.test(text))
        return make('ask_service_status', 'live-monitor');
    if (/\brecords access\b.*\b007\b|\b007\b.*\brecords access\b/.test(text))
        return make('ask_service_status', undefined, { entityId: 'service-007' });
    if (/^what(?:s| is) (?:service )?(?:006|6|six)$/.test(text))
        return make('ask_service_status', undefined, { entityId: 'service-006' });
    if (text === 'online')
        return make('ask_service_status', undefined, { needsClarification: true, clarification: 'Do you mean the running service 006, or this records connection 007?', choices: [{ intent: 'ask_service_status', label: 'service 006' }, { intent: 'ask_access', label: 'records connection 007' }] });
    return undefined;
}
