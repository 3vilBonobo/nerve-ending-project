import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';
import { BITMAP_FILES } from './core/bitmap-records';
import { FILES } from './core/content';

const tick = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0));
beforeEach(() => { localStorage.clear(); TestBed.configureTestingModule({ imports: [App] }); });
const desktop = () => { const fixture = TestBed.createComponent(App); fixture.componentInstance.start(); fixture.componentInstance.skipConnection(); fixture.detectChanges(); return fixture; };

describe('bitmap records in the existing desktop', () => {
  it('opens from the file browser, closes with Escape and restores the previous document or terminal focus', async () => {
    const fixture = desktop(); const app = fixture.componentInstance; const element: HTMLElement = fixture.nativeElement;
    app.openFile('company'); fixture.detectChanges(); app.folder('/ARCHIVE'); fixture.detectChanges();
    const row = Array.from(element.querySelectorAll<HTMLButtonElement>('.file-row')).find(button => button.textContent?.includes('Demo employee portrait'))!;
    expect(row.textContent).toContain('BITMAP'); row.click(); fixture.detectChanges(); await tick();
    expect(app.mobileTab()).toBe('documents'); expect(element.querySelector('[data-document="demo-employee-bitmap"] img')).toBeTruthy();
    const viewport = element.querySelector<HTMLElement>('[data-document="demo-employee-bitmap"] .bitmap-screen')!;
    viewport.focus(); viewport.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); fixture.detectChanges(); await tick();
    expect(app.session.state().openFileIds).toEqual(['company']); expect(document.activeElement).toBe(element.querySelector('[data-document="company"] .document-shell'));
    element.querySelector<HTMLButtonElement>('[aria-label="Close Office notice"]')!.click(); fixture.detectChanges(); await tick();
    expect(app.mobileTab()).toBe('terminal'); expect(document.activeElement).toBe(element.querySelector('#terminal-command')); fixture.destroy();
  });
  it('supports terminal OPEN, return navigation, history and the next service command', async () => {
    const fixture = desktop(); const app = fixture.componentInstance; const element: HTMLElement = fixture.nativeElement;
    const input = `OPEN ${BITMAP_FILES[1].path}`; const request = app.session.submit(input); app.session.playback.skip(); await request; fixture.detectChanges();
    app.mobileTab.set('documents'); fixture.detectChanges();
    expect(element.querySelector('[data-document="demo-equipment-bitmap"] img')).toBeTruthy();
    element.querySelector<HTMLButtonElement>('[data-document="demo-equipment-bitmap"] .fragment-finish')!.click(); fixture.detectChanges(); await tick();
    const command = element.querySelector<HTMLInputElement>('#terminal-command')!;
    expect(document.activeElement).toBe(command); command.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })); fixture.detectChanges();
    expect(command.value).toBe(input);
    const status = app.session.submit('STATUS'); app.session.playback.skip(); await status; fixture.detectChanges();
    expect(app.session.state().terminalHistory.at(-1)?.lines.filter(line => /^00[1-8]  /.test(line))).toHaveLength(8);
    expect(app.session.state().knowledge).toEqual([]); expect(app.session.state().permissions).toEqual([]); fixture.destroy();
  });
  it('does not render a stale inaccessible record ID and retains text size / display settings', () => {
    const fixture = desktop(); const app = fixture.componentInstance;
    const protectedRecord = FILES.find(file => !!file.access)!;
    app.session.state.update(state => ({ ...state, openFileIds: [protectedRecord.id] })); fixture.detectChanges(); expect(app.documents()).toEqual([]);
    app.session.display(false, 1.25); app.openFile(BITMAP_FILES[2].id); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.app-surface').style.getPropertyValue('--font-scale')).toBe('1.25');
    expect(fixture.nativeElement.querySelector('.bitmap-screen').classList.contains('crt-enabled')).toBe(false);
    expect(app.session.state().investigation.status).toBe('dormant'); fixture.destroy();
  });
});
