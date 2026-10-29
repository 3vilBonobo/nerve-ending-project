import { Injectable, OnDestroy, signal } from '@angular/core';
import { BrowserAIInterpreter } from './browser-ai';
import { emptyLanguageState } from './language-protocol';
const PREFERENCE = 'nerve-ending.local-questions.v1';
@Injectable({ providedIn: 'root' })
export class LocalLanguage implements OnDestroy {
    readonly state = signal(emptyLanguageState());
    private interpreter?: BrowserAIInterpreter;
    private destroyed = false;
    get provider(): BrowserAIInterpreter | undefined { return this.state().phase === 'ready' ? this.interpreter : undefined; }
    constructor() {
        try {
            if (localStorage.getItem(PREFERENCE) === 'enabled')
                queueMicrotask(() => this.enable());
        }
        catch { /* Current-visit use remains possible. */ }
    }
    enable(): void {
        if (this.destroyed)
            return;
        if (['loading', 'initializing', 'ready'].includes(this.state().phase))
            return;
        if (typeof Worker === 'undefined' || typeof WebAssembly === 'undefined') {
            this.state.update(state => ({ ...state, phase: 'unsupported' }));
            return;
        }
        try {
            localStorage.setItem(PREFERENCE, 'enabled');
        }
        catch { /* Preference is optional. */ }
        this.interpreter?.dispose();
        this.interpreter = new BrowserAIInterpreter(state => this.state.set(state));
        this.interpreter.load(new URL('language/v1/', document.baseURI).href);
    }
    disable(): void {
        this.interpreter?.dispose();
        this.interpreter = undefined;
        this.state.set(emptyLanguageState());
        try {
            localStorage.removeItem(PREFERENCE);
        }
        catch { /* Current-visit setting still applies. */ }
    }
    ngOnDestroy(): void { this.destroyed = true; this.interpreter?.dispose(); }
}
