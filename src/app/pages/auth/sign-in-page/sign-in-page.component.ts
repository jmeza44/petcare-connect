import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../global/services/auth/auth.service';
import { ButtonComponent } from '../../../components/shared/button/button.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, ButtonComponent],
  templateUrl: './sign-in-page.component.html',
  styles: ``
})
export class SignInPageComponent {
  signInForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }

  onSubmit(): void {
    if (this.signInForm.invalid) return;

    const { email, password } = this.signInForm.value;

    this.loading = true;
    this.authService.signIn(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Error al iniciar sesión. Por favor, verifique sus credenciales.';
      }
    });
  }
}
