import { Component, computed, inject, input, output } from '@angular/core';
import { ArchiveFile } from '../../core/models';
import { Session } from '../../core/session';
import { canRead } from '../../core/engine/continuation';
import { BitmapViewer } from './bitmap-viewer';

@Component({
  selector: 'ne-document', standalone: true, imports: [BitmapViewer],
  template: `
    @if (readable()) {
    <section class="document-shell" [attr.aria-label]="file().title" tabindex="-1" (keydown.escape)="escape($event)">
      <header class="window-titlebar"><div class="window-title"><span class="page-icon" aria-hidden="true"></span>{{ file().title }}</div><div class="window-controls"><button (click)="closed.emit()" [attr.aria-label]="'Close ' + file().title">×</button></div></header>
      <div class="document-toolbar"><span>{{ file().bitmap ? 'SAVED BITMAP' : 'SAVED RECORD' }}</span><span>CANNOT BE EDITED</span></div>
      <div class="document-content" [class.bitmap-content]="!!file().bitmap" tabindex="0">
        @if (file().bitmap; as bitmap) {
          <ne-bitmap-viewer [bitmap]="bitmap" [crtEnabled]="session.state().ui.crtEnabled" />
          <button class="fragment-finish" (click)="finished.emit()">RETURN TO TERMINAL →</button>
        } @else { <pre>{{ file().body }}</pre> }
        @if (file().author) { <p class="record-provenance">SOURCE: {{ file().author }}<br>{{ file().provenance }}<br>Filed: {{ file().modified }}</p> }
        @if (file().id === 'fragment' || file().access) { <button class="fragment-finish" (click)="finished.emit()">RETURN TO TERMINAL →</button> }
      </div>
      @if (file().backupAvailable) { <div class="backup-reader"><span>LOCAL COPY / 18 SEP 2001</span><code>/ARCHIVE/HANDOVER_006.BAK</code></div> }
      @if (references().length) { <div class="document-references" aria-label="Record references"><span>REFERENCED RECORDS / OPEN BY NAME</span>@for (record of references(); track record.id) { <code>{{ record.path }}</code> }</div> }
      <footer class="document-footer"><span>{{ file().path }}</span><span>EOF</span></footer>
    </section>
    } @else { <section class="document-shell" aria-label="Unavailable record"><p>RECORD NOT AVAILABLE THROUGH THIS CONNECTION.</p><button (click)="closed.emit()">CLOSE RECORD</button></section> }
  `,
})
export class DocumentWindow {
  readonly session = inject(Session);
  readonly file = input.required<ArchiveFile>();
  readonly closed = output<void>();
  readonly finished = output<void>();
  readonly readable = computed(() => canRead(this.session.state(), this.file()));
  readonly references = computed(() => (this.file().references ?? []).flatMap(id => { const record = this.session.files().find(file => file.id === id); return record ? [record] : []; }));
  escape(event: Event): void { if (this.file().bitmap) { event.preventDefault(); event.stopPropagation(); this.closed.emit(); } }
}
