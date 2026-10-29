import { describe, expect, it } from 'vitest';
import { directInterpretation, recognitionText, selectMeaning } from './semantic';
describe('question boundaries and context', () => {
    it('clarifies close meanings and never turns similarity into a file operation', () => {
        expect(selectMeaning('Was anyone responsible?', {}, [{ intent: 'ask_staff', score: .7 }, { intent: 'ask_authorization', score: .69 }])).toMatchObject({ intent: 'unknown', needsClarification: true });
        expect(selectMeaning('Something about files', {}, [{ intent: 'ask_transfer', score: .3 }])).toMatchObject({ intent: 'unknown', needsClarification: false });
    });
    it('resolves a selected file and numbered service follow-up without inventing a subject', () => {
        expect(directInterpretation('Show me that file', { lastFileId: 'company' })).toMatchObject({ intent: 'request_file', fileId: 'company' });
        expect(directInterpretation('Show me that file', {})).toMatchObject({ needsClarification: true });
        expect(directInterpretation('And five?', { lastIntent: 'ask_service_status' })).toMatchObject({ intent: 'ask_service_status', entityId: 'service-005' });
        expect(directInterpretation('Who signed it?', {})).toMatchObject({ needsClarification: true });
    });
    it('repairs question vocabulary but preserves numbers and paths', () => {
        expect(recognitionText('Who aproved the shutdown?')).toBe('who approved the shutdown');
        expect(recognitionText('Find /ARCHIVE/RECIEPT_0417.TXT')).toContain('/archive/reciept_0417.txt');
    });
    it('keeps informational backup questions separate from a read request', () => {
        expect(directInterpretation('Is a backup available?', {})).toBeUndefined();
        expect(directInterpretation('Read the backup', {})).toMatchObject({ intent: 'request_backup' });
    });
});
