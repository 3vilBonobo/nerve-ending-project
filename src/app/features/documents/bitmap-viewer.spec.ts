import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BITMAP_FILES } from '../../core/bitmap-records';
import { fileById } from '../../core/content';
import { Session } from '../../core/session';
import { BitmapViewer } from './bitmap-viewer';
import { DocumentWindow } from './document';

beforeEach(() => { localStorage.clear(); TestBed.configureTestingModule({ imports: [BitmapViewer, DocumentWindow] }); });
afterEach(() => vi.unstubAllGlobals());
const viewer = () => {
  const fixture = TestBed.createComponent(BitmapViewer);
  fixture.componentRef.setInput('bitmap', BITMAP_FILES[0].bitmap); fixture.detectChanges();
  return fixture;
};

describe('native bitmap viewer', () => {
  it('measures a real nonzero viewport after rendering without a lifecycle binding error', async () => {
    const width = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(480);
    try {
      const fixture = viewer(); await fixture.whenStable(); fixture.detectChanges();
      expect(fixture.componentInstance.scale()).toBe(3); expect(fixture.nativeElement.querySelector('img').style.width).toBe('384px');
    } finally { width.mockRestore(); }
  });
  it('exposes placeholder status, meaningful alt text and only available metadata', () => {
    const fixture = viewer(); const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('DEMONSTRATION / PLACEHOLDER'); expect(element.textContent).toContain('128 × 128 PIXELS');
    expect(element.textContent).toContain('DEMO-PORTRAIT'); expect(element.textContent).not.toContain('ARCHIVED');
    const img = element.querySelector('img')!;
    expect(img.alt).toBe(BITMAP_FILES[0].bitmap!.alt); expect(img.getAttribute('width')).toBe('128'); expect(img.getAttribute('height')).toBe('128');
    expect(img.getAttribute('src')).toBe('/bitmaps/demo-employee-id.png'); expect(img.style.filter).toBe('');
    expect(getComputedStyle(img).getPropertyValue('image-rendering')).toBe('pixelated');
  });
  it('uses integer nearest-pixel magnification and a fit mode that never shrinks native data', () => {
    const fixture = viewer(); const c = fixture.componentInstance; const element: HTMLElement = fixture.nativeElement;
    c.viewportWidth.set(390); fixture.detectChanges(); expect(c.scale()).toBe(3);
    expect(element.querySelector('img')!.style.width).toBe('384px'); expect(element.querySelector('img')!.style.height).toBe('384px');
    c.viewportWidth.set(90); fixture.detectChanges(); expect(c.scale()).toBe(1);
    const button = Array.from(element.querySelectorAll('button')).find(b => b.textContent?.trim() === '2×')!;
    button.click(); fixture.detectChanges(); expect(element.querySelector('img')!.style.width).toBe('256px'); expect(button.getAttribute('aria-pressed')).toBe('true');
    element.querySelector('button')!.click(); fixture.detectChanges(); expect(c.zoom()).toBe(0); expect(c.scale()).toBe(1);
  });
  it('measures resize changes without processing the asset or retaining an observer after close', () => {
    let callback: ResizeObserverCallback = () => {}; const disconnect = vi.fn(); const observe = vi.fn();
    vi.stubGlobal('ResizeObserver', class { constructor(cb: ResizeObserverCallback) { callback = cb; } observe = observe; disconnect = disconnect; });
    const fixture = viewer(); expect(observe).toHaveBeenCalledOnce();
    callback([{ contentRect: { width: 512 } } as ResizeObserverEntry], {} as ResizeObserver); fixture.detectChanges();
    expect(fixture.componentInstance.scale()).toBe(4); fixture.destroy(); expect(disconnect).toHaveBeenCalledOnce();
  });
  it('shows an accessible fallback when an asset fails and resets on a different record', () => {
    const fixture = viewer(); const element: HTMLElement = fixture.nativeElement;
    element.querySelector('img')!.dispatchEvent(new Event('error')); fixture.detectChanges();
    expect(element.querySelector('img')).toBeNull(); expect(element.querySelector('[role=status]')?.textContent).toContain('BITMAP UNAVAILABLE');
    expect(element.textContent).toContain(BITMAP_FILES[0].bitmap!.alt);
    expect(Array.from(element.querySelectorAll('button')).every(button => button.disabled)).toBe(true);
    fixture.componentRef.setInput('bitmap', BITMAP_FILES[1].bitmap); fixture.detectChanges();
    expect(element.querySelector('img')?.getAttribute('src')).toBe('/bitmaps/demo-equipment-layout.png');
  });
  it('does not issue an image request for invalid or external references', () => {
    const fixture = viewer(); fixture.componentRef.setInput('bitmap', { ...BITMAP_FILES[0].bitmap, asset: 'https://example.com/secret.png' }); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img')).toBeNull(); expect(fixture.nativeElement.textContent).toContain('BITMAP UNAVAILABLE');
    expect(fixture.nativeElement.textContent).not.toContain('https://example.com');
  });
  it.each([true, false])('checks loaded intrinsic dimensions against metadata (valid=%s)', matching => {
    const fixture = viewer(); const image: HTMLImageElement = fixture.nativeElement.querySelector('img');
    Object.defineProperty(image, 'naturalWidth', { value: matching ? 128 : 256 }); Object.defineProperty(image, 'naturalHeight', { value: 128 });
    image.dispatchEvent(new Event('load')); fixture.detectChanges();
    expect(!!fixture.nativeElement.querySelector('img')).toBe(matching);
  });
  it('uses supplied archival metadata without inventing absent values', () => {
    const fixture = viewer(); fixture.componentRef.setInput('bitmap', { ...BITMAP_FILES[0].bitmap, department: 'TEST DEPARTMENT', archivedAt: 'TEST DATE', sourceId: 'TEST SOURCE' }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('TEST DEPARTMENT'); expect(fixture.nativeElement.textContent).toContain('TEST DATE');
    expect(fixture.nativeElement.textContent).toContain('TEST SOURCE');
  });
  it('remains static with reduced motion and obeys the CRT setting', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
    const fixture = viewer(); fixture.componentRef.setInput('crtEnabled', true); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.bitmap-screen').classList.contains('crt-enabled')).toBe(true);
    fixture.componentRef.setInput('crtEnabled', false); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.bitmap-screen').classList.contains('crt-enabled')).toBe(false);
    expect(fixture.nativeElement.querySelector('img')).toBeTruthy();
    for (const element of fixture.nativeElement.querySelectorAll('img, .bitmap-screen')) expect(getComputedStyle(element).animationName).not.toMatch(/flicker|glitch/);
  });
});

describe('document window compatibility and access', () => {
  it('keeps the original text document readable without instantiating an image', () => {
    const fixture = TestBed.createComponent(DocumentWindow); fixture.componentRef.setInput('file', fileById('company')); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('pre')?.textContent).toBe(fileById('company')!.body);
    expect(fixture.nativeElement.querySelector('ne-bitmap-viewer')).toBeNull();
  });
  it('hosts a bitmap with its title, virtual path, sharp metadata area and return control', () => {
    const fixture = TestBed.createComponent(DocumentWindow); fixture.componentRef.setInput('file', BITMAP_FILES[1]); fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain(BITMAP_FILES[1].title); expect(element.textContent).toContain(BITMAP_FILES[1].path);
    expect(element.querySelector('.document-content')?.classList.contains('bitmap-content')).toBe(true);
    expect(element.textContent).toContain('RETURN TO TERMINAL'); expect(element.querySelector('.document-toolbar')?.textContent).toContain('SAVED BITMAP');
  });
  it('never mounts an asset or displays protected metadata when record access is unavailable', () => {
    const fixture = TestBed.createComponent(DocumentWindow);
    fixture.componentRef.setInput('file', { ...BITMAP_FILES[0], title: 'PRIVATE TITLE SENTINEL', path: '/PRIVATE/SENTINEL.BIT', access: 'clinicalRecordAccess' }); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img')).toBeNull(); expect(fixture.nativeElement.querySelector('ne-bitmap-viewer')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('SENTINEL'); expect(fixture.nativeElement.textContent).toContain('RECORD NOT AVAILABLE');
    // This synthetic fixture exercises the retained prototype permission contract.
    TestBed.inject(Session).state.update(state => ({ ...state, schemaVersion:5, scenario:undefined, permissions: ['clinicalRecordAccess'] })); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('ne-bitmap-viewer')).toBeTruthy();
  });
});
