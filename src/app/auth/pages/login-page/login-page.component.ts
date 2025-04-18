import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, LoginFormComponent],
  templateUrl: './login-page.component.html',
  styles: ``,
})
export class LoginPageComponent {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  handleLogin({ email, password }: { email: string; password: string }) {
    this.isLoading = true;
    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
