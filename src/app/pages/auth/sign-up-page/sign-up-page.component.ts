import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './sign-up-page.component.html',
  styles: ``
})
export class SignUpPageComponent implements OnInit {
  signUpForm: FormGroup = new FormGroup({});
  errorMessage: string = '';
  callingCodes = [
    { value: '+1', label: 'Estados Unidos (+1)' },
    { value: '+44', label: 'Reino Unido (+44)' },
    { value: '+34', label: 'España (+34)' },
    { value: '+57', label: 'Colombia (+57)' },
    // Add more country calling codes as needed
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      callingCode: new FormControl('', [Validators.required]),
    });
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get firstName() {
    return this.signUpForm.get('firstName');
  }

  get lastName() {
    return this.signUpForm.get('lastName');
  }

  get phoneNumber() {
    return this.signUpForm.get('phoneNumber');
  }

  get address() {
    return this.signUpForm.get('address');
  }

  get city() {
    return this.signUpForm.get('city');
  }

  get department() {
    return this.signUpForm.get('department');
  }

  get zipCode() {
    return this.signUpForm.get('zipCode');
  }

  get callingCode() {
    return this.signUpForm.get('callingCode');
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      return;
    }

    const { email, password, firstName, lastName, phoneNumber, address, city, department, zipCode, callingCode } = this.signUpForm.value;

    this.authService.signUp(
      email, password, firstName, lastName, phoneNumber,
      { address, city, department, zipCode }, callingCode
    ).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }
}
