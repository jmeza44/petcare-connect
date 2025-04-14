import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResetPasswordRequest } from '../../models';

@Component({
    selector: 'pet-reset-password-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './reset-password-form.component.html',
})
export class ResetPasswordFormComponent {
    @Output() submitted = new EventEmitter<ResetPasswordRequest>();

    form: FormGroup;
    errorMessage = '';

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            token: ['', Validators.required],
            newPassword: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/[A-Z]/), // Uppercase
                Validators.pattern(/[a-z]/), // Lowercase
                Validators.pattern(/[0-9]/), // Number
                Validators.pattern(/[^a-zA-Z0-9]/) // Special character
            ]],
            confirmPassword: ['', Validators.required]
        });
    }

    get f() {
        return this.form.controls;
    }

    submit() {
        if (this.form.invalid) return;

        const { newPassword, confirmPassword } = this.form.value;
        if (newPassword !== confirmPassword) {
            this.errorMessage = 'Las contraseñas no coinciden.';
            return;
        }

        this.errorMessage = '';
        this.submitted.emit(this.form.value);
    }
}
