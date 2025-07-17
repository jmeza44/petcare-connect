import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../button/button.component';
import { ValidationErrorsMap } from '../../../types/validation-errors.type';

@Component({
  selector: 'pet-form-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ButtonComponent,
  ],
  template: `
    <div class="w-full" [class]="customClass()">
      <label
        [attr.for]="controlId"
        class="block text-sm font-medium"
        [class.text-gray-700]="!isInvalid()"
        [class.text-red-500]="isInvalid()"
      >
        {{ label() }}{{ isRequired() ? '*' : '' }}
      </label>

      <div class="group relative mt-2">
        <input
          [id]="controlId"
          [type]="visible() ? 'text' : 'password'"
          [formControl]="control()"
          [attr.autocomplete]="autocomplete()"
          [placeholder]="placeholder()"
          [attr.aria-invalid]="isInvalid()"
          class="h-12 min-h-[3rem] w-full rounded-md border p-3 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus-visible:outline-0"
          [class.border-red-500]="isInvalid()"
          [class.border-gray-300]="!isInvalid()"
        />

        <pet-button
          customClass="absolute right-2 top-1/2 -translate-y-1/2 p-0 hidden group-hover:block"
          [type]="'button'"
          [icon]="visible() ? faEyeSlash : faEye"
          [size]="'small'"
          [styling]="'link'"
          [color]="'basic'"
          [ariaLabel]="visible() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          [hideText]="true"
          (clickTriggered)="toggleVisibility()"
        ></pet-button>
      </div>

      @if (isInvalid() && errorMessages().length > 0) {
        <ul class="mt-1 list-outside list-none text-sm text-red-500">
          @for (message of errorMessages(); track $index) {
            <li>{{ message }}</li>
          }
        </ul>
      }
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class FormPasswordComponent {
  // Inputs
  label = input<string>('Contraseña');
  placeholder = input<string>('Escribe tu contraseña');
  autocomplete = input<string>('new-password');
  control = input.required<FormControl<any>>();
  touched = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<Record<string, any> | null>(null);
  customErrors = input<ValidationErrorsMap>({});
  customClass = input<string>('');

  // Local state
  readonly visible = signal(false);
  readonly controlId = crypto.randomUUID();

  // Toggle password visibility
  toggleVisibility(): void {
    this.visible.update((v) => !v);
  }

  // Computed
  readonly isInvalid = computed(() => this.touched() && this.invalid());
  readonly isRequired = computed(() =>
    this.control().hasValidator(Validators.required),
  );

  readonly errorMessages = computed(() => {
    const errors = this.errors() ?? {};
    const custom = this.customErrors();
    const messages: string[] = [];

    for (const key of Object.keys(errors)) {
      if (custom?.[key]) {
        messages.push(custom[key]!);
        continue;
      }

      switch (key) {
        case 'required':
          messages.push('Este campo es obligatorio.');
          break;
        case 'minlength':
          messages.push(
            `Mínimo ${errors['minlength']?.requiredLength} caracteres.`,
          );
          break;
        case 'maxlength':
          messages.push(
            `Máximo ${errors['maxlength']?.requiredLength} caracteres.`,
          );
          break;
        case 'pattern':
          messages.push('La contraseña no cumple con el formato requerido.');
          break;
        case 'mismatch':
          messages.push('Las contraseñas no coinciden.');
          break;
        case 'sameAsCurrent':
          messages.push('La nueva contraseña no puede ser igual a la actual.');
          break;
        default:
          messages.push(`Error: ${key}`);
      }
    }

    return messages;
  });

  // Icons
  faEye = faEye;
  faEyeSlash = faEyeSlash;
}
