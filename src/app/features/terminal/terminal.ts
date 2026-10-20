import { AfterViewInit, Component, ElementRef, ViewChild, effect, inject, output } from '@angular/core';
import { Session } from '../../core/session';

@Component({
  selector: 'ne-terminal', standalone: true, templateUrl: './terminal.html',
})
export class Terminal implements AfterViewInit {
  readonly session = inject(Session);
  readonly fileOpened = output<string>();
  @ViewChild('scrollback') private scrollback?: ElementRef<HTMLElement>;
  @ViewChild('command') private command?: ElementRef<HTMLInputElement>;
  input = '';
  caretColumn = 0;
  caretScroll = 0;
  hasSelection = false;
  private position = -1;
  private draft = '';
  private stickToBottom = true;

  constructor() {
    effect(() => {
      this.session.state().terminalHistory;
      this.session.busy();
      setTimeout(() => {
        if (this.stickToBottom && this.scrollback) this.scrollback.nativeElement.scrollTop = this.scrollback.nativeElement.scrollHeight;
        if (this.command) this.updateCaret(this.command.nativeElement);
      });
    });
  }
  ngAfterViewInit(): void { this.command?.nativeElement.focus(); }
  updateCaret(input: HTMLInputElement): void {
    this.caretColumn = input.selectionStart ?? input.value.length;
    this.caretScroll = input.scrollLeft;
    this.hasSelection = input.selectionStart !== input.selectionEnd;
  }
  scroll(): void {
    const node = this.scrollback?.nativeElement;
    if (node) this.stickToBottom = node.scrollHeight - node.scrollTop - node.clientHeight < 90;
  }
  async submit(): Promise<void> {
    const input = this.input;
    if (!input.trim() || this.session.busy()) return;
    this.input = ''; this.position = -1; this.stickToBottom = true;
    await this.session.submit(input);
    this.command?.nativeElement.focus();
  }
  history(event: KeyboardEvent): void {
    if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const items = this.session.state().terminalHistory.map(entry => entry.input).filter(Boolean).reverse();
    if (this.position === -1) this.draft = this.input;
    this.position = event.key === 'ArrowUp' ? Math.min(this.position + 1, items.length - 1) : Math.max(-1, this.position - 1);
    this.input = this.position === -1 ? this.draft : items[this.position] ?? '';
    setTimeout(() => { if (this.command) this.updateCaret(this.command.nativeElement); });
  }
}
