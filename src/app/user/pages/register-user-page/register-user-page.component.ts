import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RegisterUserFormComponent } from '../../components/register-user-form/register-user-form.component';
import { RegisterUserRequest } from '../../models';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RegisterUserFormComponent,
  ],
  templateUrl: './register-user-page.component.html',
  styles: [``]
})
export class RegisterUserPageComponent implements OnInit {
  isLoading = false;
  errorMessage: string = '';
  registrationSuccessful = false;
  registeredEmail: string | null = null;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void { }

  handleFormSubmitted(data: RegisterUserRequest): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.userService.register(data).subscribe({
      next: () => {
        this.registrationSuccessful = true;
        this.registeredEmail = data.email;
        this.notificationService.success(
          'Revisa tu correo electrónico para confirmar tu cuenta.',
          'Registro exitoso'
        );
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error.message;
        this.isLoading = false;
      },
    });
  }
}
