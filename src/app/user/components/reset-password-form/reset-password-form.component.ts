import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ResetPasswordRequest } from '../../models';
import { FormPasswordComponent } from '../../../shared/components/inputs/form-password/form-password.component';
import { passwordsMatchValidator } from '../../../shared/validators/passwords-match.validator';
import { getFormControlAndState } from '../../../shared/utils/form-control.utils';

type ResetPasswordForm = FormGroup<{
  newPassword: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}>;

@Component({
  selector: 'pet-reset-password-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormPasswordComponent, ButtonComponent],
  templateUrl: './reset-password-form.component.html',
})
export class ResetPasswordFormComponent {
  readonly isLoading = input(false);
  readonly token = input('');
  readonly email = input('');
  readonly submitted = output<ResetPasswordRequest>();

  readonly form: ResetPasswordForm = new FormGroup(
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

  submit(): void {
    if (this.form.invalid) return;

    const { newPassword, confirmPassword } = this.form.value;

    this.submitted.emit({
      token: this.token(),
      email: this.email(),
      newPassword: newPassword!,
      confirmPassword: confirmPassword!,
    });

    this.form.reset();
  }
}
