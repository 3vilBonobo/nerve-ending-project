import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { fileById } from '../../../core/content/record-registry';
import { newLegacyGame } from '../../../core/engine/game';
import { DocumentWindow } from './document';
describe('record document window', () => {
    beforeEach(async () => {
        localStorage.clear();
        await TestBed.configureTestingModule({ imports: [DocumentWindow] }).compileComponents();
    });
    it('renders record contents as text, with read-only provenance', () => {
        const fixture = TestBed.createComponent(DocumentWindow);
        fixture.componentInstance.session.state.set(newLegacyGame());
        fixture.componentRef.setInput('file', { ...fileById('call')!, body: '<script>unexpected()</script>', author: 'Operations', provenance: 'Original record' });
        fixture.detectChanges();
        const element: HTMLElement = fixture.nativeElement;
        expect(element.querySelector('pre')?.textContent).toBe('<script>unexpected()</script>');
        expect(element.querySelector('script')).toBeNull();
        expect(element.textContent).toContain('CANNOT BE EDITED');
        expect(element.textContent).toContain('Original record');
        fixture.destroy();
    });
    it('rechecks visibility after reset even when a protected document is still bound', () => {
        const fixture = TestBed.createComponent(DocumentWindow);
        const document = fixture.componentInstance;
        document.session.state.set({ ...newLegacyGame(), archive006Recovered: true });
        fixture.componentRef.setInput('file', fileById('fragment'));
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('0417');
        document.session.reset();
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).not.toContain('0417');
        expect(fixture.nativeElement.textContent).toContain('RECORD NOT AVAILABLE');
        fixture.destroy();
    });
    it('keeps locked and missing references out of the document navigation', () => {
        const fixture = TestBed.createComponent(DocumentWindow);
        fixture.componentInstance.session.state.set(newLegacyGame());
        fixture.componentRef.setInput('file', { ...fileById('call')!, references: ['ledger', 'fragment', 'not-a-record'] });
        fixture.detectChanges();
        expect(fixture.componentInstance.references().map(file => file.id)).toEqual(['ledger']);
        const text = fixture.nativeElement.querySelector('.document-references').textContent;
        expect(text).toContain('/ARCHIVE/HANDOVER_006.REF');
        expect(text).not.toContain('.BAK');
        fixture.destroy();
    });
});
