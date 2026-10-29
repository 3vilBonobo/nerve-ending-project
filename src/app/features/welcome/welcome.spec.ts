import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Welcome } from './welcome';
describe('welcome introduction', () => {
    beforeEach(async () => { await TestBed.configureTestingModule({ imports: [Welcome] }).compileComponents(); });
    afterEach(() => vi.useRealTimers());
    it('reveals a chapter before advancing and allows login at any point', () => {
        const fixture = TestBed.createComponent(Welcome);
        const welcome = fixture.componentInstance;
        const entered = vi.fn();
        welcome.entered.subscribe(entered);
        welcome.begin();
        welcome.reveal();
        welcome.next();
        expect(welcome.chapter()).toBe(1);
        welcome.login();
        expect(entered).toHaveBeenCalledOnce();
        fixture.destroy();
    });
    it('stops the typewriter and pending focus work when the component is destroyed', () => {
        vi.useFakeTimers();
        const fixture = TestBed.createComponent(Welcome);
        const welcome = fixture.componentInstance;
        welcome.begin();
        vi.advanceTimersByTime(48);
        const count = welcome.visibleCharacters();
        fixture.destroy();
        vi.advanceTimersByTime(1000);
        expect(welcome.visibleCharacters()).toBe(count);
    });
    it('offers a resume action without entering or changing a story on render', () => {
        const fixture = TestBed.createComponent(Welcome);
        const entered = vi.fn();
        fixture.componentRef.setInput('returning', true);
        fixture.componentInstance.entered.subscribe(entered);
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Saved session found');
        expect(entered).not.toHaveBeenCalled();
        fixture.nativeElement.querySelector('.start-button').click();
        expect(entered).toHaveBeenCalledOnce();
        fixture.destroy();
    });
});
