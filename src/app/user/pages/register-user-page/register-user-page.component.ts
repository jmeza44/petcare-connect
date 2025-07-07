import { Component, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';
import { RegisterUserFormComponent } from '../../components/register-user-form/register-user-form.component';
import { ConfirmEmailAddressButtonComponent } from '../../components/confirm-email-address-button/confirm-email-address-button.component';
import { UserService } from '../../services/user.service';
import { RegisterUserRequest } from '../../models';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  imports: [
    RouterLink,
    RegisterUserFormComponent,
    ConfirmEmailAddressButtonComponent,
  ],
  templateUrl: './register-user-page.component.html',
  styles: [``],
})
export class RegisterUserPageComponent implements OnInit {
  isLoading = false;
  isResending = false;
  isCoolDown = false;
  countdown = 30;
  coolDownInterval: any;
  registrationSuccessful = false;
  registeredEmail: string | null = null;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {}

  handleFormSubmitted(data: RegisterUserRequest): void {
    this.isLoading = true;
    this.userService.register(data).subscribe({
      next: () => {
        this.registrationSuccessful = true;
        this.registeredEmail = data.email;
        this.notificationService.success(
          'Revisa tu correo electrónico para confirmar tu cuenta.',
          'Registro exitoso',
        );
        this.isLoading = false;
      },
      error: (error) => {
        if (error.error && error.error.error === 'USER_EMAIL_NOT_CONFIRMED') {
          this.registrationSuccessful = true;
          this.registeredEmail = data.email;
        }
        this.isLoading = false;
      },
    });
  }

  resendEmail(): void {
    if (!this.registeredEmail || this.isCoolDown) return;

    this.isResending = true;
    this.userService
      .resendConfirmationEmail({ email: this.registeredEmail })
      .subscribe({
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

    this.coolDownInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(this.coolDownInterval);
        this.isCoolDown = false;
      }
    }, 1000);
  }
}
