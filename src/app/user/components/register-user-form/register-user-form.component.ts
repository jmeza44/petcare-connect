import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IdentificationType, RegisterUserRequest } from '../../models';
import { NgxMaskDirective } from 'ngx-mask';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
    selector: 'pet-register-user-form',
    imports: [
        CommonModule,
        NgxMaskDirective,
        ReactiveFormsModule,
        ButtonComponent,
    ],
    templateUrl: './register-user-form.component.html'
})
export class RegisterUserFormComponent {
  @Input() isLoading: boolean = false;
  @Output() submitted = new EventEmitter<RegisterUserRequest>();

  form: FormGroup;
  errorMessage: string = '';
  identificationTypes = IdentificationType;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      identificationType: [null, Validators.required],
      identificationNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/), // Only numeric
        ],
      ],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      cellphoneNumber: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/[a-z]/),
          Validators.pattern(/[0-9]/),
          Validators.pattern(/[^a-zA-Z0-9]/),
        ],
      ],
      confirmPassword: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) return;

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.form.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }

    this.errorMessage = '';
    this.submitted.emit({
      ...this.form.value,
      identificationType: +this.form.value.identificationType,
    });
  }
}
