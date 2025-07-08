import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { ValidationErrorsMap } from '../../../types/validation-errors.type';

@Component({
  selector: 'pet-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <label class="block text-sm font-medium text-gray-700" [for]="controlId">
        {{ label() }}
      </label>

      <input
        [id]="controlId"
        [type]="type()"
        [formControl]="control()"
        [attr.autocomplete]="autocomplete()"
        [placeholder]="placeholder()"
        [mask]="mask()"
        [class.border-red-500]="isInvalid()"
        class="mt-2 w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-primary-500 focus-visible:outline-0"
      />

      @if (isInvalid() && errorMessages().length > 0) {
        <div class="mt-1 text-sm text-red-500">
          @for (message of errorMessages(); track message) {
            <div>{{ message }}</div>
          }
        </div>
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
  type = input<'text' | 'email' | 'tel' | 'number'>('text');
  placeholder = input<string>('');
  autocomplete = input<string>('off');
  mask = input<string | null>(null);
  control = input.required<FormControl<any>>();
  touched = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<Record<string, any> | null>(null);
  customErrors = input<ValidationErrorsMap>({});

  // Stable ID
  readonly controlId = crypto.randomUUID();

  // Computed
  readonly isInvalid = computed(() => this.touched() && this.invalid());

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
        default:
          messages.push(`Error: ${key}`);
      }
    }

    return messages;
  });
}
