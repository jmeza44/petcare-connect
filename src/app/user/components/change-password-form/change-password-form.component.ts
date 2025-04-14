import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangePasswordRequest } from '../../models';

@Component({
    selector: 'pet-change-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './change-password-form.component.html',
})
export class ChangePasswordComponent {
    @Output() submitted = new EventEmitter<ChangePasswordRequest>();

    form: FormGroup;
    loading = false;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            currentPassword: ['', [Validators.required]],
            newPassword: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/[A-Z]/), // Uppercase
                Validators.pattern(/[a-z]/), // Lowercase
                Validators.pattern(/[0-9]/), // Number
                Validators.pattern(/[^a-zA-Z0-9]/) // Special character
            ]]
        });
    }

    get f() {
        return this.form.controls;
    }

    submit() {
        if (this.form.invalid) return;

        this.loading = true;
        const command: ChangePasswordRequest = this.form.value;
        this.submitted.emit(command);
    }
}
