import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SelectOption } from '../../../types/select-option.type';
import { ValidationErrorsMap } from '../../../types/validation-errors.type';

@Component({
  selector: 'pet-form-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full" [class]="customClass()">
      <label
        class="block text-sm font-medium text-gray-700"
        [for]="controlId"
        [class.text-red-500]="isInvalid()"
      >
        {{ label() }}{{ isRequired() ? '*' : '' }}
      </label>

      <div class="relative mt-2">
        <select
          [id]="controlId"
          [formControl]="control()"
          [class.border-red-500]="isInvalid()"
          class="w-full appearance-none rounded-md border border-gray-300 bg-white p-3 pr-10 text-sm focus:ring-2 focus:ring-primary-500 focus-visible:outline-0"
        >
          @if (placeholder()) {
            <option [value]="''" disabled selected hidden class="text-gray-400">
              {{ placeholder() }}
            </option>
          }

          @for (option of options(); track $index) {
            <option
              [value]="option.value"
              class="bg-white text-gray-700 hover:bg-primary-100"
            >
              {{ option.label }}
            </option>
          }
        </select>

        <!-- Chevron Icon -->
        <fa-icon
          [icon]="chevronIcon"
          class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
        />
      </div>

      @if (isInvalid() && errorMessages().length > 0) {
        <ul class="list-unstyled mt-1 list-outside text-sm text-red-500">
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
export class FormSelectComponent<T = unknown> {
  // Inputs
  label = input<string>('Seleccione');
  placeholder = input<string>('Seleccione una opción');
  control = input.required<FormControl<T>>();
  touched = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<Record<string, unknown> | null>(null);
  options = input<SelectOption<T>[]>([]);
  customErrors = input<ValidationErrorsMap>({});
  customClass = input<string>('');

  // Icon
  readonly chevronIcon = faChevronDown;

  // Internal ID
  readonly controlId = crypto.randomUUID();

  // Computed state
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
        case 'mismatch':
          messages.push('La selección no coincide.');
          break;
        default:
          messages.push(`Error: ${key}`);
      }
    }

    return messages;
  });
}
