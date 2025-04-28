import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { NotificationType } from '../../models/app-notification.model';

@Component({
  selector: 'app-notifications-testing-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mx-auto max-w-xl space-y-6 p-8">
      <h1 class="text-2xl font-bold">🧪 Notifications Testing Page</h1>

      <div class="space-y-4">
        <div>
          <label class="block font-medium">Title:</label>
          <input class="input" [(ngModel)]="title" placeholder="Enter title" />
        </div>

        <div>
          <label class="block font-medium">Message:</label>
          <input
            class="input"
            [(ngModel)]="message"
            placeholder="Enter message"
          />
        </div>

        <div>
          <label class="block font-medium">Type:</label>
          <select class="input" [(ngModel)]="type">
            <option *ngFor="let t of types" [value]="t">{{ t }}</option>
          </select>
        </div>

        <div>
          <label class="block font-medium">Animation:</label>
          <select class="input" [(ngModel)]="animation">
            <option value="fade">Fade</option>
            <option value="slide">Slide</option>
          </select>
        </div>

        <div>
          <label class="block font-medium">Duration (ms):</label>
          <input
            type="number"
            class="input"
            [(ngModel)]="duration"
            placeholder="3000"
          />
          <p class="text-sm text-gray-500">
            Set to 0 for persistent notification.
          </p>
        </div>

        <button
          class="rounded bg-blue-600 px-4 py-2 text-white"
          (click)="triggerNotification()"
        >
          Show Notification
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .input {
        @apply mt-1 w-full rounded border border-gray-300 px-3 py-2;
      }
    `,
  ],
})
export class NotificationsTestingPageComponent {
  title = 'Test Notification';
  message = 'This is a test message.';
  type: NotificationType = 'info';
  animation: 'fade' | 'slideHorizontal' | 'slideVertical' = 'fade';
  duration = 3000;

  types: NotificationType[] = ['success', 'error', 'info', 'warning'];

  constructor(private notificationService: NotificationService) {}

  triggerNotification() {
    this.notificationService.show({
      title: this.title,
      message: this.message,
      type: this.type,
      animation: this.animation,
      duration: this.duration,
    });
  }
}
