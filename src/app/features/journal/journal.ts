import { AfterViewInit, Component, ElementRef, computed, inject, output, viewChild } from '@angular/core';
import { Session } from '../../core/state/session';
import { investigationHint, journalSections } from '../../core/investigation/investigation-journal';
@Component({ selector: 'ne-journal', standalone: true, templateUrl: './journal.html', styleUrl: './journal.css' })
export class Journal implements AfterViewInit {
    readonly session = inject(Session);
    readonly closed = output<void>();
    readonly opened = output<string>();
    readonly panel = viewChild.required<ElementRef<HTMLDialogElement>>('panel');
    readonly sections = computed(() => journalSections(this.session.state()));
    readonly hint = computed(() => investigationHint(this.session.state(), 1));
    ngAfterViewInit(): void {
        this.panel().nativeElement.showModal();
    }
    inspect(command: string): void {
        // Journal shortcuts inspect services only. Review and consent requests still go
        // through typed input and the engine's normal guards.
        if (/^(?:STATUS|(?:INFO|LOG) 00[1-8])$/.test(command)) {
            void this.session.submit(command);
            this.closed.emit();
        }
    }
    help(): void {
        void this.session.submit('MORE HELP');
        this.closed.emit();
    }
}
