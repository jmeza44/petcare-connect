import { Component, input, output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'pet-login-form',
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './login-form.component.html',
  styles: ``,
})
export class LoginFormComponent {
  readonly isLoading = input(false);
  readonly loginSubmitted = output<{ email: string; password: string }>();

  readonly errorMessage = signal('');

  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  submit(): void {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.loginSubmitted.emit({ email: email!, password: password! });
    }
  }

  setError(message: string): void {
    this.errorMessage.set(message);
  }
}
