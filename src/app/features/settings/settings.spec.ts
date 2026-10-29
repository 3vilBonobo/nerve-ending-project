import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubBrowserDialogs } from '../../testing/browser.test-helper';
import { Settings } from './settings';
describe('client settings', () => {
    let restoreDialogs: () => void;
    beforeEach(async () => {
        localStorage.clear();
        restoreDialogs = stubBrowserDialogs();
        await TestBed.configureTestingModule({ imports: [Settings] }).compileComponents();
    });
    afterEach(() => restoreDialogs());
    it('opens and closes preferences without changing investigation progress', () => {
        const fixture = TestBed.createComponent(Settings);
        fixture.detectChanges();
        const settings = fixture.componentInstance;
        const before = settings.session.state();
        settings.open();
        expect(fixture.nativeElement.querySelector('dialog').open).toBe(true);
        settings.close();
        expect(fixture.nativeElement.querySelector('dialog').open).toBe(false);
        expect(settings.session.state()).toBe(before);
        fixture.destroy();
    });
    it('shows actual model progress and exposes cancellation', () => {
        const fixture = TestBed.createComponent(Settings);
        const settings = fixture.componentInstance;
        settings.session.language.state.update(state => ({ ...state, phase: 'loading', loaded: 25, total: 100 }));
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('25%');
        expect(fixture.nativeElement.querySelector('progress').value).toBe(25);
        const cancel = vi.spyOn(settings.session.language, 'disable');
        const button = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>).find(button => button.textContent?.includes('CANCEL LOADING'))!;
        button.click();
        expect(cancel).toHaveBeenCalledOnce();
        fixture.destroy();
    });
    it('only offers installation after a real browser install event', async () => {
        const fixture = TestBed.createComponent(Settings);
        fixture.detectChanges();
        const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
            prompt: vi.fn().mockResolvedValue(undefined), userChoice: Promise.resolve({ outcome: 'accepted' }),
        });
        window.dispatchEvent(event);
        fixture.detectChanges();
        expect(event.defaultPrevented).toBe(true);
        await fixture.componentInstance.install();
        expect(event.prompt).toHaveBeenCalledOnce();
        expect(fixture.componentInstance.installPrompt()).toBeNull();
        expect(fixture.componentInstance.installMessage()).toContain('accepted');
        fixture.destroy();
    });
});
