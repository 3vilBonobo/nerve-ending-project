import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';
import { Session } from './core/session';

describe('Meridian client UI', () => {
  beforeEach(() => { localStorage.clear(); TestBed.configureTestingModule({ imports: [App] }); });
  it('starts without a model and exposes terminal controls without story spoilers', async () => {
    const fixture = TestBed.createComponent(App); fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('No account, installation, or AI download required.');
    expect(element.textContent).not.toMatch(/MOTHER|Anna Voss|Site 6/);
    fixture.componentInstance.start(); fixture.componentInstance.skipConnection(); fixture.detectChanges();
    expect(element.querySelector('#terminal-command')).not.toBeNull();
    expect(element.querySelector('[aria-label="Restore terminal"]')).not.toBeNull();
    await TestBed.inject(Session).submit('STATUS'); fixture.detectChanges();
    expect(element.textContent).toContain('SERVICE 006: ACTIVE'); fixture.destroy();
  });
  it('uses one state for file browsing and terminal recovery, with explicit fragment review', async () => {
    const fixture = TestBed.createComponent(App); const app = fixture.componentInstance;
    app.start(); app.skipConnection();
    for (const id of ['register', 'ledger', 'repair']) app.openFile(id);
    await app.session.submit('RECOVER ARCHIVE 006'); app.openFile('fragment'); fixture.detectChanges();
    expect(app.session.state().act01Complete).toBe(true); expect(app.showEnding()).toBe(false);
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.fragment-finish');
    expect(button).not.toBeNull(); button!.click(); fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('End of prototype.');
    app.review(); expect(app.showEnding()).toBe(false); fixture.destroy();
  });
});
