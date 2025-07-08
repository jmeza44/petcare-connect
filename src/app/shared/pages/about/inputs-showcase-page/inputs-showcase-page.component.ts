import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { FormInputComponent } from '../../../components/inputs/form-input/form-input.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { FormPasswordComponent } from '../../../components/inputs/form-password/form-password.component';
import { FormSelectComponent } from '../../../components/inputs/form-select/form-select.component';

@Component({
  selector: 'pet-input-showcase-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    FormPasswordComponent,
    FormSelectComponent,
    ButtonComponent,
  ],
  templateUrl: './inputs-showcase-page.component.html',
})
export class InputsShowcasePageComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required]],
      identification: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]*$/)],
      ],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      idType: ['', [Validators.required]],
    });
  }

  getFormControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  getState(controlName: string) {
    return {
      touched: this.getFormControl(controlName).touched,
      invalid: this.getFormControl(controlName).invalid,
      errors: this.getFormControl(controlName).errors,
    };
  }

  submit(): void {
    if (this.form.invalid) {
      // 🔹 Mark all controls as touched to trigger validation messages
      this.form.markAllAsTouched();
    } else {
      // 🔹 Optionally log valid values
      console.log('Form is valid!', this.form.value);
    }
  }
}
