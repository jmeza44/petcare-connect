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
  selector: 'pet-forgot-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './forgot-password-form.component.html',
  styles: ``,
})
export class ForgotPasswordFormComponent {
  @Input() isLoading = false;
  @Output() forgotPasswordSubmitted = new EventEmitter<{ email: string }>();

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  errorMessage = '';

  get email() {
    return this.form.get('email');
  }

  submit(): void {
    if (this.form.valid) {
      const { email } = this.form.value;
      this.forgotPasswordSubmitted.emit({ email: email! });
    }
  }

  setError(message: string): void {
    this.errorMessage = message;
  }
}
