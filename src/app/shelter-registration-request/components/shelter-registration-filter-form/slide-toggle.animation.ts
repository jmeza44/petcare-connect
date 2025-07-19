import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export const slideToggleAnimation = trigger('slideToggle', [
  state(
    'collapsed',
    style({
      height: '0px',
      opacity: 0,
    }),
  ),
  state(
    'expanded',
    style({
      height: '*',
      opacity: 1,
    }),
  ),
  transition('collapsed <=> expanded', animate('250ms ease-in-out')),
]);
