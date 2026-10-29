import { describe, expect, it } from 'vitest';
import { INTENTS } from '../models';
import { classify } from '../interpretation/basic/fallback';
import { newLegacyGame as newGame, runInput } from './game';
describe('human questions and staged knowledge', () => {
    it.each([
        ['Who are you?', 'ask_identity', 'I provide access'],
        ['What is this place?', 'ask_company', 'saved company files'],
        ['Where am I?', 'ask_company', 'physical location'],
        ['Where is everybody?', 'ask_office', 'do not say what happened'],
        ['Is anyone still alive?', 'ask_office', 'do not say what happened'],
        ['Can I trust you?', 'ask_record_integrity', 'unknown details remain unknown'],
        ['Why am I here?', 'ask_access', 'do not explain who opened'],
        ['Can I leave?', 'ask_access', 'close this client'],
        ['Hello', 'ask_identity', 'CONNECTION ACTIVE'],
    ] as const)('answers %s from available records without the model', (question, intent, phrase) => {
        expect(classify(question).intent).toBe(intent);
        const result = runInput(newGame(), question);
        expect(result.output.lines.join(' ')).toContain(phrase);
        expect(result.state.archive006Recovered).toBe(false);
    });
    it('keeps later identity and protected receipt facts out of every initial answer category', () => {
        for (const intent of INTENTS.filter(item => item.startsWith('ask_'))) {
            const initial = runInput(newGame(), 'What is known?', { intent, needsClarification: false, provider: 'browser-ai' });
            expect(initial.output.lines.join(' ')).not.toMatch(/MOTHER|Anna Voss|Site 6|0417|COMMS\/BRIDGE-02/i);
            expect(initial.output.links.some(link => link.fileId === 'fragment')).toBe(false);
            const later = runInput({ ...newGame(), archive006Recovered: true }, 'Who are you?', { intent, needsClarification: false, provider: 'browser-ai' });
            expect(later.output.lines.join(' ')).not.toMatch(/MOTHER|Anna Voss|Site 6/i);
        }
    });
    it('reveals the partial receipt only after it has actually been read', () => {
        expect(runInput(newGame(), 'Who is 0417?').output.lines).toContain('NO MATCH IN THE CURRENT DIRECTORY.');
        const read = runInput(newGame(), 'Read the backup');
        expect(runInput(read.state, 'Who is 0417?').output.lines.join(' ')).toContain('0417 [PARTIAL]');
    });
    it('does not open a file when the player asks whether the receipt shows a transfer', () => {
        const result = runInput(newGame(), 'Does the receipt show a successful transfer?', { intent: 'ask_transfer', needsClarification: false, provider: 'browser-ai' });
        expect(result.openFileId).toBeUndefined();
        expect(result.state.openFileIds).toEqual([]);
    });
});
