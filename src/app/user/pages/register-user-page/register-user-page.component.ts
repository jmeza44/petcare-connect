import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RegisterUserFormComponent } from '../../components/register-user-form/register-user-form.component';
import { RegisterUserRequest } from '../../models';
import { NotificationService } from '../../../shared/services/notification.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RegisterUserFormComponent,
    ButtonComponent,
  ],
  templateUrl: './register-user-page.component.html',
  styles: [``],
})
export class RegisterUserPageComponent implements OnInit {
  isLoading = false;
  isResending = false;
  isCooldown = false;
  countdown = 30;
  cooldownInterval: any;
  errorMessage: string = '';
  registrationSuccessful = false;
  registeredEmail: string | null = null;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {}

  handleFormSubmitted(data: RegisterUserRequest): void {
    this.isLoading = true;
    this.errorMessage = '';
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
        this.errorMessage = error.error.message;
        this.isLoading = false;
      },
    });
  }

  resendEmail(): void {
    if (!this.registeredEmail || this.isCooldown) return;

    this.isResending = true;
    this.userService
      .resendConfirmationEmail({ email: this.registeredEmail })
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Correo reenviado. Por favor, revisa tu bandeja de entrada.',
          );
          this.startCooldown();
        },
        error: () => {
          this.notificationService.warning(
            'Ocurrió un error al reenviar el correo. Intenta nuevamente.',
          );
          this.isResending = false;
        },
      });
  }

  private startCooldown(): void {
    this.isResending = false;
    this.isCooldown = true;
    this.countdown = 30;

    this.cooldownInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(this.cooldownInterval);
        this.isCooldown = false;
      }
    }, 1000);
  }
}
