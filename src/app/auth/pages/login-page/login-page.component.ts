import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { ConfirmEmailAddressButtonComponent } from '../../../user/components/confirm-email-address-button/confirm-email-address-button.component';

@Component({
  imports: [RouterLink, LoginFormComponent, ConfirmEmailAddressButtonComponent],
  templateUrl: './login-page.component.html',
  styles: ``,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly registeredEmail = signal<string | null>(null);

  handleLogin({ email, password }: { email: string; password: string }) {
    this.isLoading.set(true);
    this.registeredEmail.set(null);

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        if (error.error?.error === 'USER_EMAIL_NOT_CONFIRMED') {
          this.registeredEmail.set(email);
        }
        this.isLoading.set(false);
      },
    });
  }
}
