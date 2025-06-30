import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ChangePasswordFormComponent } from '../../components/change-password-form/change-password-form.component';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ChangePasswordRequest } from '../../models';

@Component({
    selector: 'pet-change-password-page',
    imports: [ChangePasswordFormComponent],
    templateUrl: './change-password-page.component.html',
    styles: [``]
})
export class ChangePasswordPageComponent {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private location: Location, // Inject Location
  ) {}

  handleSubmit(request: ChangePasswordRequest) {
    this.userService.changePassword(request).subscribe({
      next: () => {
        this.notificationService.success(
          'Tu contraseña ha sido cambiada exitosamente.',
          'Cambio exitoso',
        );
        this.location.back(); // Navigate back to the previous page
      },
      error: (error) => {
        this.notificationService.error(
          error.error?.message || 'Ocurrió un error al cambiar la contraseña.',
          'Error',
        );
      },
    });
  }
}
