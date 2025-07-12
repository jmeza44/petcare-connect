import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormInputComponent } from '../../../shared/components/inputs/form-input/form-input.component';
import { FormPasswordComponent } from '../../../shared/components/inputs/form-password/form-password.component';
import { getFormControlAndState } from '../../../shared/utils/form-control.utils';

@Component({
  selector: 'pet-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    FormInputComponent,
    FormPasswordComponent,
  ],
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
      Validators.minLength(8),
    ]),
  });

  get emailControl() {
    return getFormControlAndState(this.form, 'email');
  }

  get passwordControl() {
    return getFormControlAndState(this.form, 'password');
  }

  submit(): void {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.loginSubmitted.emit({ email: email!, password: password! });
    }
  }
}
