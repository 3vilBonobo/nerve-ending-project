import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';
import { Session } from './core/session';

describe('Meridian investigation UI', () => {
  beforeEach(() => { localStorage.clear(); TestBed.configureTestingModule({ imports: [App] }); });
  it('opens a simple client and surfaces a real queued call without later story names', async () => {
    const fixture = TestBed.createComponent(App); fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.setup-dialog')!.textContent).toContain('Read files and ask questions.');
    expect(element.querySelector('.setup-dialog')!.textContent).not.toMatch(/WebGPU|LANGUAGE MODULE/);
    fixture.componentInstance.start(); fixture.componentInstance.skipConnection(); fixture.detectChanges();
    expect(element.querySelector('#terminal-command')).not.toBeNull();
    expect(element.textContent).toContain('Outgoing call to NIGHT DESK: NO ANSWER');
    expect(element.textContent).not.toMatch(/MOTHER|Anna Voss|Site 6/);
    const session = TestBed.inject(Session);
    const reply = session.submit('STATUS'); session.playback.skip(); await reply; fixture.detectChanges();
    expect(element.textContent).toContain('LIVE MONITOR');
    expect(session.state().discoveredEvidenceIds).toContain('EV_SERVICE_ACTIVE'); fixture.destroy();
  });
  it('follows the attachment and reads its backup with the mouse, without terminal commands', () => {
    const fixture = TestBed.createComponent(App); const app = fixture.componentInstance;
    const element: HTMLElement = fixture.nativeElement;
    app.start(); app.skipConnection(); app.openFile('call'); fixture.detectChanges();
    element.querySelector<HTMLButtonElement>('[data-document="call"] .document-references button')!.click(); fixture.detectChanges();
    expect(app.session.state().lastFileId).toBe('ledger');
    const backup = element.querySelector<HTMLButtonElement>('[data-document="ledger"] .read-backup');
    expect(backup).not.toBeNull(); backup!.click(); fixture.detectChanges();
    expect(app.session.state().archive006Recovered).toBe(true);
    expect(app.session.state().act01Complete).toBe(true);
    expect(app.session.state().lastFileId).toBe('fragment');
    expect(app.showEnding()).toBe(false);
    expect(element.querySelector('[data-document="fragment"]')!.textContent).toContain('0417');
    element.querySelector<HTMLButtonElement>('.fragment-finish')!.click(); fixture.detectChanges();
    expect(element.textContent).not.toContain('End of current preview.');
    expect(element.querySelector('.operations-panel')?.textContent).toContain('VERIFY HANDOVER');
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
  it('shows the loading percentage on the start page while keeping play available', () => {
    const fixture = TestBed.createComponent(App); const app = fixture.componentInstance;
    app.session.language.state.update(state => ({ ...state, phase: 'loading', loaded: 12_500_000, total: 25_000_000 }));
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.setup-language')?.textContent).toContain('50%');
    expect(element.querySelector<HTMLProgressElement>('#start-model-progress')?.value).toBe(50);
    expect(element.querySelector<HTMLButtonElement>('.start-button')?.disabled).toBe(false);
    app.session.language.state.update(state => ({ ...state, phase: 'initializing', detail: 'Checking first question…' }));
    fixture.detectChanges();
    expect(element.querySelector('.setup-language')?.textContent).toContain('files loaded 100%');
    fixture.destroy();
  });
});
