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

import { IdentificationType, RegisterUserRequest } from '../../models';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormInputComponent } from '../../../shared/components/inputs/form-input/form-input.component';
import { FormSelectComponent } from '../../../shared/components/inputs/form-select/form-select.component';
import { FormPasswordComponent } from '../../../shared/components/inputs/form-password/form-password.component';
import { getFormControlAndState } from '../../../shared/utils/form-control.utils';
import { passwordsMatchValidator } from '../../../shared/validators/passwords-match.validator';

type RegisterUserForm = FormGroup<{
  identificationType: FormControl<IdentificationType | null>;
  identificationNumber: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  cellphoneNumber: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}>;

@Component({
  selector: 'pet-register-user-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    FormSelectComponent,
    FormPasswordComponent,
    ButtonComponent,
  ],
  templateUrl: './register-user-form.component.html',
})
export class RegisterUserFormComponent {
  readonly isLoading = input(false);
  readonly submitted = output<RegisterUserRequest>();

  readonly form: RegisterUserForm = new FormGroup(
    {
      identificationType: new FormControl<IdentificationType | null>(
        null,
        Validators.required,
      ),
      identificationNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
      ]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      cellphoneNumber: new FormControl('', Validators.required),
      password: new FormControl('', [
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
      validators: passwordsMatchValidator('password', 'confirmPassword'),
    },
  );

  readonly identificationTypes = IdentificationType;

  get identificationTypeControl() {
    return getFormControlAndState(this.form, 'identificationType');
  }

  get identificationNumberControl() {
    return getFormControlAndState(this.form, 'identificationNumber');
  }

  get firstNameControl() {
    return getFormControlAndState(this.form, 'firstName');
  }

  get lastNameControl() {
    return getFormControlAndState(this.form, 'lastName');
  }

  get emailControl() {
    return getFormControlAndState(this.form, 'email');
  }

  get cellphoneControl() {
    return getFormControlAndState(this.form, 'cellphoneNumber');
  }

  get passwordControl() {
    return getFormControlAndState(this.form, 'password');
  }

  get confirmPasswordControl() {
    return getFormControlAndState(this.form, 'confirmPassword');
  }

  submit(): void {
    if (this.form.invalid) return;

    const {
      identificationType,
      identificationNumber,
      firstName,
      lastName,
      email,
      cellphoneNumber,
      password,
      confirmPassword,
    } = this.form.value;

    this.submitted.emit({
      identificationType: identificationType!,
      identificationNumber: identificationNumber!,
      firstName: firstName!,
      lastName: lastName!,
      email: email!,
      cellphoneNumber: cellphoneNumber!,
      password: password!,
      confirmPassword: confirmPassword!,
    });
  }
}
