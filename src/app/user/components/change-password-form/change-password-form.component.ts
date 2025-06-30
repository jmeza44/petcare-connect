import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ChangePasswordRequest } from '../../models';

@Component({
    selector: 'pet-change-password-form',
    imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
    templateUrl: './change-password-form.component.html'
})
export class ChangePasswordFormComponent {
  @Input() isLoading = false;
  @Output() submitted = new EventEmitter<ChangePasswordRequest>();

  form: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: [
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
      },
      {
        validators: [this.passwordsMustDiffer.bind(this)],
      } as AbstractControlOptions,
    );
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) return;

    if (this.form.value.newPassword !== this.form.value.confirmPassword) {
      this.form.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }

    this.errorMessage = '';
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
