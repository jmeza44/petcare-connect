import { Component, inject } from '@angular/core';
import { AppNotificationComponent } from '../app-notification/app-notification.component';
import { NotificationService } from '../../services/notification.service';
import { AppNotification } from '../../models/app-notification.model';

@Component({
  selector: 'pet-notifications-container',
  imports: [AppNotificationComponent],
  template: `
    <div
      class="fixed left-2 right-2 top-2 z-50 flex flex-col gap-2 md:left-auto md:right-4 md:top-4"
    >
      @for (notification of notifications; track notification) {
        <pet-app-notification
          [notification]="notification"
          (dismiss)="onDismiss(notification.id)"
        />
      }
    </div>
  `,
})
export class NotificationsContainerComponent {
  notifications: AppNotification[] = [];
  private service = inject(NotificationService);

  constructor() {
    this.service.notifications$.subscribe((n) => {
      this.notifications = n.slice(-5); // max 5 visible
    });
  }

  onDismiss(id: string) {
    this.service.dismiss(id);
  }
}
