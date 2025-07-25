import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SelectOption } from '../../../types/select-option.type';
import { ValidationErrorsMap } from '../../../types/validation-errors.type';

@Component({
  selector: 'pet-form-select',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule],
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
          class="h-12 min-h-[3rem] w-full appearance-none rounded-md border border-gray-300 bg-white p-3 pr-10 text-sm focus:ring-2 focus:ring-primary-500 focus-visible:outline-0 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
          (change)="handleOnChange($event)"
        >
          @if (placeholder()) {
            <option
              [value]="undefined"
              disabled
              selected
              hidden
              class="text-gray-400 disabled:text-gray-500"
            >
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
export class FormSelectComponent<T> {
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

  // Outputs
  onChange = output<T>();

  // Icon
  readonly chevronIcon = faChevronDown;

  // Internal ID
  readonly controlId = crypto.randomUUID();

  // Computed state
  readonly isInvalid = computed(() => {
    const touched = this.touched();
    const invalid = this.invalid();
    const result = touched && invalid;
    return result;
  });

  readonly isRequired = computed(() => {
    const result = this.control().hasValidator(Validators.required);
    return result;
  });

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

  handleOnChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as T;
    this.onChange.emit(value);
  }
}
