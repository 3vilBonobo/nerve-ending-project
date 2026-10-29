import { Component, computed, inject, output, signal } from '@angular/core';
import { DIRECTORIES } from '../../core/content/record-registry';
import { Session } from '../../core/state/session';
@Component({
    selector: 'ne-file-browser', standalone: true,
    templateUrl: './file-browser.html',
})
export class FileBrowser {
    readonly session = inject(Session);
    readonly opened = output<string>();
    readonly query = signal('');
    readonly folders = computed(() => !this.query().trim() ? DIRECTORIES.filter(path => path !== '/' && (path.slice(0, path.lastIndexOf('/')) || '/') === this.session.state().currentDirectory && this.session.files().some(f => f.path.startsWith(path + '/'))) : []);
    readonly files = computed(() => this.query().trim() ? this.session.files().filter(f => `${f.id} ${f.title} ${f.path} ${f.body}`.toLowerCase().includes(this.query().trim().toLowerCase())) : this.session.files().filter(file => file.path.slice(0, file.path.lastIndexOf('/')) === this.session.state().currentDirectory));
    readonly descriptions: Record<string, string> = { '/OPERATIONS': 'Calls, staff mail & live monitor', '/ARCHIVE': 'Attachments & saved copies', '/ADMIN': 'Office notices & closure records', '/SYSTEM': 'Terminal controls' };
    up(): void {
        const path = this.session.state().currentDirectory;
        this.session.directory(path.slice(0, path.lastIndexOf('/')) || '/');
    }
}
