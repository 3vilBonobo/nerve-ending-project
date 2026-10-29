import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';
import { Session } from './core/session';
import { newLegacyGame as newGame, runInput } from './core/engine/game';
import { INVESTIGATION_PATH } from './core/engine/playthroughs';
import { actOf } from './core/engine/continuation';

describe('Meridian investigation UI', () => {
  it('shows a reviewable final warning and ending even when the optional model is unavailable', async () => {
    const fixture = TestBed.createComponent(App); const app = fixture.componentInstance;
    app.session.state.set(INVESTIGATION_PATH.reduce((s,input) => runInput(s,input).state, newGame()));
    const unavailable = vi.fn(async () => { throw new Error('model unavailable'); });
    app.session.provider = { id: 'unavailable', isAvailable: async () => false, interpret: unavailable };
    app.start(); app.skipConnection(); fixture.detectChanges();
    const request = app.session.submit('RELEASE PATIENT'); app.session.playback.skip(); await request; fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('[role="alertdialog"]')?.textContent).toContain('She will die');
    expect(app.session.state().operating.annaBiologicallyAlive).toBe(true);
    const confirmation = app.session.submit('CONFIRM OPERATION'); app.session.playback.skip(); await confirmation; fixture.detectChanges();
    expect(element.querySelector('.ending-card')?.textContent).toContain('MERCY / PROPAGATION');
    expect(element.querySelector('.ending-card')?.textContent).toContain('no external receipt');
    expect(unavailable).not.toHaveBeenCalled();
    app.review(); fixture.detectChanges(); expect(element.querySelector('.ending-card')).toBeNull();
    fixture.destroy();
  });
  beforeEach(() => { localStorage.clear(); TestBed.configureTestingModule({ imports: [App] }); });
  it('opens a neutral client and lets the player request service status', async () => {
    const fixture = TestBed.createComponent(App); fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('ne-welcome')!.textContent).toContain('Read files and ask questions.');
    expect(element.querySelector('ne-welcome')!.textContent).not.toMatch(/WebGPU|LANGUAGE MODULE/);
    fixture.componentInstance.start(); fixture.componentInstance.skipConnection(); fixture.detectChanges();
    expect(element.querySelector('#terminal-command')).not.toBeNull();
    expect(element.textContent).toContain('REMOTE ACCESS CLIENT 2.04');
    expect(element.textContent).not.toMatch(/Outgoing call|NIGHT DESK|NO ANSWER|006/);
    expect(element.textContent).not.toMatch(/MOTHER|Anna Voss|Site 6/);
    const session = TestBed.inject(Session);
    const reply = session.submit('STATUS'); session.playback.skip(); await reply; fixture.detectChanges();
    expect(element.textContent).toContain('REGISTERED SERVICES');
    expect(session.state().discoveredEvidenceIds).toContain('EV_SERVICE_ACTIVE'); fixture.destroy();
  });
  it('keeps document references inert and browsing controls unable to solve the investigation', async () => {
    const fixture = TestBed.createComponent(App); const app = fixture.componentInstance;
    const element: HTMLElement = fixture.nativeElement;
    app.start(); app.skipConnection(); app.openFile('call'); fixture.detectChanges();
    expect(element.querySelector('[data-document="call"] .document-references button')).toBeNull();
    expect(element.querySelector('.record-links button')).toBeNull();
    app.openFile('ledger'); fixture.detectChanges();
    expect(app.session.state().lastFileId).toBe('ledger');
    const backup = element.querySelector<HTMLButtonElement>('[data-document="ledger"] .read-backup');
    expect(backup).toBeNull();
    const read = app.session.submit('READ /ARCHIVE/HANDOVER_006.BAK'); app.session.playback.skip(); await read; fixture.detectChanges();
    expect(app.session.state().archive006Recovered).toBe(true);
    expect(app.session.state().act01Complete).toBe(false);
    expect(app.session.state().knowledge).toEqual([]); expect(app.session.state().permissions).toEqual([]);
    expect(app.session.state().lastFileId).toBe('fragment');
    expect(app.showEnding()).toBe(false);
    expect(element.querySelector('[data-document="fragment"]')!.textContent).toContain('0417');
    element.querySelector<HTMLButtonElement>('.fragment-finish')!.click(); fixture.detectChanges();
    expect(element.textContent).not.toContain('End of current preview.');
    expect(element.querySelector('.operations-panel')).toBeNull();
    app.review(); expect(app.showEnding()).toBe(false); fixture.destroy();
  });
  it('keeps a storage warning if a new session cannot be saved after reset', () => {
    const session = TestBed.inject(Session);
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Quota'); });
    try {
      session.reset();
      expect(session.storageWarning()).toContain('unavailable or full');
      expect(session.state().hasStarted).toBe(false);
    } finally { write.mockRestore(); }
  });
  it('cannot solve the opening by visiting every browser record and clicking terminal controls', async () => {
    const fixture = TestBed.createComponent(App); const app = fixture.componentInstance;
    const element: HTMLElement = fixture.nativeElement;
    app.start(); app.skipConnection(); fixture.detectChanges();
    for (let pass = 0; pass < 2; pass++) for (const file of [...app.session.files()]) {
      app.folder(file.path.slice(0, file.path.lastIndexOf('/'))); fixture.detectChanges();
      const row = Array.from(element.querySelectorAll<HTMLButtonElement>('.browser-items .file-row')).find(b => b.textContent?.includes(file.title));
      expect(row, file.id).toBeTruthy(); row!.click(); fixture.detectChanges();
      expect(element.querySelector('[data-document="ledger"] .read-backup')).toBeNull();
      expect(element.querySelector('.document-references button')).toBeNull();
      expect(element.querySelector('.record-links button')).toBeNull();
      expect(element.querySelector('.operations-panel')).toBeNull();
    }
    app.terminal(); fixture.detectChanges();
    for (const label of ['Minimize terminal', 'Restore terminal', 'Maximize terminal']) {
      element.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)?.click(); fixture.detectChanges(); app.terminal(); fixture.detectChanges();
    }
    const original = app.session.submit.bind(app.session); const requests: Promise<void>[] = [];
    const submit = vi.spyOn(app.session, 'submit').mockImplementation((input, source) => { const request = original(input, source); requests.push(request); return request; });
    element.querySelector<HTMLButtonElement>('.terminal-toolbar button')!.click(); app.session.playback.skip(); await Promise.all(requests); submit.mockRestore();
    expect(app.session.state().archive006Recovered).toBe(false);
    expect(app.session.state().permissions).toEqual([]); expect(app.session.state().knowledge).toEqual([]);
    expect(actOf(app.session.state())).toBe(1); expect(app.session.state().operating.endingId).toBeUndefined(); fixture.destroy();
  });
  it('shows the loading percentage in settings while keeping play available', () => {
    const fixture = TestBed.createComponent(App); const app = fixture.componentInstance;
    app.session.language.state.update(state => ({ ...state, phase: 'loading', loaded: 12_500_000, total: 25_000_000 }));
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.language-settings')?.textContent).toContain('50%');
    expect(element.querySelector<HTMLProgressElement>('.language-settings progress')?.value).toBe(50);
    expect(element.querySelector<HTMLButtonElement>('.start-button')?.disabled).toBe(false);
    app.session.language.state.update(state => ({ ...state, phase: 'initializing', detail: 'Checking first question…' }));
    fixture.detectChanges();
    expect(element.querySelector('.language-settings')?.textContent).toContain('100% FILES LOADED');
    fixture.destroy();
  });
});
