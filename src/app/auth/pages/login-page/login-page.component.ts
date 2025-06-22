import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { ConfirmEmailAddressButtonComponent } from '../../../user/components/confirm-email-address-button/confirm-email-address-button.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LoginFormComponent,
    ConfirmEmailAddressButtonComponent,
  ],
  templateUrl: './login-page.component.html',
  styles: ``,
})
export class LoginPageComponent {
  isLoading = false;
  registeredEmail: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  handleLogin({ email, password }: { email: string; password: string }) {
    this.isLoading = true;
    this.registeredEmail = null;
    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        if (error.error && error.error.error === 'USER_EMAIL_NOT_CONFIRMED') {
          this.registeredEmail = email;
        }
        this.isLoading = false;
      },
    });
  }
}
