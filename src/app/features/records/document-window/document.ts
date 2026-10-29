import { Component, computed, inject, input, output } from '@angular/core';
import { ArchiveFile } from '../../../core/models';
import { Session } from '../../../core/state/session';
import { canRead } from '../../../core/engine/story/continuation';
import { BitmapViewer } from '../bitmap-viewer/bitmap-viewer';
@Component({
    selector: 'ne-document', standalone: true, imports: [BitmapViewer],
    templateUrl: './document.html',
})
export class DocumentWindow {
    readonly session = inject(Session);
    readonly file = input.required<ArchiveFile>();
    readonly closed = output<void>();
    readonly finished = output<void>();
    // An open window is not a permanent grant: reset or a changed review can remove access.
    readonly readable = computed(() => canRead(this.session.state(), this.file()));
    // Resolve references through the current permitted list, not the complete archive.
    readonly references = computed(() => (this.file().references ?? []).flatMap(id => {
        const record = this.session.files().find(file => file.id === id);
        return record ? [record] : [];
    }));
    escape(event: Event): void {
        if (this.file().bitmap) {
            event.preventDefault();
            event.stopPropagation();
            this.closed.emit();
        }
    }
}
