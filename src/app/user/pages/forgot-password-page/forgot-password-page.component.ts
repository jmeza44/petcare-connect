import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ForgotPasswordFormComponent } from '../../components/forgot-password-form/forgot-password-form.component';
import { UserService } from '../../services/user.service';

@Component({
    imports: [CommonModule, RouterLink, ForgotPasswordFormComponent],
    templateUrl: './forgot-password-page.component.html',
    styles: ``
})
export class ForgotPasswordPageComponent implements OnInit {
  isLoading = false;
  emailSent = false;
  initialEmail: string | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initialEmail = this.route.snapshot.queryParamMap.get('email');
  }

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
