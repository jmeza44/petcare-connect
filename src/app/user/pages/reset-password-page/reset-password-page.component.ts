import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordFormComponent } from '../../components/reset-password-form/reset-password-form.component';
import { ResetPasswordRequest } from '../../models';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, ResetPasswordFormComponent],
  templateUrl: './reset-password-page.component.html',
  styles: ``,
})
export class ResetPasswordPageComponent {
  token = '';
  email = '';
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
    });
  }

  handleResetPassword(request: ResetPasswordRequest) {
    this.isLoading = true;
    this.userService
      .resetPassword(request)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Contraseña restablecida correctamente. Ahora puedes iniciar sesión.',
          );
          this.router.navigate(['/ingreso']);
        },
      });
  }
}
