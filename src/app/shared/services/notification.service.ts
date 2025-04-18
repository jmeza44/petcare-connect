import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { AppNotification } from '../models/app-notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private defaultNotificationDuration = 5000;
  private _notifications = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this._notifications.asObservable();

  show(notification: Omit<AppNotification, 'id'>) {
    const current = this._notifications.getValue();
    const newNotification: AppNotification = { ...notification, id: uuid() };

    // Deduplicate by message and type
    if (
      current.some(
        (n) =>
          n.message === newNotification.message &&
          n.type === newNotification.type,
      )
    )
      return;

    this._notifications.next([...current, newNotification]);
  }

  dismiss(id: string) {
    this._notifications.next(
      this._notifications.getValue().filter((n) => n.id !== id),
    );
  }

  clear() {
    this._notifications.next([]);
  }

  success(message: string, title?: string) {
    this.show({
      message,
      title: title ?? 'Éxito',
      type: 'success',
      duration: this.defaultNotificationDuration,
      animation: 'slide',
    });
  }

  info(message: string, title?: string) {
    this.show({
      message,
      title: title ?? 'Información',
      type: 'info',
      duration: this.defaultNotificationDuration,
      animation: 'slide',
    });
  }

  warning(message: string, title?: string) {
    this.show({
      message,
      title: title ?? 'Atención',
      type: 'warning',
      duration: this.defaultNotificationDuration,
      animation: 'slide',
    });
  }

  error(message: string, title?: string) {
    this.show({
      message,
      title: title ?? 'Error',
      type: 'error',
      duration: this.defaultNotificationDuration,
      animation: 'slide',
    });
  }
}
