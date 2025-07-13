import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
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
import { FormPasswordComponent } from '../../../shared/components/inputs/form-password/form-password.component';
import { getFormControlAndState } from '../../../shared/utils/form-control.utils';
import { passwordsMatchValidator } from '../../../shared/validators/passwords-match.validator';
import { passwordsMustDifferValidator } from '../../../shared/validators/passwords-must-differ.validator';
import { ChangePasswordRequest } from '../../models';

type ChangePasswordForm = FormGroup<{
  currentPassword: FormControl<string | null>;
  newPassword: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}>;

@Component({
  selector: 'pet-change-password-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormPasswordComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './change-password-form.component.html',
})
export class ChangePasswordFormComponent {
  readonly isLoading = input<boolean>(false);
  readonly submitted = output<ChangePasswordRequest>();

  readonly form: ChangePasswordForm = new FormGroup(
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
      validators: [
        passwordsMatchValidator('newPassword', 'confirmPassword'),
        passwordsMustDifferValidator('currentPassword', 'newPassword'),
      ],
    },
  );

  get currentPasswordControl() {
    return getFormControlAndState(this.form, 'currentPassword');
  }

  get newPasswordControl() {
    return getFormControlAndState(this.form, 'newPassword');
  }

  get confirmPasswordControl() {
    return getFormControlAndState(this.form, 'confirmPassword');
  }

  submit(): void {
    if (this.form.invalid) return;

    const { currentPassword, newPassword } = this.form.value;
    if (!currentPassword || !newPassword) return;

    this.submitted.emit({ currentPassword, newPassword });
    this.form.reset();
  }
}
