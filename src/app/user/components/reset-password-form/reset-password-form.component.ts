import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ResetPasswordRequest } from '../../models';

@Component({
    selector: 'pet-reset-password-form',
    imports: [ReactiveFormsModule, ButtonComponent],
    templateUrl: './reset-password-form.component.html'
})
export class ResetPasswordFormComponent {
  @Input() isLoading = false;
  @Input() token: string = '';
  @Input() email: string = '';
  @Output() submitted = new EventEmitter<ResetPasswordRequest>();

  form: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/[A-Z]/), // Uppercase
            Validators.pattern(/[a-z]/), // Lowercase
            Validators.pattern(/[0-9]/), // Number
            Validators.pattern(/[^a-zA-Z0-9]/), // Special character
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [this.passwordsMustMatch.bind(this)],
      } as AbstractControlOptions,
    );
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) return;

    this.errorMessage = '';
    this.submitted.emit({
      token: this.token,
      email: this.email,
      newPassword: this.form.value.newPassword,
      confirmPassword: this.form.value.confirmPassword,
    });

    this.form.reset();
  }

  private passwordsMustMatch(
    control: AbstractControlOptions,
  ): ValidationErrors | null {
    const group = control as FormGroup;
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;

    if (password && confirm && password !== confirm) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    return null;
  }
}
