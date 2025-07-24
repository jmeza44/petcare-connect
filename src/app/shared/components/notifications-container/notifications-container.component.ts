import {
  Component,
  ChangeDetectionStrategy,
  computed,
  signal,
  inject,
} from '@angular/core';
import { AppNotificationComponent } from '../app-notification/app-notification.component';
import { NotificationService } from '../../services/notification.service';
import { AppNotification } from '../../models/app-notification.model';

@Component({
  selector: 'pet-notifications-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppNotificationComponent],
  template: `
    <div
      class="fixed left-2 right-2 top-2 z-[2000] flex flex-col gap-2 md:left-auto md:right-4 md:top-4"
    >
      @for (
        notification of visibleNotifications();
        track trackById(i, notification);
        let i = $index
      ) {
        <pet-app-notification
          [notification]="notification"
          (dismiss)="onDismiss(notification.id)"
        />
      }
    </div>
  `,
})
export class NotificationsContainerComponent {
  private readonly notificationService = inject(NotificationService);
  private readonly allNotifications = signal<AppNotification[]>([]);

  readonly visibleNotifications = computed(() =>
    this.allNotifications().slice(-5),
  );

  constructor() {
    this.notificationService.notifications$.subscribe((notifications) =>
      this.allNotifications.set(notifications),
    );
  }

  onDismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  trackById = (_: number, item: AppNotification): string => item.id;
}
