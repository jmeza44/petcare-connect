import { Component, Input, OnDestroy } from '@angular/core';

import { ButtonComponent } from '../../../shared/components/button/button.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'pet-confirm-email-address-button',
    imports: [ButtonComponent],
    templateUrl: './confirm-email-address-button.component.html',
    styles: `
    :host {
      display: contents;
    }
  `
})
export class ConfirmEmailAddressButtonComponent implements OnDestroy {
  @Input() email!: string;
  @Input() styling: 'filled' | 'outline' | 'link' = 'link';
  @Input() size: 'default' | 'full' = 'default';

  isResending = false;
  isCoolDown = false;
  countdown = 30;
  private coolDownInterval: number | undefined = undefined;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  ngOnDestroy(): void {
    if (this.coolDownInterval !== undefined) {
      window.clearInterval(this.coolDownInterval);
    }
  }

  resendEmail(): void {
    if (!this.email || this.isCoolDown) return;

    this.isResending = true;
    this.userService.resendConfirmationEmail({ email: this.email }).subscribe({
      next: () => {
        this.notificationService.success(
          'Correo reenviado. Por favor, revisa tu bandeja de entrada.',
        );
        this.startCoolDown();
      },
      error: () => {
        this.notificationService.warning(
          'Ocurrió un error al reenviar el correo. Intenta nuevamente.',
        );
        this.isResending = false;
      },
    });
  }

  private startCoolDown(): void {
    this.isResending = false;
    this.isCoolDown = true;
    this.countdown = 30;

    this.coolDownInterval = window.setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        window.clearInterval(this.coolDownInterval);
        this.isCoolDown = false;
      }
    }, 1000);
  }
}
