import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ValidationErrorsMap } from '../../../types/validation-errors.type';

@Component({
  selector: 'pet-form-file',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="w-full">
      <label
        [for]="controlId"
        class="block text-sm font-medium"
        [class.text-gray-700]="!isInvalid()"
        [class.text-red-500]="isInvalid()"
      >
        {{ label() }}
      </label>

      <input
        [id]="controlId"
        type="file"
        [formControl]="control()"
        [attr.aria-invalid]="isInvalid()"
        class="mt-2 w-full rounded-md border p-3 file:mr-4 file:rounded-md file:border-0 file:bg-primary-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white focus:ring-2 focus:ring-primary-500 focus-visible:outline-0"
        [class.border-red-500]="isInvalid()"
        [class.border-gray-300]="!isInvalid()"
        (change)="handleFileChange($event)"
        [attr.accept]="accept()"
        [attr.multiple]="multiple() ? '' : null"
      />

      @if (isInvalid() && errorMessages().length > 0) {
        <ul class="mt-1 list-none text-sm text-red-500">
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
export class FormFileComponent {
  // Inputs
  label = input<string>('Archivo');
  control = input.required<FormControl<any>>();
  touched = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<Record<string, unknown> | null>(null);
  customErrors = input<ValidationErrorsMap>({});
  accept = input<string>('');
  multiple = input<boolean>(false);

  // Internal ID
  readonly controlId = crypto.randomUUID();

  // Derived state
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
        case 'maxSize':
          messages.push('El archivo es demasiado grande.');
          break;
        case 'invalidType':
          messages.push('Tipo de archivo no permitido.');
          break;
        default:
          messages.push(`Error: ${key}`);
      }
    }

    return messages;
  });

  // Handle manual update of FormControl value
  handleFileChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const files = inputEl.files;

    if (!files) return;

    this.control().setValue(this.multiple() ? Array.from(files) : files[0]);
    this.control().markAsDirty();
    this.control().markAsTouched();
  }
}
