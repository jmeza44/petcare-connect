import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationsContainerComponent } from './shared/components/notifications-container/notifications-container.component';
import { routeAnimations } from './shared/animations/route-animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationsContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [routeAnimations],
})
export class AppComponent {
  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] ?? '';
  }
}
