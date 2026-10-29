import { Component, ElementRef, OnDestroy, computed, input, output, signal, viewChild } from '@angular/core';

@Component({
  selector: 'ne-welcome', standalone: true,
  templateUrl: './welcome.html', styleUrl: './welcome.css',
})
export class Welcome implements OnDestroy {
  readonly returning = input(false);
  readonly entered = output<void>();
  readonly settingsRequested = output<void>();
  readonly chapter = signal(-1);
  readonly visibleCharacters = signal(0);
  readonly chapters = [
    { label: 'THE SETTING', title: 'An archive. A connection. You.', text: 'November 6, 2003. 02:14.\n\nYou have opened a remote connection to Meridian Systems. Behind the terminal are company records, retained service logs, and the people whose work left a trace.\n\nFor now, you have access to the public archive. Start by looking around.' },
    { label: 'YOUR PART', title: 'Follow the questions.', text: 'This is a story you uncover through a terminal.\n\nRead what was recorded. Ask the system questions in your own words. Compare its answers with the files you find. When something does not add up, follow it.\n\nThe records offer observations. What you make of them is part of the investigation.' },
    { label: 'FIELD GUIDE', title: 'Every inquiry starts somewhere.', text: 'You do not need to know your way around a terminal.\n\nType a command or ask a question, then press Enter. Open records to read them alongside the conversation. If you lose your place, ask “What should I do next?”\n\nTake your time. Your progress is saved in this browser when storage is available.' },
  ];
  readonly current = computed(() => this.chapters[Math.max(0, this.chapter())]);
  readonly typedText = computed(() => this.current().text.slice(0, this.visibleCharacters()));
  readonly typing = computed(() => this.visibleCharacters() < this.current().text.length);
  private readonly heading = viewChild<ElementRef<HTMLElement>>('chapterHeading');
  private timer?: ReturnType<typeof setInterval>;
  private focusTimer?: ReturnType<typeof setTimeout>;

  begin(): void { this.showChapter(0); }
  showChapter(index: number): void {
    clearInterval(this.timer);
    this.chapter.set(index);
    const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.visibleCharacters.set(reduced ? this.current().text.length : 0);
    if (!reduced) this.timer = setInterval(() => {
      this.visibleCharacters.update(count => Math.min(count + 3, this.current().text.length));
      if (!this.typing()) clearInterval(this.timer);
    }, 24);
    clearTimeout(this.focusTimer);
    this.focusTimer = setTimeout(() => this.heading()?.nativeElement.focus());
  }
  reveal(): void { clearInterval(this.timer); this.visibleCharacters.set(this.current().text.length); }
  next(): void {
    if (this.typing()) { this.reveal(); return; }
    if (this.chapter() < this.chapters.length - 1) this.showChapter(this.chapter() + 1);
    else this.login();
  }
  login(): void { clearInterval(this.timer); clearTimeout(this.focusTimer); this.entered.emit(); }
  ngOnDestroy(): void { clearInterval(this.timer); clearTimeout(this.focusTimer); }
}
