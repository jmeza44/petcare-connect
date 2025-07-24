import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from './shared/animations/route-animations';
import { NotificationsContainerComponent } from './shared/components/notifications-container/notifications-container.component';

@Component({
  selector: 'pet-root',
  standalone: true,
  imports: [RouterOutlet, NotificationsContainerComponent],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <pet-notifications-container></pet-notifications-container>
    <div [@routeAnimations]="getRouteAnimationData(outlet)">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class AppComponent {
  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] ?? '';
  }
}
