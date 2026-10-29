import { describe, expect, it } from 'vitest';
import { classify } from './fallback';
import { BrowserAIInterpreter, interpretSafely, validateInterpretation } from '../providers';
import { IntentInterpreter, QueryIntent } from '../../models';
describe('ordinary questions about the records', () => {
    const questions: [
        string,
        QueryIntent
    ][] = [
        ['What is Meridian Systems?', 'ask_company'], ['Tell me about the company', 'ask_company'],
        ['Who are you?', 'ask_identity'], ['Is this an automatic system?', 'ask_identity'],
        ['Who is calling?', 'ask_calls'], ['Why is the phone ringing?', 'ask_calls'],
        ['What is going on?', 'ask_calls'], ['Why does it keep calling?', 'ask_calls'],
        ['Who is supposed to answer?', 'ask_recipient'], ['Where is the phone?', 'ask_recipient'],
        ['Who works at the night desk?', 'ask_recipient'], ['Who gets the call?', 'ask_recipient'],
        ['Is anyone there?', 'ask_office'], ['Is the office still open?', 'ask_office'],
        ['What happened here?', 'ask_office'], ['Are there any staff?', 'ask_office'],
        ['What is 006?', 'ask_service_status'], ['Why is service six still running?', 'ask_service_status'],
        ['Why did it restart?', 'ask_service_status'], ['What is 005?', 'ask_service_status'],
        ['Wasnt it closed?', 'ask_retirement'], ['Was 006 turned off?', 'ask_retirement'],
        ['Where is its archive?', 'ask_archive_location'], ['Where are the files?', 'ask_archive_location'],
        ['Did the files get transferred?', 'ask_transfer'], ['Is there a receipt?', 'ask_transfer'],
        ['Is there a backup?', 'ask_recovery_process'], ['How can I recover it?', 'ask_recovery_process'],
        ['Read the backup', 'request_backup'], ['Can I read the backup copy?', 'request_backup'],
        ['Show me the backup', 'request_backup'], ['Open backup', 'request_backup'],
        ['Stop 006', 'request_stop'], ['Can I turn it off?', 'request_stop'],
        ['Who approved that?', 'ask_authorization'], ['Who is 0417?', 'ask_authorization'],
        ['Show me the office notice', 'request_file'], ['Read the receipt', 'request_file'],
        ['Show me the service register', 'request_file'], ['Read the last shift', 'request_file'],
        ['Read the restart log', 'request_file'], ['Show me 006', 'request_file'],
        ['Find night desk', 'request_search'], ['What do you mean?', 'ask_clarification'],
    ];
    it.each(questions)('%s → %s', (question, intent) => {
        expect(classify(question, { lastTopic: 'service-006', lastIntent: 'ask_calls' }).intent).toBe(intent);
    });
    it('asks for missing context instead of assigning an ungrounded pronoun a story', () => {
        expect(classify('Who approved that?').needsClarification).toBe(true);
        expect(classify('When was it decommissioned?').needsClarification).toBe(true);
        expect(classify('What do you mean?').needsClarification).toBe(true);
        expect(classify('What is 005?').entityId).toBe('service-005');
    });
    it('distinguishes asking about a backup from choosing to read it', () => {
        expect(classify('Is there a backup?').intent).toBe('ask_recovery_process');
        expect(classify('How can I read the backup?').intent).toBe('ask_recovery_process');
        expect(classify('Please read the backup').intent).toBe('request_backup');
    });
});
describe('untrusted classifier boundary', () => {
    it('rejects arbitrary labels, invented entities, locked files and missing request fields', () => {
        for (const value of [null, 'text', { intent: 'run_recovery', needsClarification: false }, { intent: 'ask_transfer', needsClarification: 'no' }, { intent: 'ask_transfer', entityId: 'secret-site', needsClarification: false }, { intent: 'request_file', fileId: 'fragment', needsClarification: false }, { intent: 'request_file', needsClarification: false }]) {
            expect(validateInterpretation(value, 'ollama')).toBeUndefined();
        }
        expect(validateInterpretation({ intent: 'ask_transfer', needsClarification: false, arbitraryHtml: '<script>' }, 'ollama')).toEqual({ intent: 'ask_transfer', needsClarification: false, provider: 'ollama' });
    });
    it('handles unavailable browser models without affecting play', async () => {
        const result = await interpretSafely('Why is service 006 active?', {}, new BrowserAIInterpreter());
        expect(result.interpretation.intent).toBe('ask_service_status');
        expect(result.metrics.fallback).toBe(true);
    });
    it('falls back on malformed output, rejection, unknown intent and timeout', async () => {
        const base: IntentInterpreter = { id: 'broken', isAvailable: async () => true, interpret: async () => { throw new Error('CORS'); } };
        const providers = [base, { ...base, interpret: async () => ({ intent: 'arbitrary' } as never) }, { ...base, interpret: async () => ({ intent: 'unknown', needsClarification: false, provider: 'ollama' } as const) }, { ...base, interpret: () => new Promise<never>(() => { }) }];
        for (const provider of providers) {
            const result = await interpretSafely('Why is service 006 active?', {}, provider, 10);
            expect(result.interpretation.intent).toBe('ask_service_status');
            expect(result.metrics.fallback).toBe(true);
        }
    });
    it('gives providers a copy of the context and exposes no mutation API', async () => {
        const context = { lastTopic: 'service-006' };
        await interpretSafely('Why is 006 active?', context, { id: 'test', isAvailable: async () => true, interpret: async (_, ctx) => { ctx.lastTopic = 'modified'; return { intent: 'ask_service_status', needsClarification: false, provider: 'ollama' }; } });
        expect(context.lastTopic).toBe('service-006');
    });
});
