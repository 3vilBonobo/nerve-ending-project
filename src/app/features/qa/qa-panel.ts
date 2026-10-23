import { Component, computed, inject, signal } from '@angular/core';
import { Session } from '../../core/session';
import { QaTelemetry } from '../../core/qa/telemetry';
import { FEEDBACK_TAGS, FeedbackTag, QaEvent } from '../../core/qa/types';

@Component({ selector: 'ne-qa-panel', standalone: true, templateUrl: './qa-panel.html' })
export class QaPanel {
  readonly qa = inject(QaTelemetry);
  private readonly session = inject(Session);
  readonly busy = signal(false);
  readonly message = signal('');
  readonly confirmClear = signal(false);
  readonly copyText = signal('');
  readonly feedbackTags = FEEDBACK_TAGS;
  readonly feedbackResponseId = signal('');
  readonly selectedResponse = computed<QaEvent | undefined>(() => this.qa.responses().find(e => e.id === this.feedbackResponseId()) ?? this.qa.responses()[0]);
  readonly responsePreview = computed(() => {
    const output = this.selectedResponse()?.data['output'];
    return output && typeof output === 'object' && !Array.isArray(output) && Array.isArray(output['lines']) ? output['lines'].join('\n') : '';
  });

  private async perform(action: () => Promise<void>): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true); this.message.set(''); this.copyText.set('');
    try { await action(); }
    catch { this.message.set('The QA action could not finish. Recorded data has been kept. Try again or check browser storage permissions.'); }
    finally { this.busy.set(false); }
  }
  toggle(enabled: boolean): Promise<void> {
    return this.perform(async () => { await this.qa.setEnabled(enabled, this.session.state()); this.message.set(this.qa.enabled() ? 'QA recording enabled for this browser. Only subsequent actions are recorded.' : 'QA recording is off. Existing recordings are retained.'); });
  }
  download(scope: 'current' | 'all'): Promise<void> {
    return this.perform(async () => {
      const result = await this.qa.export(scope);
      const url = URL.createObjectURL(new Blob([result.text], { type: 'application/x-ndjson;charset=utf-8' }));
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = result.filename;
      document.body.append(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      this.message.set(`Export requested: ${result.filename}. Check Downloads or your browser’s save prompt.`);
    });
  }
  copy(): Promise<void> {
    return this.perform(async () => {
      const result = await this.qa.export('current');
      try { await navigator.clipboard.writeText(result.text); this.message.set('Current session JSONL copied.'); }
      catch { this.copyText.set(result.text); this.message.set('Clipboard access is unavailable. Select and copy the JSONL below.'); }
    });
  }
  clear(): Promise<void> {
    if (!this.confirmClear()) return Promise.resolve();
    return this.perform(async () => { await this.qa.clear(); this.confirmClear.set(false); this.message.set('All local QA recordings deleted. QA recording is off. Investigation progress is retained.'); });
  }
  feedback(responseId: string, tag: string, note: HTMLTextAreaElement): Promise<void> {
    return this.perform(async () => {
      if (!this.qa.feedback(this.session.state(), responseId, tag as FeedbackTag, note.value)) { this.message.set('Enable recording and select a recent response first.'); return; }
      await this.qa.flush(); note.value = ''; this.message.set(this.qa.warning() || 'Feedback saved with the selected response.');
    });
  }
  responseLabel(event: QaEvent): string { return `#${event.sequence} · ${String(event.data['input'] ?? '').slice(0,85)}`; }
  eventJson(event: QaEvent): string { return JSON.stringify(event, null, 2); }
}
