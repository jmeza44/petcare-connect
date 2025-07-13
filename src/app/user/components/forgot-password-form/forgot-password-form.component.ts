import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormInputComponent } from '../../../shared/components/inputs/form-input/form-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { getFormControlAndState } from '../../../shared/utils/form-control.utils';

type ForgotPasswordForm = FormGroup<{
  email: FormControl<string | null>;
}>;

@Component({
  selector: 'pet-forgot-password-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormInputComponent, ButtonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="mb-6">
        <pet-form-input
          label="Correo electrónico"
          placeholder="Introduce tu correo electrónico"
          type="email"
          autocomplete="email"
          [control]="emailControl.control!"
          [touched]="emailControl.state.touched"
          [invalid]="emailControl.state.invalid"
          [errors]="emailControl.state.errors"
          [customErrors]="{
            required: 'El correo electrónico es obligatorio.',
            email: 'Introduce un correo electrónico válido.',
          }"
        />
      </div>

      <pet-button
        class="w-full"
        [isDisabled]="form.invalid || isLoading()"
        [isLoading]="isLoading()"
        color="primary"
        loadingText="Enviando..."
        size="medium"
        styling="filled"
        text="Enviar enlace de recuperación"
        type="submit"
      />
    </form>
  `,
})
export class ForgotPasswordFormComponent {
  readonly email = input<string | null>(null);
  readonly isLoading = input(false);
  readonly forgotPasswordSubmitted = output<{ email: string }>();

  readonly form: ForgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get emailControl() {
    return getFormControlAndState(this.form, 'email');
  }

  constructor() {
    effect(() => {
      const initialEmail = this.email();
      const currentValue = this.form.controls.email.value;
      if (initialEmail && !currentValue) {
        this.form.controls.email.setValue(initialEmail);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const { email } = this.form.value;
    this.forgotPasswordSubmitted.emit({ email: email! });
  }
}
