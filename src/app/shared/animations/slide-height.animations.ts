import { trigger, transition, style, animate } from '@angular/animations';

export const slideHeightAnimation = trigger('slideHeight', [
  transition(':enter', [
    style({ height: '0' }),
    animate('200ms ease', style({ height: '*' })),
  ]),
  transition(':leave', [
    style({ height: '*' }),
    animate('200ms ease', style({ height: '0' })),
  ]),
]);
