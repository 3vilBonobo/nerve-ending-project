import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, effect, input, signal } from '@angular/core';
import type { ArchiveBitmap } from '../../../core/models';
import { validBitmap } from '../../../core/content/bitmap-records';
@Component({
    selector: 'ne-bitmap-viewer', standalone: true,
    templateUrl: './bitmap-viewer.html', styleUrl: './bitmap-viewer.css',
})
export class BitmapViewer implements AfterViewInit, OnDestroy {
    readonly bitmap = input.required<ArchiveBitmap>();
    readonly crtEnabled = input(false);
    readonly failed = signal(false);
    readonly zoom = signal(0);
    readonly viewportWidth = signal(0);
    readonly valid = computed(() => validBitmap(this.bitmap()));
    readonly scale = computed(() => this.zoom() || Math.max(1, Math.min(4, Math.floor(this.viewportWidth() / this.bitmap().width))));
    readonly category = computed(() => ({ personnel: 'PERSONNEL PHOTOGRAPH', surveillance: 'SURVEILLANCE STILL', clinical: 'CLINICAL PHOTOGRAPH', diagram: 'TECHNICAL DIAGRAM' })[this.bitmap().category]);
    @ViewChild('viewport')
    private viewport?: ElementRef<HTMLElement>;
    private observer?: ResizeObserver;
    private destroyed = false;
    constructor() {
        effect(() => {
            this.bitmap();
            this.failed.set(false);
            this.zoom.set(0);
        });
    }
    ngAfterViewInit(): void {
        const viewport = this.viewport?.nativeElement;
        if (!viewport)
            return;
        // Measure after the first render; do not change checked bindings in AfterViewInit.
        queueMicrotask(() => {
            if (!this.destroyed)
                this.viewportWidth.set(Math.max(0, viewport.clientWidth - 16));
        });
        if (typeof ResizeObserver !== 'undefined') {
            this.observer = new ResizeObserver(entries => this.viewportWidth.set(Math.floor(entries[0]?.contentRect.width ?? 0)));
            this.observer.observe(viewport);
        }
    }
    loaded(event: Event): void {
        const image = event.target as HTMLImageElement;
        if (image.naturalWidth !== this.bitmap().width || image.naturalHeight !== this.bitmap().height)
            this.failed.set(true);
    }
    ngOnDestroy(): void {
        this.destroyed = true;
        this.observer?.disconnect();
    }
}
