import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Journal } from './journal';
import { Session } from '../../core/state/session';
import { newGame, runInput } from '../../core/engine/game';
describe('journal source navigation', () => {
    beforeEach(async () => {
        Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.open = true; } });
        const state = ['OPEN authorization', 'INFO 006', 'OPEN call'].reduce((s, i) => runInput(s, i).state, newGame());
        await TestBed.configureTestingModule({ imports: [Journal], providers: [{ provide: Session, useValue: { state: signal(state), submit: vi.fn() } }] }).compileComponents();
    });
    afterEach(() => { Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal'); });
    it('renders actual observed citations, a quiet unresolved question and no protected content', () => {
        const fixture = TestBed.createComponent(Journal);
        fixture.detectChanges();
        const e = fixture.nativeElement as HTMLElement;
        expect(e.querySelector('dialog')?.open).toBe(true);
        expect(e.textContent).toContain('Observed');
        expect(e.textContent).toContain('Unresolved');
        expect(e.textContent).toContain('Reviewed');
        expect(e.textContent).toContain('/ADMIN/CLOSURE_LIST.TXT');
        expect(e.textContent).not.toMatch(/NE-104|Helen Marsh|PATIENT: ANNA/);
        const opened: string[] = [];
        fixture.componentInstance.opened.subscribe(id => opened.push(id));
        const button = Array.from(e.querySelectorAll<HTMLButtonElement>('button')).find(b => b.textContent === 'Open authorization')!;
        button.click();
        expect(opened).toEqual(['authorization']);
        expect(TestBed.inject(Session).state().scenario!.events).toEqual([]);
        fixture.destroy();
    });
    it('has no executable review entry and restricts service links to reads', () => {
        const fixture = TestBed.createComponent(Journal);
        fixture.detectChanges();
        const journal = fixture.componentInstance, session = TestBed.inject(Session);
        journal.inspect('CONFIRM OPERATION');
        journal.inspect('REPORT DISCREPANCY');
        expect(session.submit).not.toHaveBeenCalled();
        journal.inspect('INFO 006');
        expect(session.submit).toHaveBeenCalledWith('INFO 006');
        fixture.destroy();
    });
});
