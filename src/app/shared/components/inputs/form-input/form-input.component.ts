import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { ValidationErrorsMap } from '../../../types/validation-errors.type';

@Component({
  selector: 'pet-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full" [class]="customClass()">
      <label
        class="block text-sm font-medium"
        [class.text-gray-700]="!isInvalid()"
        [class.text-red-500]="isInvalid()"
        [attr.for]="controlId"
      >
        {{ label() }}{{ isRequired() ? '*' : '' }}
      </label>

      <input
        [id]="controlId"
        [type]="type()"
        [formControl]="control()"
        [attr.autocomplete]="autocomplete()"
        [placeholder]="placeholder()"
        [mask]="type() !== 'date' ? mask() : null"
        [attr.aria-invalid]="isInvalid()"
        class="mt-2 h-12 min-h-[3rem] w-full rounded-md border p-3 focus:ring-2 focus:ring-primary-500 focus-visible:outline-0"
        [class.border-red-500]="isInvalid()"
        [class.border-gray-300]="!isInvalid()"
      />

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
export class FormInputComponent {
  // Inputs
  label = input<string>('');
  type = input<'text' | 'email' | 'tel' | 'number' | 'date'>('text');
  placeholder = input<string>('');
  autocomplete = input<string>('off');
  mask = input<string | null>(null);
  control = input.required<FormControl<any>>();
  touched = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<Record<string, any> | null>(null);
  customErrors = input<ValidationErrorsMap>({});
  readonly customClass = input<string>('');

  // Stable ID
  readonly controlId = crypto.randomUUID();

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
        case 'email':
          messages.push('Correo electrónico inválido.');
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
          messages.push('Formato inválido.');
          break;
        case 'mismatch':
          messages.push('Los valores no coinciden.');
          break;
        case 'mask':
          break;
        default:
          messages.push(`Error: ${key}`);
      }
    }

    return messages;
  });
}
