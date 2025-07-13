import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ResetPasswordRequest } from '../../models';
import { passwordsMatchValidator } from '../../../shared/validators/passwords-match.validator';
import { FormPasswordComponent } from '../../../shared/components/inputs/form-password/form-password.component';
import { getFormControlAndState } from '../../../shared/utils/form-control.utils';

@Component({
  selector: 'pet-reset-password-form',
  imports: [ReactiveFormsModule, FormPasswordComponent, ButtonComponent],
  templateUrl: './reset-password-form.component.html',
})
export class ResetPasswordFormComponent {
  @Input() isLoading = false;
  @Input() token: string = '';
  @Input() email: string = '';
  @Output() submitted = new EventEmitter<ResetPasswordRequest>();

  form = new FormGroup(
    {
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
      validators: [passwordsMatchValidator('newPassword', 'confirmPassword')],
    },
  );

  get newPasswordControl() {
    return getFormControlAndState(this.form, 'newPassword');
  }

  get confirmPasswordControl() {
    return getFormControlAndState(this.form, 'confirmPassword');
  }

  submit() {
    if (this.form.invalid) return;

    const { newPassword, confirmPassword } = this.form.value;

    const request: ResetPasswordRequest = {
      token: this.token,
      email: this.email,
      newPassword: newPassword!,
      confirmPassword: confirmPassword!,
    };

    this.submitted.emit(request);

    this.form.reset();
  }
}
