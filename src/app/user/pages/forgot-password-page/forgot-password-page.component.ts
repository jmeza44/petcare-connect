import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ForgotPasswordFormComponent } from '../../components/forgot-password-form/forgot-password-form.component';
import { UserService } from '../../services/user.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, ForgotPasswordFormComponent],
  templateUrl: './forgot-password-page.component.html',
  styles: ``,
})
export class ForgotPasswordPageComponent {
  isLoading = false;
  emailSent = false;

  constructor(private userService: UserService) {}

  handleForgotPassword({ email }: { email: string }) {
    this.isLoading = true;
    this.userService.forgotPassword({ email }).subscribe({
      next: () => {
        this.isLoading = false;
        this.emailSent = true;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
