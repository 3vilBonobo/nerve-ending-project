import { Component, computed, inject, input, output } from '@angular/core';
import { ArchiveFile } from '../../core/models';
import { fileById } from '../../core/content';
import { Session } from '../../core/session';

@Component({
  selector: 'ne-document', standalone: true,
  template: `
    <section class="document-shell" [attr.aria-label]="file().title" tabindex="-1">
      <header class="window-titlebar"><div class="window-title"><span class="page-icon" aria-hidden="true"></span>{{ file().title }}</div><div class="window-controls"><button (click)="closed.emit()" [attr.aria-label]="'Close ' + file().title">×</button></div></header>
      <div class="document-toolbar"><span>SAVED RECORD</span><span>CANNOT BE EDITED</span></div>
      <div class="document-content" tabindex="0">
        <pre>{{ file().body }}</pre>
        @if (file().author) { <p class="record-provenance">SOURCE: {{ file().author }}<br>{{ file().provenance }}<br>Filed: {{ file().modified }}</p> }
        @if (file().id === 'fragment' || file().access) { <button class="fragment-finish" (click)="finished.emit()">RETURN TO TERMINAL / OPERATIONS →</button> }
      </div>
      @if (file().backupAvailable) { <div class="backup-reader"><span>LOCAL COPY / 18 SEP 2001</span><button class="primary-button read-backup" (click)="backupRequested.emit()">READ BACKUP COPY</button></div> }
      @if (references().length) { <nav class="document-references" aria-label="Linked records"><span>LINKED RECORDS</span>@for (record of references(); track record.id) { <button class="record-link" (click)="opened.emit(record.id)">[OPEN] {{ record.title }}</button> }</nav> }
      <footer class="document-footer"><span>{{ file().path }}</span><span>EOF</span></footer>
    </section>
  `,
})
export class DocumentWindow {
  readonly session = inject(Session);
  readonly file = input.required<ArchiveFile>();
  readonly closed = output<void>();
  readonly finished = output<void>();
  readonly opened = output<string>();
  readonly backupRequested = output<void>();
  readonly references = computed(() => (this.file().references ?? []).flatMap(id => { const record = this.session.files().find(file => file.id === id); return record ? [record] : []; }));
}
