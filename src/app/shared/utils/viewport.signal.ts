import { signal } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export const useViewportWidth = () => {
  const viewport = signal(window.innerWidth);

  fromEvent(window, 'resize')
    .pipe(
      map(() => window.innerWidth),
      startWith(window.innerWidth),
    )
    .subscribe((width) => viewport.set(width));

  return viewport;
};
