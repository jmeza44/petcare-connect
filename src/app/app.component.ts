import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(
          ':enter, :leave',
          [
            style({
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
            }),
          ],
          { optional: true },
        ),
        query(
          ':enter',
          [style({ opacity: 0, transform: 'translateY(20px)' })],
          { optional: true },
        ),
        group([
          query(
            ':leave',
            [
              animate(
                '300ms ease-out',
                style({ opacity: 0, transform: 'translateY(-20px)' }),
              ),
            ],
            { optional: true },
          ),
          query(
            ':enter',
            [
              animate(
                '300ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' }),
              ),
            ],
            { optional: true },
          ),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent {
  title = 'petcare-connect';

  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] ?? '';
  }
}
