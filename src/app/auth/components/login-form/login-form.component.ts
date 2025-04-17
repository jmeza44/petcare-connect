import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'pet-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './login-form.component.html',
  styles: ``,
})
export class LoginFormComponent {
  @Input() isLoading = false;
  @Output() loginSubmitted = new EventEmitter<{
    email: string;
    password: string;
  }>();

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  errorMessage = '';

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
    this.errorMessage = message;
  }
}
