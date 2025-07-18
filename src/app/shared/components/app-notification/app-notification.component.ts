import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import {
  FontAwesomeModule,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import {
  faCheckCircle,
  faInfoCircle,
  faExclamationTriangle,
  faTimes,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import {
  AppNotification,
  NotificationType,
} from '../../models/app-notification.model';
import { fadeAnimation } from '../../animations/fade.animation';
import { horizontalSlideAnimation } from '../../animations/horizontal-slide.animation';
import { verticalSlideAnimation } from '../../animations/vertical-slide.animation';
import { AutoDismissTimer } from '../../utils/auto-dismiss-timer.util';

@Component({
  selector: 'pet-app-notification',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule],
  animations: [fadeAnimation, horizontalSlideAnimation, verticalSlideAnimation],
  templateUrl: './app-notification.component.html',
})
export class AppNotificationComponent implements OnInit, OnDestroy {
  readonly notification = input.required<AppNotification>();
  readonly dismiss = output<void>();

  readonly closeIcon = faTimes;

  readonly iconMap: Record<NotificationType, IconDefinition> = {
    success: faCheckCircle,
    info: faInfoCircle,
    warning: faExclamationTriangle,
    error: faTimesCircle,
  };

  readonly borderMap: Record<NotificationType, string> = {
    success: 'border-green-500',
    info: 'border-blue-500',
    warning: 'border-amber-500',
    error: 'border-red-500',
  };

  readonly bgMap: Record<NotificationType, string> = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };

  readonly animation = signal<'fade' | 'slideHorizontal' | 'slideVertical'>(
    'fade',
  );

  readonly icon = computed(() => this.iconMap[this.notification().type]);
  readonly borderClass = computed(
    () => this.borderMap[this.notification().type],
  );
  readonly bgClass = computed(() => this.bgMap[this.notification().type]);

  private timer?: AutoDismissTimer;

  ngOnInit(): void {
    const note = this.notification();

    this.animation.set(
      note.animation === 'fade'
        ? 'fade'
        : window.innerWidth <= 720
          ? 'slideVertical'
          : 'slideHorizontal',
    );

    if (note.duration !== 0) {
      this.timer = new AutoDismissTimer(note.duration ?? 5000, () =>
        this.dismiss.emit(),
      );
    }
  }

  ngOnDestroy(): void {
    this.timer?.destroy();
  }

  pauseTimer(): void {
    this.timer?.pause();
  }

  resumeTimer(): void {
    this.timer?.resume();
  }
}
