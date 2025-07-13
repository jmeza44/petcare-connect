import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IdentificationType, RegisterUserRequest } from '../../models';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormSelectComponent } from '../../../shared/components/inputs/form-select/form-select.component';
import { getFormControlAndState } from '../../../shared/utils/form-control.utils';
import { FormInputComponent } from '../../../shared/components/inputs/form-input/form-input.component';
import { FormPasswordComponent } from '../../../shared/components/inputs/form-password/form-password.component';
import { passwordsMatchValidator } from '../../../shared/validators/passwords-match.validator';

@Component({
  selector: 'pet-register-user-form',
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    FormSelectComponent,
    ButtonComponent,
    FormPasswordComponent,
  ],
  templateUrl: './register-user-form.component.html',
})
export class RegisterUserFormComponent {
  @Input() isLoading: boolean = false;
  @Output() submitted = new EventEmitter<RegisterUserRequest>();

  form = new FormGroup(
    {
      identificationType: new FormControl(null, Validators.required),
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
      cellphoneNumber: new FormControl('', [Validators.required]),
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
    { validators: passwordsMatchValidator('password', 'confirmPassword') },
  );
  identificationTypes = IdentificationType;

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

  submit() {
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

    const request: RegisterUserRequest = {
      identificationType: identificationType!,
      identificationNumber: identificationNumber!,
      firstName: firstName!,
      lastName: lastName!,
      email: email!,
      cellphoneNumber: cellphoneNumber!,
      password: password!,
      confirmPassword: confirmPassword!,
    };

    this.submitted.emit(request);
  }
}
