import { Subject } from 'rxjs';

export class DialogRef<T> {
  readonly afterClosed = new Subject<unknown>();
  componentInstance!: T;

  close(result?: unknown): void {
    this.afterClosed.next(result);
    this.afterClosed.complete();
  }
}
