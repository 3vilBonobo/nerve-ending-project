import { Component, input, output } from '@angular/core';
import { ArchiveFile } from '../../core/models';

@Component({
  selector: 'ne-document', standalone: true,
  template: `
    <section class="document-shell" [attr.aria-label]="file().title" tabindex="-1">
      <header class="window-titlebar"><div class="window-title"><span class="page-icon" aria-hidden="true"></span>{{ file().path.split('/').pop() }}</div><div class="window-controls"><button (click)="closed.emit()" [attr.aria-label]="'Close ' + file().title">×</button></div></header>
      <div class="document-toolbar"><span>ORIGINAL RECORD</span><span>READ-ONLY COPY</span></div>
      <div class="document-content" tabindex="0"><pre>{{ file().body }}</pre>@if (file().id === 'fragment') { <button class="fragment-finish" (click)="finished.emit()">END OF PROTOTYPE / SESSION REPORT →</button> }</div>
      <footer class="document-footer"><span>{{ file().path }}</span><span>EOF</span></footer>
    </section>
  `,
})
export class DocumentWindow { readonly file = input.required<ArchiveFile>(); readonly closed = output<void>(); readonly finished = output<void>(); }
