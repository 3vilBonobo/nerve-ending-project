import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { TerminalEntry } from '../models';
export type ReplyProgress = {
    phase: 'processing';
    input: string;
} | {
    phase: 'printing';
    input: string;
    entry: TerminalEntry;
    visibleText: string;
};
/** Temporary display state. Complete answers, not animation frames, go into saves. */
@Injectable({ providedIn: 'root' })
export class TerminalPlayback implements OnDestroy {
    private readonly progress = signal<ReplyProgress | null>(null);
    readonly current = this.progress.asReadonly();
    readonly busy = computed(() => this.current() !== null);
    private timer?: ReturnType<typeof setTimeout>;
    private releasePause?: () => void;
    private releasePrinting?: () => void;
    private instant = false;
    begin(input: string): Promise<void> {
        this.cancel();
        this.instant = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.progress.set({ phase: 'processing', input });
        if (this.instant)
            return Promise.resolve();
        return new Promise(resolve => {
            this.releasePause = resolve;
            this.timer = setTimeout(() => {
                this.timer = undefined;
                this.releasePause = undefined;
                resolve();
            }, 650);
        });
    }
    print(entry: TerminalEntry): Promise<void> {
        if (!this.current() || this.instant || !entry.lines.join('\n')) {
            this.finish();
            return Promise.resolve();
        }
        const characters = Array.from(entry.lines.join('\n'));
        const step = Math.max(2, Math.ceil(characters.length / 290));
        const started = Date.now();
        let position = 0;
        this.progress.set({ phase: 'printing', input: entry.input, entry, visibleText: '' });
        return new Promise(resolve => {
            this.releasePrinting = resolve;
            const tick = (): void => {
                if (this.current()?.phase !== 'printing')
                    return;
                const end = Math.min(characters.length, position + step);
                const chunk = characters.slice(position, end).join('');
                position = end;
                if (position >= characters.length || Date.now() - started >= 8000) {
                    this.finish();
                    return;
                }
                this.progress.set({ phase: 'printing', input: entry.input, entry, visibleText: characters.slice(0, position).join('') });
                // Brief pauses between lines give the output the rhythm of a slow terminal.
                this.timer = setTimeout(tick, chunk.includes('\n') ? 120 : /[.!?]$/.test(chunk) ? 65 : 24);
            };
            this.timer = setTimeout(tick, 24);
        });
    }
    skip(): void {
        this.instant = true;
        if (this.current()?.phase === 'processing') {
            clearTimeout(this.timer);
            this.timer = undefined;
            const release = this.releasePause;
            this.releasePause = undefined;
            release?.();
        }
        else
            this.finish();
    }
    cancel(): void { this.finish(); this.instant = false; }
    private finish(): void {
        clearTimeout(this.timer);
        this.timer = undefined;
        this.progress.set(null);
        const pause = this.releasePause;
        const printing = this.releasePrinting;
        this.releasePause = undefined;
        this.releasePrinting = undefined;
        pause?.();
        printing?.();
    }
    ngOnDestroy(): void { this.cancel(); }
}
