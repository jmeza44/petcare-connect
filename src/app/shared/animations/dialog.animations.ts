import { animate, style, transition, trigger } from '@angular/animations';

export const dialogAnimations = [
  trigger('dialogTransition', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(16px) scale(0.98)' }),
      animate('200ms ease-out', style({ opacity: 1, transform: 'none' })),
    ]),
    transition(':leave', [
      animate(
        '150ms ease-in',
        style({ opacity: 0, transform: 'translateY(16px) scale(0.98)' }),
      ),
    ]),
  ]),

  trigger('backdropFade', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('200ms ease-out', style({ opacity: 1 })),
    ]),
    transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
  ]),
];
