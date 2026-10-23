import { TestBed } from '@angular/core/testing';
import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QaPanel } from './qa-panel';
import { QA_STORE_FACTORY } from '../../core/qa/telemetry';
import { openQaDatabase } from '../../core/qa/database';
import { Session } from '../../core/session';

describe('playtest QA panel', () => {
  beforeEach(async () => {
    localStorage.clear(); const store = await openQaDatabase(new IDBFactory());
    TestBed.configureTestingModule({ imports: [QaPanel], providers: [{ provide: QA_STORE_FACTORY, useValue: () => Promise.resolve(store) }] });
  });
  it('starts unchecked, explains retention and exposes opt-in export and feedback controls', async () => {
    const fixture = TestBed.createComponent(QaPanel); const panel = fixture.componentInstance;
    await panel.qa.ready; fixture.detectChanges(); const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector<HTMLInputElement>('#qa-toggle')!.checked).toBe(false);
    expect(element.textContent).toContain('Disabled until you opt in'); expect(element.textContent).toContain('Nothing is uploaded');
    expect(element.textContent).toContain('Downloads');
    expect(element.querySelectorAll('.qa-actions button:disabled').length).toBe(3);
    await panel.toggle(true); fixture.detectChanges();
    expect(element.querySelector<HTMLInputElement>('#qa-toggle')!.checked).toBe(true);
    expect(element.querySelectorAll('.qa-actions button:disabled').length).toBe(0);
    await panel.toggle(false); fixture.detectChanges();
    expect(panel.qa.storedEvents()).toBe(2); fixture.destroy();
  });
  it('downloads JSONL and supports manual copy when the clipboard is unavailable', async () => {
    const fixture = TestBed.createComponent(QaPanel); const panel = fixture.componentInstance;
    await panel.qa.ready; await panel.toggle(true); fixture.detectChanges();
    const url = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:qa-test');
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) { expect(this.download).toMatch(/\.jsonl$/); });
    try {
      await panel.download('current'); expect(url).toHaveBeenCalledOnce(); expect(click).toHaveBeenCalledOnce(); expect(panel.message()).toContain('Downloads');
      await panel.copy(); fixture.detectChanges();
      expect(panel.copyText()).toContain('qa_enabled'); expect(fixture.nativeElement.querySelector('#qa-copy')).not.toBeNull();
    } finally { url.mockRestore(); revoke.mockRestore(); click.mockRestore(); fixture.destroy(); }
  });
  it('saves tagged response feedback and confirms clearing without changing the investigation', async () => {
    const fixture = TestBed.createComponent(QaPanel); const panel = fixture.componentInstance; const session = TestBed.inject(Session);
    await panel.qa.ready; await panel.toggle(true);
    const reply = session.submit('Who are you?'); session.playback.skip(); await reply; await panel.qa.flush(); fixture.detectChanges();
    const before = structuredClone(session.state()); const response = panel.qa.responses()[0];
    expect(panel.responsePreview()).not.toBe('');
    expect(fixture.nativeElement.querySelector('.qa-response-preview')?.textContent).toBe(panel.responsePreview());
    const note: HTMLTextAreaElement = fixture.nativeElement.querySelector('#qa-feedback-note'); note.value = 'The source was useful.';
    await panel.feedback(response.id, 'effective', note); expect(panel.qa.stats().feedback).toBe(1); expect(note.value).toBe('');
    await panel.clear(); expect(panel.qa.storedEvents()).toBeGreaterThan(0);
    panel.confirmClear.set(true); await panel.clear(); fixture.detectChanges();
    expect(panel.qa.storedEvents()).toBe(0); expect(panel.qa.enabled()).toBe(false); expect(session.state()).toEqual(before);
    expect(panel.message()).toContain('Investigation progress is retained'); fixture.destroy();
  });
});
