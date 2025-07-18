import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorsMap } from '../../../types/validation-errors.type';

@Component({
  selector: 'pet-form-file',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="w-full" [class]="customClass()">
      <label
        [for]="controlId"
        class="block text-sm font-medium"
        [class.text-gray-700]="!isInvalid()"
        [class.text-red-500]="isInvalid()"
      >
        {{ label() }}{{ isRequired() ? '*' : '' }}
      </label>

      <input
        [id]="controlId"
        type="file"
        (change)="handleFileChange($event)"
        [attr.aria-invalid]="isInvalid()"
        class="mt-2 h-12 min-h-[3rem] w-full rounded-md border px-2 py-[0.35rem] file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-transparent file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-500 hover:file:bg-primary-100 focus:ring-2 focus:ring-primary-500 focus-visible:outline-0 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:file:cursor-not-allowed disabled:placeholder:text-gray-500"
        [class.border-red-500]="isInvalid()"
        [class.border-gray-300]="!isInvalid()"
        [accept]="accept()"
        [attr.accept]="accept()"
        [multiple]="multiple()"
        [attr.multiple]="multiple() ? '' : null"
        [disabled]="control().disabled"
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
  customClass = input<string>('');

  // Internal ID
  readonly controlId = crypto.randomUUID();

  // Derived state
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
