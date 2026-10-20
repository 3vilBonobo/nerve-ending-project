import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { fileById } from './core/content';
import { Session } from './core/session';
import { Terminal } from './features/terminal/terminal';
import { FileBrowser } from './features/files/file-browser';
import { DocumentWindow } from './features/documents/document';
import { OllamaInterpreter } from './core/interpretation/providers';

interface InstallPromptEvent extends Event { prompt(): Promise<void>; userChoice: Promise<{ outcome: string }> }
@Component({ selector: 'ne-root', standalone: true, imports: [Terminal, FileBrowser, DocumentWindow], templateUrl: './app.html' })
export class App implements OnDestroy {
  readonly session = inject(Session);
  readonly stage = signal<'setup' | 'connecting' | 'desktop'>('setup');
  readonly mobileTab = signal<'terminal' | 'files' | 'documents'>('terminal');
  readonly explorer = signal(false);
  readonly connectionStep = signal(0);
  readonly showEnding = signal(false);
  readonly endAcknowledged = signal(false);
  readonly clock = signal('02:14:00');
  readonly online = signal(navigator.onLine);
  readonly cached = signal(false);
  readonly installPrompt = signal<InstallPromptEvent | null>(null);
  readonly installMessage = signal('Browser installation is optional. Use your browser menu if available.');
  readonly developerStatus = signal('Offline classifier selected.');
  readonly documents = computed(() => this.session.state().openFileIds.flatMap(id => { const file = fileById(id); return file ? [file] : []; }));
  readonly metricSummary = computed(() => {
    const rows = this.session.metrics();
    return { count: rows.length, fallback: rows.length ? Math.round(rows.filter(row => row.fallback).length / rows.length * 100) : 0, ms: rows.length ? Math.round(rows.reduce((sum, row) => sum + row.elapsedMs, 0) / rows.length) : 0 };
  });
  readonly connectionLines = ['CONNECTING...', 'REMOTE SYSTEM R-02 FOUND', 'CLIENT VERSION 3.14 CHECKED', 'EXTERNAL ACCESS ACCEPTED', 'LOADING COMPANY RECORDS', 'CONNECTION READY'];
  private connectionTimer?: ReturnType<typeof setInterval>;
  private readonly clockTimer: ReturnType<typeof setInterval>;
  private readonly installListener = (event: Event): void => { event.preventDefault(); this.installPrompt.set(event as InstallPromptEvent); };
  private readonly networkListener = (): void => { this.online.set(navigator.onLine); };

  constructor() {
    window.addEventListener('beforeinstallprompt', this.installListener);
    window.addEventListener('online', this.networkListener); window.addEventListener('offline', this.networkListener);
    let seconds = 0;
    this.clockTimer = setInterval(() => { seconds++; this.clock.set(`02:${String(14 + Math.floor(seconds / 60) % 46).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`); }, 1000);
    if ('serviceWorker' in navigator) navigator.serviceWorker.ready.then(registration => this.cached.set(!!registration.active)).catch(() => this.cached.set(false));
  }
  start(): void {
    if (this.session.state().hasStarted) { this.stage.set('desktop'); return; }
    this.session.start(); this.stage.set('connecting'); this.connectionStep.set(0);
    this.connectionTimer = setInterval(() => {
      if (this.connectionStep() >= 5) this.skipConnection();
      else this.connectionStep.update(step => step + 1);
    }, 3000);
  }
  skipConnection(): void { clearInterval(this.connectionTimer); this.stage.set('desktop'); }
  openFile(id: string): void {
    this.session.openFile(id); this.mobileTab.set('documents'); this.explorer.set(false);
    this.session.terminalMode('restored');
    setTimeout(() => document.querySelector<HTMLElement>(`[data-document="${id}"] .document-shell`)?.focus());
  }
  terminal(): void {
    this.session.terminalMode(this.session.state().ui.terminalMode === 'minimized' ? 'restored' : this.session.state().ui.terminalMode);
    this.mobileTab.set('terminal');
    setTimeout(() => document.querySelector<HTMLInputElement>('#terminal-command')?.focus());
  }
  folder(path: string): void { this.session.directory(path); this.explorer.set(true); this.mobileTab.set('files'); if (this.session.state().ui.terminalMode === 'maximized') this.session.terminalMode('restored'); }
  review(): void { this.endAcknowledged.set(true); this.showEnding.set(false); }
  restart(): void { this.session.reset(); this.endAcknowledged.set(false); this.showEnding.set(false); this.stage.set('setup'); this.explorer.set(false); this.mobileTab.set('terminal'); }
  async install(): Promise<void> {
    const prompt = this.installPrompt();
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    this.installMessage.set(choice.outcome === 'accepted' ? 'Browser installation accepted.' : 'Installation dismissed. Browser play remains available.');
    this.installPrompt.set(null);
  }
  setProvider(endpoint: string, model: string): void {
    if (!this.session.developerMode) return;
    try {
      this.session.provider = new OllamaInterpreter(endpoint, model);
      this.developerStatus.set(`Ollama selected: ${model || '(model not supplied)'}. Failed queries fall back offline.`);
    } catch (error) { this.developerStatus.set(error instanceof Error ? error.message : 'Invalid endpoint.'); }
  }
  fallback(): void { this.session.provider = undefined; this.developerStatus.set('Offline classifier selected.'); }
  ngOnDestroy(): void {
    clearInterval(this.clockTimer); clearInterval(this.connectionTimer);
    window.removeEventListener('beforeinstallprompt', this.installListener);
    window.removeEventListener('online', this.networkListener); window.removeEventListener('offline', this.networkListener);
  }
}
