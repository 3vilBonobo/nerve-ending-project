import { Component, computed, inject, output } from '@angular/core';
import { DIRECTORIES } from '../../core/content';
import { Session } from '../../core/session';

@Component({
  selector: 'ne-file-browser', standalone: true,
  template: `
    <section class="file-browser" aria-label="Archive file browser">
      <div class="browser-path"><button (click)="session.directory('/')" aria-label="Root directory">⌂</button><span>{{ session.state().currentDirectory }}</span><button [disabled]="session.state().currentDirectory === '/'" (click)="up()" aria-label="Parent directory">↑</button></div>
      <div class="browser-column-head"><span>NAME</span><span>TYPE</span></div>
      <div class="browser-items">
        @for (path of folders(); track path) {
          <button class="file-row folder-row" (click)="session.directory(path)"><span class="folder-icon" aria-hidden="true"></span><span>{{ path.slice(1) }}<small>{{ descriptions[path] }}</small></span><span class="file-type">DIR</span></button>
        }
        @for (file of files(); track file.id) {
          <button class="file-row" (click)="opened.emit(file.id)"><span class="page-icon" aria-hidden="true"></span><span>{{ file.title }}<small>{{ file.modified }}{{ session.state().viewedFileIds.includes(file.id) ? ' / READ' : '' }}@if (file.backupAvailable) { <br>Original unavailable / backup held }</small></span><span class="file-type">{{ file.path.split('.').pop() }}</span></button>
        }
      </div>
      <footer class="browser-footer">{{ folders().length + files().length }} ITEMS <span>CANNOT EDIT</span></footer>
    </section>
  `,
})
export class FileBrowser {
  readonly session = inject(Session);
  readonly opened = output<string>();
  readonly folders = computed(() => this.session.state().currentDirectory === '/' ? DIRECTORIES.filter(path => path !== '/') : []);
  readonly files = computed(() => this.session.files().filter(file => file.path.slice(0, file.path.lastIndexOf('/')) === this.session.state().currentDirectory));
  readonly descriptions: Record<string, string> = { '/OPERATIONS': 'Calls, staff mail & live monitor', '/ARCHIVE': 'Attachments & saved copies', '/ADMIN': 'Office notices & closure records', '/SYSTEM': 'Terminal controls' };
  up(): void {
    const path = this.session.state().currentDirectory;
    this.session.directory(path.slice(0, path.lastIndexOf('/')) || '/');
  }
}
