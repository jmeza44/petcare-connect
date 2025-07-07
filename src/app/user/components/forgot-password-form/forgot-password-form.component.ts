import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'pet-forgot-password-form',
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './forgot-password-form.component.html',
  styles: ``,
})
export class ForgotPasswordFormComponent implements OnChanges {
  @Input() isLoading = false;
  @Input() email: string | null = null; // 👈 Accept the initial email
  @Output() forgotPasswordSubmitted = new EventEmitter<{ email: string }>();

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  errorMessage = '';

  get emailControl() {
    return this.form.get('email');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['email'] && this.email && !this.emailControl?.value) {
      this.emailControl?.setValue(this.email);
    }
  }

  submit(): void {
    if (this.form.valid) {
      const { email } = this.form.value;
      this.forgotPasswordSubmitted.emit({ email: email! });
    }
  }

  setError(message: string): void {
    this.errorMessage = message;
  }
}
