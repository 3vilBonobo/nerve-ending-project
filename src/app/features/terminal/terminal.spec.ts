import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Session } from '../../core/session';
import { Interpretation } from '../../core/models';
import { SAVE_KEY, decodeSave } from '../../core/persistence/saves';
import { Terminal } from './terminal';

describe('terminal reply playback', () => {
  beforeEach(() => {
    vi.useFakeTimers(); localStorage.clear();
    TestBed.configureTestingModule({ imports: [Terminal] });
  });
  afterEach(() => { TestBed.resetTestingModule(); vi.useRealTimers(); vi.unstubAllGlobals(); });

  it('echoes input, waits, prints gradually, and saves a complete answer during playback', async () => {
    const fixture = TestBed.createComponent(Terminal);
    const terminal = fixture.componentInstance;
    const session = TestBed.inject(Session);
    const element: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    terminal.input = 'Who are you?';
    const pending = terminal.submit(); fixture.detectChanges();
    expect(element.querySelector('.pending-entry')?.textContent).toContain('Who are you?');
    expect(element.querySelector('.processing')?.textContent).toContain('WORKING');
    expect(session.state().terminalHistory).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(649);
    expect(session.playback.current()?.phase).toBe('processing');
    await vi.advanceTimersByTimeAsync(200); fixture.detectChanges();
    const progress = session.playback.current();
    expect(progress?.phase).toBe('printing');
    const full = session.state().terminalHistory.at(-1)!;
    if (progress?.phase !== 'printing') throw new Error('Expected a partially printed reply');
    expect(progress.visibleText.length).toBeGreaterThan(0);
    expect(progress.visibleText.length).toBeLessThan(full.lines.join('\n').length);
    expect(element.querySelectorAll('.terminal-entry:last-of-type .record-link')).toHaveLength(0);
    expect(element.querySelector('.reply-caret')).not.toBeNull();
    expect(decodeSave(localStorage.getItem(SAVE_KEY)).state.terminalHistory.at(-1)).toEqual(full);
    await session.submit('STATUS');
    expect(session.state().terminalHistory.at(-1)!.input).toBe('Who are you?');
    element.querySelector('input')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await pending; fixture.detectChanges();
    expect(session.busy()).toBe(false);
    expect(element.textContent).toContain('No staff terminal is connected.');
    expect(element.querySelector('.terminal-entry:last-of-type .record-link')).toBeNull();
    expect(element.querySelector('.terminal-entry:last-of-type .record-reference')?.textContent).toContain('/SYSTEM/READ_FIRST.TXT');
    fixture.destroy();
  });

  it('can skip the pause and finishes a long answer within a bounded time', async () => {
    const session = TestBed.inject(Session);
    const skipped = session.submit('HELP');
    session.playback.skip(); await skipped;
    expect(session.busy()).toBe(false);
    const longReply = session.submit('HELP');
    await vi.advanceTimersByTimeAsync(9000); await longReply;
    expect(session.busy()).toBe(false);
    expect(session.state().terminalHistory.at(-1)!.lines.join('\n')).toContain('Up/Down');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keeps a real pending request busy after skipping, without adding another fake delay', async () => {
    const session = TestBed.inject(Session);
    let deliver!: (value: Interpretation) => void;
    session.provider = {
      id: 'test', isAvailable: async () => true,
      interpret: () => new Promise(resolve => { deliver = resolve; }),
    };
    const pending = session.submit('Who are you?');
    await vi.advanceTimersByTimeAsync(1000);
    session.playback.skip();
    expect(session.busy()).toBe(true);
    deliver({ intent: 'ask_identity', provider: 'fallback', needsClarification: false });
    await pending;
    expect(session.busy()).toBe(false);
    expect(session.state().terminalHistory.at(-1)!.input).toBe('Who are you?');
  });

  it('does not let an old pending request overwrite or unlock a new session', async () => {
    const session = TestBed.inject(Session);
    let deliver!: (value: Interpretation) => void;
    session.provider = {
      id: 'test', isAvailable: async () => true,
      interpret: () => new Promise(resolve => { deliver = resolve; }),
    };
    const oldReply = session.submit('Why is service 006 active?');
    await vi.advanceTimersByTimeAsync(50);
    session.reset();
    const newReply = session.submit('HELP');
    deliver({ intent: 'ask_service_status', entityId: 'service-006', provider: 'fallback', needsClarification: false });
    await oldReply;
    expect(session.busy()).toBe(true);
    await vi.advanceTimersByTimeAsync(700);
    expect(session.state().terminalHistory.at(-1)!.input).toBe('HELP');
    expect(session.state().discoveredEvidenceIds).toHaveLength(0);
    session.playback.skip(); await newReply;
    expect(session.state().terminalHistory).toHaveLength(2);
  });

  it('shows replies immediately when reduced motion is requested', async () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
    const session = TestBed.inject(Session);
    await session.submit('HELP');
    expect(session.busy()).toBe(false);
    expect(session.state().terminalHistory.at(-1)!.lines.join('\n')).toContain('TERMINAL HELP');
  });
});
