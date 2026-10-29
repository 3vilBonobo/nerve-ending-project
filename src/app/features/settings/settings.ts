import { Component, ElementRef, OnDestroy, computed, inject, signal, viewChild } from '@angular/core';
import { Session } from '../../core/state/session';
import { OllamaInterpreter } from '../../core/interpretation/providers';
import { QaPanel } from '../qa-panel/qa-panel';
interface InstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{
        outcome: string;
    }>;
}
/** Browser preferences and diagnostics; this component never grants gameplay permissions. */
@Component({ selector: 'ne-settings', standalone: true, imports: [QaPanel], templateUrl: './settings.html' })
export class Settings implements OnDestroy {
    readonly session = inject(Session);
    private readonly panel = viewChild.required<ElementRef<HTMLDialogElement>>('panel');
    readonly cached = signal(false);
    readonly installPrompt = signal<InstallPromptEvent | null>(null);
    readonly installMessage = signal('Browser installation is optional. Use your browser menu if available.');
    readonly developerStatus = signal('Offline classifier selected.');
    readonly modelPercent = computed(() => {
        const state = this.session.language.state();
        return Math.min(100, Math.floor(state.total ? state.loaded / state.total * 100 : 0));
    });
    readonly metricSummary = computed(() => {
        const rows = this.session.metrics();
        return { count: rows.length, fallback: rows.length ? Math.round(rows.filter(row => row.fallback).length / rows.length * 100) : 0, ms: rows.length ? Math.round(rows.reduce((sum, row) => sum + row.elapsedMs, 0) / rows.length) : 0 };
    });
    private readonly installListener = (event: Event): void => {
        event.preventDefault();
        this.installPrompt.set(event as InstallPromptEvent);
    };
    async install(): Promise<void> {
        const prompt = this.installPrompt();
        if (!prompt)
            return;
        await prompt.prompt();
        const choice = await prompt.userChoice;
        this.installMessage.set(choice.outcome === 'accepted' ? 'Browser installation accepted.' : 'Installation dismissed. Browser play remains available.');
        this.installPrompt.set(null);
    }
    setProvider(endpoint: string, model: string): void {
        if (!this.session.developerMode)
            return;
        try {
            this.session.provider = new OllamaInterpreter(endpoint, model);
            this.developerStatus.set(`Ollama selected: ${model || '(model not supplied)'}. Failed queries fall back offline.`);
        }
        catch (error) {
            this.developerStatus.set(error instanceof Error ? error.message : 'Invalid endpoint.');
        }
    }
    fallback(): void {
        this.session.provider = undefined;
        this.developerStatus.set('Offline classifier selected.');
    }
    constructor() {
        window.addEventListener('beforeinstallprompt', this.installListener);
        if ('serviceWorker' in navigator)
            navigator.serviceWorker.ready.then(registration => this.cached.set(!!registration.active)).catch(() => this.cached.set(false));
    }
    open(): void {
        this.panel().nativeElement.showModal();
    }
    close(): void {
        this.panel().nativeElement.close();
    }
    ngOnDestroy(): void {
        window.removeEventListener('beforeinstallprompt', this.installListener);
    }
}
