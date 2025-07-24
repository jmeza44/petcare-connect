import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  computed,
  OnInit,
  inject,
  effect,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormSelectComponent } from '../form-select/form-select.component';
import { SelectOption } from '../../../types/select-option.type';
import { LocationService } from '../../../services/location.service';

@Component({
  selector: 'pet-department-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormSelectComponent],
  template: `
    <pet-form-select
      [label]="label()"
      [placeholder]="placeholder()"
      [control]="control()"
      [touched]="touched()"
      [invalid]="invalid()"
      [errors]="errors()"
      [options]="departments()"
      [customErrors]="customErrors()"
      [customClass]="customClass()"
      (onChange)="handleChange($event)"
    />
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class DepartmentSelectComponent implements OnInit {
  // Injects
  readonly locationService = inject(LocationService);

  // Inputs
  label = input<string>('Departamento');
  placeholder = input<string>('Selecciona un departamento');
  control = input.required<FormControl<number | undefined>>();
  touched = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<Record<string, unknown> | null>(null);
  customErrors = input<Record<string, string>>({});
  customClass = input<string>('');
  initialValue = input<string | undefined>();
  includeAllOption = input<boolean>(true);
  allOptionLabel = input<string>('Todos los departamentos');

  // Outputs
  readonly departmentChange = output<number | undefined>();
  readonly departmentNameChange = output<string | undefined>();

  // Signals
  readonly departments = signal<SelectOption<number | undefined>[]>([]);
  readonly isLoading = signal(true);

  // Computed
  readonly selectedDepartmentName = computed(() => {
    const selectedId = this.control().value;
    if (selectedId === undefined || selectedId === null) {
      return undefined;
    }
    return this.departments().find((d) => d.value === selectedId)?.label;
  });

  constructor() {
    // Effects are handled explicitly in change handlers for better control
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  private loadDepartments(): void {
    this.locationService.getDepartments().subscribe((depts) => {
      const options: SelectOption<number | undefined>[] = [];

      if (this.includeAllOption()) {
        options.push({
          label: this.allOptionLabel(),
          value: undefined,
        });
      }

      options.push(...depts);
      this.departments.set(options);

      // Set initial value if provided
      const initialName = this.initialValue();
      if (initialName) {
        const foundDept = options.find((d) => d.label === initialName);
        if (foundDept && foundDept.value !== undefined) {
          this.control().setValue(foundDept.value, { emitEvent: false });
        }
      }

      this.isLoading.set(false);
    });
  }

  handleChange(value: number | undefined): void {
    // Convert string to number if needed (from HTML select)
    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
    const finalValue = isNaN(numericValue as number) ? undefined : numericValue;

    this.departmentChange.emit(finalValue);

    // Also emit the department name
    const departmentName = this.getDepartmentName(finalValue);
    this.departmentNameChange.emit(departmentName);
  }

  /**
   * Gets the department name for a given ID
   */
  getDepartmentName(id: number | undefined): string | undefined {
    if (id === undefined || id === null) {
      return undefined;
    }
    return this.departments().find((d) => d.value === id)?.label;
  }

  /**
   * Resets the department selection
   */
  reset(): void {
    // Check if control is available before trying to access it
    const controlInstance = this.control();
    if (controlInstance) {
      controlInstance.setValue(undefined);
    }
  }
}
