import { Settings } from '../features/settings/settings';
import { Component, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { Session } from '../core/state/session';
import { Welcome } from '../features/welcome/welcome';
import { Terminal } from '../features/terminal/terminal';
import { FileBrowser } from '../features/file-browser/file-browser';
import { DocumentWindow } from '../features/records/document-window/document';
import { endingText } from '../core/engine/story/continuation';
import { KNOWLEDGE_LABELS } from '../core/engine/conversation/dialogue';
import type { QaSource } from '../core/qa/types';
import { caseClock, caseFindings } from '../core/state/scenario-state';
import { Journal } from '../features/journal/journal';
@Component({ selector: 'ne-root', standalone: true, imports: [Terminal, FileBrowser, DocumentWindow, Settings, Welcome, Journal], templateUrl: './app.html' })
export class App implements OnDestroy {
    readonly session = inject(Session);
    readonly stage = signal<'setup' | 'connecting' | 'desktop'>('setup');
    readonly mobileTab = signal<'terminal' | 'files' | 'documents'>('terminal');
    readonly explorer = signal(false);
    readonly journalOpen = signal(false);
    closeJournal(): void {
        this.journalOpen.set(false);
        setTimeout(() => document.querySelector<HTMLElement>('#journal-button')?.focus());
    }
    journalFile(id: string): void {
        this.journalOpen.set(false);
        this.openFile(id, 'evidence-button');
    }
    readonly connectionStep = signal(0);
    readonly showEnding = signal(false);
    readonly endAcknowledged = signal(false);
    readonly finalText = computed(() => endingText(this.session.state()));
    readonly findings = computed(() => this.session.state().scenario ? caseFindings(this.session.state().scenario!) : this.session.state().knowledge.map(k => KNOWLEDGE_LABELS[k]));
    readonly clock = signal('02:14:00');
    readonly displayedClock = computed(() => this.session.state().scenario ? caseClock(this.session.state().scenario!) : '2003-11-06 ' + this.clock());
    readonly online = signal(navigator.onLine);
    readonly documents = computed(() => this.session.state().openFileIds.flatMap(id => {
        const file = this.session.files().find(record => record.id === id);
        return file ? [file] : [];
    }));
    readonly connectionLines = ['CONNECTING...', 'REMOTE SYSTEM R-02 FOUND', 'CLIENT VERSION 2.04 CHECKED', 'EXTERNAL ACCESS ACCEPTED', 'LOADING COMPANY RECORDS', 'CONNECTION READY'];
    private connectionTimer?: ReturnType<typeof setInterval>;
    private readonly clockTimer: ReturnType<typeof setInterval>;
    private readonly networkListener = (): void => {
        this.online.set(navigator.onLine);
    };
    constructor() {
        effect(() => {
            if ((this.session.state().operating.endingId || this.session.state().scenario?.outcome) && !this.endAcknowledged())
                this.showEnding.set(true);
        });
        window.addEventListener('online', this.networkListener);
        window.addEventListener('offline', this.networkListener);
        let seconds = 0;
        this.clockTimer = setInterval(() => {
            seconds++;
            this.clock.set(`02:${String(14 + Math.floor(seconds / 60) % 46).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`);
        }, 1000);
    }
    start(): void {
        if (this.session.state().hasStarted) {
            this.session.resume();
            this.stage.set('desktop');
            return;
        }
        this.session.start();
        this.stage.set('connecting');
        this.connectionStep.set(0);
        this.connectionTimer = setInterval(() => {
            if (this.connectionStep() >= 5)
                this.skipConnection();
            else
                this.connectionStep.update(step => step + 1);
        }, 400);
    }
    skipConnection(): void {
        clearInterval(this.connectionTimer);
        this.stage.set('desktop');
    }
    openFile(id: string, source: QaSource = 'record-link'): void {
        this.session.openFile(id, source);
        if (!this.documents().some(file => file.id === id))
            return;
        this.mobileTab.set('documents');
        this.explorer.set(false);
        this.session.terminalMode('restored');
        setTimeout(() => document.querySelector<HTMLElement>(`[data-document="${id}"] .document-shell`)?.focus());
    }
    closeRecord(id: string): void {
        this.session.closeFile(id);
        const previous = this.documents().at(-1);
        if (previous)
            setTimeout(() => document.querySelector<HTMLElement>(`[data-document="${previous.id}"] .document-shell`)?.focus());
        else
            this.terminal();
    }
    terminal(): void {
        this.session.terminalMode(this.session.state().ui.terminalMode === 'minimized' ? 'restored' : this.session.state().ui.terminalMode);
        this.mobileTab.set('terminal');
        setTimeout(() => document.querySelector<HTMLInputElement>('#terminal-command')?.focus());
    }
    folder(path: string): void {
        this.session.directory(path);
        this.explorer.set(true);
        this.mobileTab.set('files');
        if (this.session.state().ui.terminalMode === 'maximized')
            this.session.terminalMode('restored');
    }
    review(): void {
        this.endAcknowledged.set(true);
        this.showEnding.set(false);
    }
    restart(): void {
        this.session.reset();
        this.endAcknowledged.set(false);
        this.showEnding.set(false);
        this.stage.set('setup');
        this.explorer.set(false);
        this.mobileTab.set('terminal');
    }
    ngOnDestroy(): void {
        clearInterval(this.clockTimer);
        clearInterval(this.connectionTimer);
        window.removeEventListener('online', this.networkListener);
        window.removeEventListener('offline', this.networkListener);
    }
}
