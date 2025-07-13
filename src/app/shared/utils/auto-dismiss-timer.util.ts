import { signal } from '@angular/core';

export class AutoDismissTimer {
  private start = 0;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly remaining = signal(0);
  readonly paused = signal(false);

  constructor(
    private duration: number,
    private onComplete: () => void,
  ) {
    this.remaining.set(duration);
    this.startTimer();
  }

  private startTimer(): void {
    this.clearTimer();
    this.start = Date.now();
    this.paused.set(false);
    this.timeoutId = setTimeout(() => this.onComplete(), this.remaining());
  }

  pause(): void {
    if (this.paused()) return;
    this.clearTimer();
    const elapsed = Date.now() - this.start;
    this.remaining.update((r) => r - elapsed);
    this.paused.set(true);
  }

  resume(): void {
    if (!this.paused()) return;
    this.startTimer();
  }

  destroy(): void {
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
