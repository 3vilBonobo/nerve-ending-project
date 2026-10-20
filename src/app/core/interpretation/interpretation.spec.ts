import { describe, expect, it } from 'vitest';
import { classify } from './fallback';
import { BrowserAIInterpreter, interpretSafely, validateInterpretation } from './providers';
import { IntentInterpreter, QueryIntent } from '../models';

describe('authored offline question vocabulary', () => {
  const questions: [string, QueryIntent][] = [
    ['Why is 006 active?', 'ask_service_status'], ['What keeps that service running?', 'ask_service_status'],
    ['Is service six online?', 'ask_service_status'], ['Why is service six still running?', 'ask_service_status'],
    ['I thought it was retired', 'ask_retirement'], ['When was it decommissioned?', 'ask_retirement'],
    ["Wasn't it retired?", 'ask_retirement'], ['Was the service ever discontinued?', 'ask_retirement'],
    ["Where's the archive for 006?", 'ask_archive_location'], ['Where are its records?', 'ask_archive_location'],
    ['Did the files get transferred?', 'ask_transfer'], ['What happened to the transfer?', 'ask_transfer'],
    ['Is there a missing receipt?', 'ask_transfer'], ['Where is the manifest?', 'ask_transfer'],
    ['What do I need to restore it?', 'ask_recovery_process'], ['How do I repair the index?', 'ask_recovery_process'],
    ['How can I recover it?', 'ask_recovery_process'], ['Can the entry be rebuilt?', 'ask_recovery_process'],
    ['Who approved that?', 'ask_authorization'], ['Who signed the approval?', 'ask_authorization'],
    ['Can I see the register?', 'request_file'], ['Show me the retirement record', 'request_file'],
    ['Read the transfer ledger', 'request_file'], ['Can I view the repair notes?', 'request_file'],
    ['What is Meridian Systems?', 'ask_company'], ['Tell me about the company', 'ask_company'],
    ['Who am I talking to?', 'ask_identity'], ['Who are you?', 'ask_identity'],
    ['What do you mean?', 'ask_clarification'], ['Explain that', 'ask_clarification'],
    ['Find continuity', 'request_search'],
    ['Why was 006 not stopped?', 'ask_retirement'], ['Was 006 turned off?', 'ask_retirement'],
    ['Who gave permission to stop 006?', 'ask_authorization'],
    ['How do I find the missing file?', 'ask_recovery_process'],
    ['Show me the File move log', 'request_file'], ['Can I open the Service list?', 'request_file'],
    ['Show me About Meridian', 'request_file'],
  ];
  it.each(questions)('%s → %s', (question, intent) => {
    expect(classify(question, { lastTopic: 'service-006', lastIntent: 'ask_transfer' }).intent).toBe(intent);
  });
  it('requests context for ungrounded pronouns and does not invent other service stories', () => {
    expect(classify('Who approved that?').needsClarification).toBe(true);
    expect(classify('When was it decommissioned?').needsClarification).toBe(true);
    expect(classify('Why is service 005 active?').needsClarification).toBe(true);
    expect(classify('When was it decommissioned?', { lastTopic: 'service-006' }).entityId).toBe('service-006');
    expect(classify('What do you mean?').needsClarification).toBe(true);
  });
  it('understands the opening suggestion without earlier conversation', () => {
    expect(classify('What is still running?')).toMatchObject({ intent: 'ask_service_status', entityId: 'service-006', needsClarification: false });
    expect(classify('How do I find the missing file?')).toMatchObject({ intent: 'ask_recovery_process', needsClarification: false });
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
    expect(result.interpretation.intent).toBe('ask_service_status'); expect(result.metrics.fallback).toBe(true);
  });
  it('falls back on malformed output, rejection, unknown intent and timeout', async () => {
    const base: IntentInterpreter = { id: 'broken', isAvailable: async () => true, interpret: async () => { throw new Error('CORS'); } };
    const providers = [base, { ...base, interpret: async () => ({ intent: 'arbitrary' } as never) }, { ...base, interpret: async () => ({ intent: 'unknown', needsClarification: false, provider: 'ollama' } as const) }, { ...base, interpret: () => new Promise<never>(() => {}) }];
    for (const provider of providers) {
      const result = await interpretSafely('Why is service 006 active?', {}, provider, 10);
      expect(result.interpretation.intent).toBe('ask_service_status'); expect(result.metrics.fallback).toBe(true);
    }
  });
  it('gives providers a copy of the context and exposes no mutation API', async () => {
    const context = { lastTopic: 'service-006' };
    await interpretSafely('Why is 006 active?', context, { id: 'test', isAvailable: async () => true, interpret: async (_, ctx) => { ctx.lastTopic = 'modified'; return { intent: 'ask_service_status', needsClarification: false, provider: 'ollama' }; } });
    expect(context.lastTopic).toBe('service-006');
  });
});
