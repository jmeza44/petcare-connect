import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { fadeAnimation } from '../../animations/fade.animation';
import { horizontalSlideAnimation } from '../../animations/horizontal-slide.animation';
import {
  AppNotification,
  NotificationType,
} from '../../models/app-notification.model';
import {
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimes,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { verticalSlideAnimation } from '../../animations/vertical-slide.animation';

@Component({
  selector: 'pet-app-notification',
  standalone: true,
  animations: [fadeAnimation, horizontalSlideAnimation, verticalSlideAnimation],
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './app-notification.component.html',
})
export class AppNotificationComponent implements OnInit, OnDestroy {
  @Input() notification!: AppNotification;
  @Output() dismiss = new EventEmitter<void>();

  closeIcon = faTimes;
  // TODO: Make it private
  remainingTime = 0;
  borderStyle = {
    success: 'border-green-500',
    info: 'border-blue-500',
    warning: 'border-amber-500',
    error: 'border-red-500',
  };
  bgStyle = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };
  iconMap = {
    success: faCheckCircle,
    info: faInfoCircle,
    warning: faExclamationTriangle,
    error: faTimesCircle,
  };
  private timeoutId: any = null;
  private startTime = 0;
  private isPaused = false;

  closeIconColor = (
    type: NotificationType,
  ): 'success' | 'information' | 'warning' | 'danger' => {
    const colorPerType = {
      success: 'success' as 'success',
      info: 'information' as 'information',
      warning: 'warning' as 'warning',
      error: 'danger' as 'danger',
    };
    return colorPerType[type];
  };

  ngOnInit() {
    if (this.notification.duration !== 0) {
      this.remainingTime = this.notification.duration ?? 5000;
      this.startTimer();
    }

    if (this.notification.animation !== 'fade') {
      this.notification.animation =
        window.innerWidth <= 720 ? 'slideVertical' : 'slideHorizontal';
    }
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  pauseTimer() {
    if (this.isPaused || this.notification.duration === 0) return;

    this.clearTimer();
    const elapsed = Date.now() - this.startTime;
    this.remainingTime -= elapsed;
    this.isPaused = true;
  }

  resumeTimer() {
    if (!this.isPaused || this.notification.duration === 0) return;
    this.startTimer();
  }

  private startTimer() {
    this.startTime = Date.now();
    this.clearTimer();
    this.timeoutId = setTimeout(() => this.dismiss.emit(), this.remainingTime);
    this.isPaused = false;
  }

  private clearTimer() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
