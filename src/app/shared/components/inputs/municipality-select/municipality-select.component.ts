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
  selector: 'pet-municipality-select',
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
      [options]="municipalities()"
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
export class MunicipalitySelectComponent implements OnInit {
  // Injects
  readonly locationService = inject(LocationService);

  // Inputs
  label = input<string>('Ciudad/Municipio');
  placeholder = input<string>('Selecciona una ciudad');
  control = input.required<FormControl<number | undefined>>();
  touched = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<Record<string, unknown> | null>(null);
  customErrors = input<Record<string, string>>({});
  customClass = input<string>('');
  departmentId = input<number | undefined>();
  initialValue = input<string | undefined>();
  includeAllOption = input<boolean>(true);
  allOptionLabel = input<string>('Todas las ciudades');

  // Outputs
  readonly municipalityChange = output<number | undefined>();
  readonly municipalityNameChange = output<string | undefined>();

  // Signals
  readonly municipalities = signal<SelectOption<number | undefined>[]>([]);
  readonly isLoading = signal(true);

  // Computed
  readonly selectedMunicipalityName = computed(() => {
    const selectedId = this.control().value;
    if (selectedId === undefined || selectedId === null) {
      return undefined;
    }
    return this.municipalities().find((m) => m.value === selectedId)?.label;
  });

  readonly hasOptions = computed(() => this.municipalities().length > 1);

  constructor() {
    // Watch for department changes and reload municipalities
    effect(() => {
      const deptId = this.departmentId();
      this.loadMunicipalities(deptId);
    });

    // Enable/disable control based on available options
    effect(() => {
      const hasOpts = this.hasOptions();
      if (hasOpts) {
        this.control().enable();
      } else {
        this.control().disable();
      }
    });

    // Name changes are handled explicitly in change handlers for better control
  }

  ngOnInit(): void {
    // Initial load will be triggered by the department effect
    if (this.departmentId() === undefined) {
      this.loadMunicipalities(undefined);
    }
  }

  private loadMunicipalities(departmentId: number | undefined): void {
    this.isLoading.set(true);

    // Clear current selection when department changes
    if (this.control().value !== undefined) {
      this.control().setValue(undefined);
    }

    this.locationService
      .getMunicipalitiesByDepartmentId(departmentId)
      .subscribe((munis) => {
        const options: SelectOption<number | undefined>[] = [];

        if (this.includeAllOption()) {
          options.push({
            label: this.allOptionLabel(),
            value: undefined,
          });
        }

        options.push(...munis);
        this.municipalities.set(options);

        // Set initial value if provided and we have options
        const initialName = this.initialValue();
        if (initialName && options.length > 1) {
          const foundMuni = options.find((m) => m.label === initialName);
          if (foundMuni && foundMuni.value !== undefined) {
            this.control().setValue(foundMuni.value, { emitEvent: false });
          }
        }

        this.isLoading.set(false);
      });
  }

  handleChange(value: number | undefined): void {
    // Convert string to number if needed (from HTML select)
    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
    const finalValue = isNaN(numericValue as number) ? undefined : numericValue;

    this.municipalityChange.emit(finalValue);

    // Also emit the municipality name
    const municipalityName = this.getMunicipalityName(finalValue);
    this.municipalityNameChange.emit(municipalityName);
  }

  /**
   * Gets the municipality name for a given ID
   */
  getMunicipalityName(id: number | undefined): string | undefined {
    if (id === undefined || id === null) {
      return undefined;
    }
    return this.municipalities().find((m) => m.value === id)?.label;
  }

  /**
   * Resets the municipality selection
   */
  reset(): void {
    // Check if control is available before trying to access it
    const controlInstance = this.control();
    if (controlInstance) {
      controlInstance.setValue(undefined);
    }
  }

  /**
   * Manually trigger reload of municipalities for a specific department
   */
  reloadMunicipalities(departmentId: number | undefined): void {
    this.loadMunicipalities(departmentId);
  }
}
