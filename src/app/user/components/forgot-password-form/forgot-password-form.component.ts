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
import { getFormControlAndState } from '../../../shared/utils/form-control.utils';
import { FormInputComponent } from '../../../shared/components/inputs/form-input/form-input.component';

@Component({
  selector: 'pet-forgot-password-form',
  imports: [ReactiveFormsModule, FormInputComponent, ButtonComponent],
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

  get emailControl() {
    return getFormControlAndState(this.form, 'email');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['email'] && this.email && !this.form.controls['email']?.value) {
      this.form.controls['email']?.setValue(this.email);
    }
  }

  submit(): void {
    if (this.form.valid) {
      const { email } = this.form.value;
      this.forgotPasswordSubmitted.emit({ email: email! });
    }
  }
}
