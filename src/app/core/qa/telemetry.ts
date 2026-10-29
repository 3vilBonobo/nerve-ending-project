import { Injectable, InjectionToken, OnDestroy, computed, inject, signal } from '@angular/core';
import type { GameState, Interpretation, Transition } from '../models';
import type { InterpretationMetrics } from '../interpretation/providers';
import { openQaDatabase, QaStore } from './database';
import { makeQaDraft, QaInteraction, QaObservation, qaInteraction, transitionObservations } from './events';
import { scrubQa } from './privacy';
import { APPLICATION_VERSION, FEEDBACK_TAGS, FeedbackTag, QaEvent, QaSession, QaSource, emptyQaStats, qaGameKey, qaId } from './types';
export const QA_STORE_FACTORY = new InjectionToken<() => Promise<QaStore>>('QA IndexedDB factory', { providedIn: 'root', factory: () => () => openQaDatabase() });
export function qaJsonLines(events: readonly QaEvent[]): string {
    return [...events].sort((a, b) => a.order - b.order).map(e => JSON.stringify({ ...e, data: scrubQa(e.data) })).join('\n') + (events.length ? '\n' : '');
}
@Injectable({ providedIn: 'root' })
export class QaTelemetry implements OnDestroy {
    private readonly factory = inject(QA_STORE_FACTORY);
    private readonly instanceId = qaId();
    private store?: QaStore;
    private context?: GameState;
    private destroyed = false;
    private failed = false;
    private jobs: Promise<void>;
    readonly ready: Promise<void>;
    readonly enabled = signal(false);
    readonly loading = signal(true);
    readonly warning = signal('');
    readonly sessions = signal<QaSession[]>([]);
    readonly recent = signal<QaEvent[]>([]);
    readonly currentKey = signal('');
    readonly version = APPLICATION_VERSION;
    readonly currentSession = computed(() => this.sessions().find(s => s.gameKey === this.currentKey()));
    readonly stats = computed(() => this.currentSession()?.stats ?? emptyQaStats());
    readonly storedEvents = computed(() => this.sessions().reduce((n, s) => n + s.eventCount, 0));
    readonly responses = computed(() => this.recent().filter(e => e.type === 'response_selected').slice(-30).reverse());
    constructor() {
        this.ready = this.initialize();
        this.jobs = this.ready;
    }
    private async initialize(): Promise<void> {
        try {
            this.store = await this.factory();
            if (this.destroyed) {
                this.store.close();
                return;
            }
            this.enabled.set(await this.store.enabled());
            await this.refresh();
            if (this.enabled() && this.context?.hasStarted)
                this.record(this.context, 'session_resumed', { reason: 'client-loaded', recordingContinues: true });
        }
        catch {
            this.enabled.set(false);
            this.warning.set('Local QA storage is unavailable. Recording is off; gameplay continues.');
            this.failed = true;
        }
        finally {
            this.loading.set(false);
        }
    }
    observe(state: GameState): void { this.context = state; if (qaGameKey(state) !== this.currentKey()) {
        this.currentKey.set(qaGameKey(state));
        this.recent.set([]);
        if (this.store)
            this.enqueue(() => this.refresh());
    } }
    private enqueue(job: () => Promise<void>): void {
        this.jobs = this.jobs.then(async () => { if (!this.failed)
            await job(); }).catch(() => {
            this.failed = true;
            this.enabled.set(false);
            this.warning.set('A QA write failed. Recording has stopped to avoid an incomplete log. Gameplay is unaffected; previously saved events can still be exported.');
            void this.store?.commit('', [], false).catch(() => { });
        });
    }
    async flush(): Promise<void> { await this.jobs; }
    private async refresh(): Promise<void> {
        if (!this.store)
            return;
        const sessions = await this.store.sessions();
        this.sessions.set(sessions);
        const current = sessions.find(s => s.gameKey === this.currentKey());
        this.recent.set(current ? await this.store.events(current.id, 200) : []);
    }
    async setEnabled(enabled: boolean, state: GameState): Promise<void> {
        await this.ready;
        this.observe(state);
        if (!this.store || this.failed || this.destroyed || enabled === this.enabled())
            return;
        this.enabled.set(enabled);
        const draft = makeQaDraft(this.instanceId, { type: enabled ? 'qa_enabled' : 'qa_disabled', state, data: { scope: 'this-browser', retainedUntilCleared: true, automaticUpload: false } }, 'client');
        const key = qaGameKey(state);
        this.enqueue(async () => { await this.store!.commit(key, [draft], enabled); await this.refresh(); });
        await this.flush();
    }
    record(state: GameState, type: QaObservation['type'], data: QaObservation['data'] = {}, source: QaSource = 'client', interactionId: string | null = null): void {
        this.append(state, [{ type, state, data }], source, interactionId);
    }
    private append(state: GameState, events: QaObservation[], source: QaSource, interactionId: string | null): void {
        if (!this.enabled() || this.failed || this.destroyed)
            return;
        this.observe(state);
        const key = qaGameKey(state);
        const drafts = events.map(e => makeQaDraft(this.instanceId, e, source, interactionId));
        this.enqueue(async () => {
            const written = await this.store!.commit(key, drafts);
            if (!written.length)
                this.enabled.set(await this.store!.enabled());
            await this.refresh();
        });
    }
    beginInput(input: string, state: GameState, source: QaSource): QaInteraction | undefined {
        if (!this.enabled())
            return undefined;
        const handle = qaInteraction(input, state, source);
        this.record(state, handle.kind === 'operation' ? 'operation_requested' : handle.kind === 'command' ? 'command_submitted' : 'question_submitted', { input: handle.input, kind: handle.kind, operation: handle.operation }, source, handle.id);
        return handle;
    }
    finishInput(handle: QaInteraction | undefined, before: GameState, transition: Transition, recognition?: {
        interpretation: Interpretation;
        metrics: InterpretationMetrics;
    }): void {
        if (!handle)
            return;
        this.append(before, transitionObservations(before, transition, { source: handle.source, name: handle.input, interaction: handle, ...recognition, requestedFileId: recognition?.interpretation.fileId }), handle.source, handle.id);
        this.observe(transition.state);
    }
    transition(before: GameState, transition: Transition, name: string, source: QaSource, fileId?: string): void {
        this.append(before, transitionObservations(before, transition, { source, name, requestedFileId: fileId }), source, null);
        this.observe(transition.state);
    }
    interrupt(handle: QaInteraction | undefined, state: GameState, reason: 'session-reset' | 'client-closed' | 'input-error'): void {
        if (handle)
            this.record(state, 'input_interrupted', { reason }, handle.source, handle.id);
    }
    feedback(state: GameState, responseId: string, tag: FeedbackTag, note: string): boolean {
        const target = this.responses().find(e => e.id === responseId);
        if (!this.enabled() || !target || !FEEDBACK_TAGS.includes(tag))
            return false;
        this.record(state, 'feedback', { responseEventId: target.id, responseSequence: target.sequence, tag, note: note.trim().slice(0, 1000) }, 'client', target.interactionId);
        return true;
    }
    async export(scope: 'current' | 'all'): Promise<{
        filename: string;
        text: string;
    }> {
        await this.ready;
        await this.flush();
        if (!this.store)
            throw new Error('Local QA storage is unavailable.');
        const current = this.currentSession();
        const events = scope === 'current' && !current ? [] : await this.store.events(scope === 'current' ? current!.id : undefined);
        return { filename: `nerve-ending-qa-${scope === 'all' ? 'all-sessions' : current?.id.slice(0, 8) ?? 'empty-session'}-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`, text: qaJsonLines(events) };
    }
    async clear(): Promise<void> {
        this.enabled.set(false);
        await this.ready;
        await this.flush();
        if (!this.store)
            throw new Error('Local QA storage is unavailable.');
        await this.store.clear();
        this.failed = false;
        this.warning.set('');
        this.sessions.set([]);
        this.recent.set([]);
    }
    ngOnDestroy(): void { this.destroyed = true; void this.jobs.finally(() => this.store?.close()); }
}
