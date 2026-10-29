import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { newGame, newLegacyGame, runInput } from '../../core/engine/game';
import { fileById } from '../../core/content/record-registry';
import { SCENARIO_REVIEW_PATH } from '../../core/engine/scenario/scenario-playthroughs';
import { Session } from '../../core/state/session';
import { FileBrowser } from './file-browser';
describe('file browser', () => {
    beforeEach(async () => {
        localStorage.clear();
        await TestBed.configureTestingModule({ imports: [FileBrowser] }).compileComponents();
    });
    it('navigates folders and returns to the parent directory', () => {
        const fixture = TestBed.createComponent(FileBrowser);
        const browser = fixture.componentInstance;
        browser.session.state.set(newLegacyGame());
        fixture.detectChanges();
        const folder = browser.folders()[0];
        expect(folder).toBeTruthy();
        fixture.nativeElement.querySelector('.folder-row').click();
        expect(browser.session.state().currentDirectory).toBe(folder);
        browser.up();
        expect(browser.session.state().currentDirectory).toBe('/');
        fixture.destroy();
    });
    it('filters the visible archive and emits a selected record without opening it itself', () => {
        const fixture = TestBed.createComponent(FileBrowser);
        const browser = fixture.componentInstance;
        browser.session.state.set(newLegacyGame());
        browser.query.set('/OPERATIONS/CALL_QUEUE.LOG');
        fixture.detectChanges();
        const selected: string[] = [];
        browser.opened.subscribe(id => selected.push(id));
        expect(browser.files().map(file => file.id)).toEqual(['call']);
        fixture.nativeElement.querySelector('.file-row').click();
        expect(selected).toEqual(['call']);
        expect(browser.session.state().openFileIds).toEqual([]);
        fixture.destroy();
    });
    it('only searches clinical records after a legitimate review grants access', () => {
        const fixture = TestBed.createComponent(FileBrowser);
        const browser = fixture.componentInstance;
    browser.query.set(fileById('NE-106')!.path);
        expect(browser.files().some(file => file.id === 'NE-106')).toBe(false);
        const reviewed = SCENARIO_REVIEW_PATH.slice(0, 8).reduce((state, input) => runInput(state, input).state, newGame());
        TestBed.inject(Session).state.set(reviewed);
        expect(browser.files().some(file => file.id === 'NE-106')).toBe(true);
        fixture.destroy();
    });
});
