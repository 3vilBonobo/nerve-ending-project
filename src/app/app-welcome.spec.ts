import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';
import { Welcome } from './features/welcome/welcome';

describe('Welcome and first-time introduction', () => {
  beforeEach(() => { localStorage.clear(); TestBed.configureTestingModule({ imports: [App] }); });

  it('takes a new player through the story and command guide before starting the session', () => {
    const fixture = TestBed.createComponent(App); fixture.detectChanges();
    const app = fixture.componentInstance;
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector<HTMLButtonElement>('.start-button')!.click(); fixture.detectChanges();
    expect(element.querySelector('#chapter-title')?.textContent).toContain('An archive');
    expect(element.querySelector('.field-guide')?.textContent).toContain('STATUS');
    expect(app.session.state().hasStarted).toBe(false);
    const welcome = fixture.debugElement.query(By.directive(Welcome)).componentInstance as Welcome;
    for (let chapter = 0; chapter < 3; chapter++) {
      expect(welcome.chapter()).toBe(chapter);
      welcome.reveal(); fixture.detectChanges();
      expect(element.querySelector('.story-text')?.textContent).toContain(welcome.current().text);
      element.querySelector<HTMLButtonElement>('.chapter-controls .solid-button')!.click(); fixture.detectChanges();
    }
    expect(app.session.state().hasStarted).toBe(true);
    expect(app.stage()).toBe('connecting');
    app.skipConnection(); fixture.detectChanges();
    expect(element.querySelector('#terminal-command')).toBeTruthy();
    fixture.destroy();
  });

  it('can skip from the landing page or any chapter without changing story progress', () => {
    for (const chapter of [-1, 0, 1, 2]) {
      localStorage.clear();
      const fixture = TestBed.createComponent(App); fixture.detectChanges();
      const app = fixture.componentInstance;
      const welcome = fixture.debugElement.query(By.directive(Welcome)).componentInstance as Welcome;
      if (chapter >= 0) welcome.showChapter(chapter);
      fixture.detectChanges();
      const before = app.session.state().scenario;
      const element = fixture.nativeElement as HTMLElement;
      const skip = Array.from(element.querySelectorAll<HTMLButtonElement>('ne-welcome button')).find(button => button.textContent?.includes('Skip intro'))!;
      skip.click(); fixture.detectChanges();
      expect(app.stage()).toBe('connecting');
      expect(app.session.state().scenario).toEqual(before);
      app.skipConnection(); fixture.destroy();
      TestBed.resetTestingModule(); TestBed.configureTestingModule({ imports: [App] });
    }
  });

  it('resumes a saved session directly and offers an introduction replay', () => {
    const fixture = TestBed.createComponent(App); const app = fixture.componentInstance;
    app.session.start(); fixture.detectChanges();
    const resume = vi.spyOn(app.session, 'resume');
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Replay introduction');
    expect(element.textContent).toContain('Saved session found');
    element.querySelector<HTMLButtonElement>('.start-button')!.click(); fixture.detectChanges();
    expect(resume).toHaveBeenCalledOnce();
    expect(app.stage()).toBe('desktop');
    expect(element.querySelector('#terminal-command')).toBeTruthy();
    fixture.destroy();
  });

  it('shows full story text immediately when reduced motion is preferred', () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    const fixture = TestBed.createComponent(Welcome);
    try {
      fixture.componentInstance.begin(); fixture.detectChanges();
      expect(fixture.componentInstance.typing()).toBe(false);
      expect(fixture.componentInstance.typedText()).toBe(fixture.componentInstance.current().text);
    } finally { fixture.destroy(); window.matchMedia = original; }
  });
});
