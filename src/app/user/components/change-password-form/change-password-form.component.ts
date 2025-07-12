import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ChangePasswordRequest } from '../../models';
import { FormPasswordComponent } from '../../../shared/components/inputs/form-password/form-password.component';
import { getFormControlAndState } from '../../../shared/utils/form-control.utils';

@Component({
  selector: 'pet-change-password-form',
  imports: [ReactiveFormsModule, FormPasswordComponent, ButtonComponent],
  templateUrl: './change-password-form.component.html',
})
export class ChangePasswordFormComponent {
  @Input() isLoading = false;
  @Output() submitted = new EventEmitter<ChangePasswordRequest>();

  form = new FormGroup(
    {
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[^a-zA-Z0-9]/),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    },
    {
      validators: [this.passwordsMustDiffer.bind(this)],
    } as AbstractControlOptions,
  );

  constructor() {}

  get currentPasswordControl() {
    return getFormControlAndState(this.form, 'currentPassword');
  }

  get newPasswordControl() {
    return getFormControlAndState(this.form, 'newPassword');
  }

  get confirmPasswordControl() {
    return getFormControlAndState(this.form, 'confirmPassword');
  }

  submit() {
    if (
      this.form.invalid ||
      !this.form.value.currentPassword ||
      !this.form.value.newPassword
    )
      return;

    if (this.form.value.newPassword !== this.form.value.confirmPassword) {
      this.form.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }

    this.submitted.emit({
      currentPassword: this.form.value.currentPassword,
      newPassword: this.form.value.newPassword,
    });

    this.form.reset();
  }

  private passwordsMustDiffer(
    control: AbstractControl,
  ): ValidationErrors | null {
    const group = control as FormGroup;
    const current = group.get('currentPassword')?.value;
    const newPass = group.get('newPassword')?.value;

    if (current && newPass && current === newPass) {
      group.get('newPassword')?.setErrors({ sameAsCurrent: true });
      return { sameAsCurrent: true };
    }

    return null;
  }
}
