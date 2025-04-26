import { trigger, transition, style, animate } from '@angular/animations';

export const verticalSlideAnimation = trigger('slideVertical', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)', opacity: 0 }),
    animate(
      '300ms ease-out',
      style({ transform: 'translateY(0)', opacity: 1 }),
    ),
  ]),
  transition(':leave', [
    animate(
      '300ms ease-in',
      style({ transform: 'translateY(-100%)', opacity: 0 }),
    ),
  ]),
]);
