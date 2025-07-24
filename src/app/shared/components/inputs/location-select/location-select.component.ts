import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  computed,
  OnInit,
  viewChild,
  effect,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DepartmentSelectComponent } from '../department-select/department-select.component';
import { MunicipalitySelectComponent } from '../municipality-select/municipality-select.component';
import { getFormControlAndState } from '../../../utils/form-control.utils';

export interface LocationSelectionValue {
  departmentId: number | undefined;
  departmentName: string | undefined;
  municipalityId: number | undefined;
  municipalityName: string | undefined;
}

@Component({
  selector: 'pet-location-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DepartmentSelectComponent, MunicipalitySelectComponent],
  template: `
    <div [class]="containerClass()">
      @if (departmentControlComputed().control) {
        <pet-department-select
          [label]="departmentLabel()"
          [placeholder]="departmentPlaceholder()"
          [control]="departmentControlComputed().control!"
          [touched]="departmentControlComputed().state.touched"
          [invalid]="departmentControlComputed().state.invalid"
          [errors]="departmentControlComputed().state.errors"
          [customErrors]="departmentCustomErrors()"
          [customClass]="departmentClass()"
          [initialValue]="initialDepartmentName()"
          [includeAllOption]="includeAllDepartmentOption()"
          [allOptionLabel]="allDepartmentLabel()"
          (departmentChange)="handleDepartmentChange($event)"
          (departmentNameChange)="handleDepartmentNameChange($event)"
        />
      }

      @if (municipalityControlComputed().control) {
        <pet-municipality-select
          [label]="municipalityLabel()"
          [placeholder]="municipalityPlaceholder()"
          [control]="municipalityControlComputed().control!"
          [touched]="municipalityControlComputed().state.touched"
          [invalid]="municipalityControlComputed().state.invalid"
          [errors]="municipalityControlComputed().state.errors"
          [customErrors]="municipalityCustomErrors()"
          [customClass]="municipalityClass()"
          [departmentId]="selectedDepartmentId()"
          [initialValue]="initialMunicipalityName()"
          [includeAllOption]="includeAllMunicipalityOption()"
          [allOptionLabel]="allMunicipalityLabel()"
          (municipalityChange)="handleMunicipalityChange($event)"
          (municipalityNameChange)="handleMunicipalityNameChange($event)"
        />
      }
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class LocationSelectComponent implements OnInit {
  // Dependency injection
  private readonly destroyRef = inject(DestroyRef);

  // ViewChild references
  readonly departmentSelect = viewChild(DepartmentSelectComponent);
  readonly municipalitySelect = viewChild(MunicipalitySelectComponent);

  // Inputs - Container
  containerClass = input<string>('flex flex-col gap-4');

  // Inputs - Form Controls
  form = input.required<any>(); // FormGroup

  // Inputs - Department
  departmentLabel = input<string>('Departamento');
  departmentPlaceholder = input<string>('Selecciona un departamento');
  departmentCustomErrors = input<Record<string, string>>({});
  departmentClass = input<string>('');
  includeAllDepartmentOption = input<boolean>(true);
  allDepartmentLabel = input<string>('Todos los departamentos');

  // Inputs - Municipality
  municipalityLabel = input<string>('Ciudad/Municipio');
  municipalityPlaceholder = input<string>('Selecciona una ciudad');
  municipalityCustomErrors = input<Record<string, string>>({});
  municipalityClass = input<string>('');
  includeAllMunicipalityOption = input<boolean>(true);
  allMunicipalityLabel = input<string>('Todas las ciudades');

  // Inputs - Initial Values
  initialDepartmentName = input<string | undefined>();
  initialMunicipalityName = input<string | undefined>();

  // Outputs
  readonly locationChange = output<LocationSelectionValue>();
  readonly departmentChange = output<number | undefined>();
  readonly municipalityChange = output<number | undefined>();

  // Signals
  readonly selectedDepartmentId = signal<number | undefined>(undefined);
  readonly selectedDepartmentName = signal<string | undefined>(undefined);
  readonly selectedMunicipalityId = signal<number | undefined>(undefined);
  readonly selectedMunicipalityName = signal<string | undefined>(undefined);

  // Form control state signals
  readonly departmentTouched = signal<boolean>(false);
  readonly departmentInvalid = signal<boolean>(false);
  readonly departmentErrors = signal<any>(null);
  readonly municipalityTouched = signal<boolean>(false);
  readonly municipalityInvalid = signal<boolean>(false);
  readonly municipalityErrors = signal<any>(null);

  // Effects to track form control state changes
  constructor() {
    // Effect to subscribe to form control changes
    effect(() => {
      const form = this.form();
      if (!form) return;

      const departmentControl = form.get('department') as FormControl<number | undefined>;
      const cityControl = form.get('city') as FormControl<number | undefined>;

      if (departmentControl) {
        // Subscribe to department control state changes
        departmentControl.statusChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.departmentTouched.set(departmentControl.touched);
            this.departmentInvalid.set(departmentControl.invalid);
            this.departmentErrors.set(departmentControl.errors);
          });

        // Initial state
        this.departmentTouched.set(departmentControl.touched);
        this.departmentInvalid.set(departmentControl.invalid);
        this.departmentErrors.set(departmentControl.errors);
      }

      if (cityControl) {
        // Subscribe to city control state changes
        cityControl.statusChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.municipalityTouched.set(cityControl.touched);
            this.municipalityInvalid.set(cityControl.invalid);
            this.municipalityErrors.set(cityControl.errors);
          });

        // Initial state
        this.municipalityTouched.set(cityControl.touched);
        this.municipalityInvalid.set(cityControl.invalid);
        this.municipalityErrors.set(cityControl.errors);
      }
    });
  }

  // Computed
  readonly departmentControlComputed = computed(() => {
    const form = this.form();
    if (!form) {
      return {
        control: null,
        state: { touched: false, invalid: false, errors: null }
      };
    }

    const departmentControl = form.get('department') as FormControl<number | undefined>;
    if (!departmentControl) {
      return {
        control: null,
        state: { touched: false, invalid: false, errors: null }
      };
    }

    return {
      control: departmentControl,
      state: {
        touched: this.departmentTouched(),
        invalid: this.departmentInvalid(),
        errors: this.departmentErrors()
      }
    };
  });

  readonly municipalityControlComputed = computed(() => {
    const form = this.form();
    if (!form) {
      return {
        control: null,
        state: { touched: false, invalid: false, errors: null }
      };
    }

    const cityControl = form.get('city') as FormControl<number | undefined>;
    if (!cityControl) {
      return {
        control: null,
        state: { touched: false, invalid: false, errors: null }
      };
    }

    return {
      control: cityControl,
      state: {
        touched: this.municipalityTouched(),
        invalid: this.municipalityInvalid(),
        errors: this.municipalityErrors()
      }
    };
  });  readonly currentSelection = computed(
    (): LocationSelectionValue => ({
      departmentId: this.selectedDepartmentId(),
      departmentName: this.selectedDepartmentName(),
      municipalityId: this.selectedMunicipalityId(),
      municipalityName: this.selectedMunicipalityName(),
    }),
  );

  // Getters
  get departmentControl() {
    const form = this.form();
    if (!form) {
      return {
        control: null,
        state: { touched: false, invalid: false, errors: null }
      };
    }

    const departmentControl = form.get('department') as FormControl<number | undefined>;
    if (!departmentControl) {
      return {
        control: null,
        state: { touched: false, invalid: false, errors: null }
      };
    }

    const result = {
      control: departmentControl,
      state: {
        touched: departmentControl.touched,
        invalid: departmentControl.invalid,
        errors: departmentControl.errors
      }
    };

    return result;
  }

  get municipalityControl() {
    const form = this.form();
    if (!form) {
      return {
        control: null,
        state: { touched: false, invalid: false, errors: null }
      };
    }

    const cityControl = form.get('city') as FormControl<number | undefined>;
    if (!cityControl) {
      return {
        control: null,
        state: { touched: false, invalid: false, errors: null }
      };
    }

    const result = {
      control: cityControl,
      state: {
        touched: cityControl.touched,
        invalid: cityControl.invalid,
        errors: cityControl.errors
      }
    };

    return result;
  }

  ngOnInit(): void {
    // Emit initial state
    this.emitLocationChange();
  }

  handleDepartmentChange(departmentId: number | undefined): void {
    this.selectedDepartmentId.set(departmentId);

    // Update the form control value
    const form = this.form();
    const departmentControl = form?.get('department');
    if (departmentControl) {
      departmentControl.setValue(departmentId);
    }

    this.departmentChange.emit(departmentId);
    this.emitLocationChange();
  }

  handleDepartmentNameChange(departmentName: string | undefined): void {
    this.selectedDepartmentName.set(departmentName);
    this.emitLocationChange();
  }

  handleMunicipalityChange(municipalityId: number | undefined): void {
    this.selectedMunicipalityId.set(municipalityId);

    // Update the form control value
    const form = this.form();
    const cityControl = form?.get('city');
    if (cityControl) {
      cityControl.setValue(municipalityId);
    }

    this.municipalityChange.emit(municipalityId);
    this.emitLocationChange();
  }  handleMunicipalityNameChange(municipalityName: string | undefined): void {
    this.selectedMunicipalityName.set(municipalityName);
    this.emitLocationChange();
  }

  private emitLocationChange(): void {
    this.locationChange.emit(this.currentSelection());
  }

  /**
   * Marks both department and municipality controls as touched
   * This will trigger validation error display
   */
  markAsTouched(): void {
    const departmentCtrl = this.departmentControlComputed();
    const municipalityCtrl = this.municipalityControlComputed();

    if (departmentCtrl.control) {
      departmentCtrl.control.markAsTouched();
      // Manually update the signal since markAsTouched doesn't trigger statusChanges
      this.departmentTouched.set(departmentCtrl.control.touched);
      this.departmentInvalid.set(departmentCtrl.control.invalid);
      this.departmentErrors.set(departmentCtrl.control.errors);
    }

    if (municipalityCtrl.control) {
      municipalityCtrl.control.markAsTouched();
      // Manually update the signal since markAsTouched doesn't trigger statusChanges
      this.municipalityTouched.set(municipalityCtrl.control.touched);
      this.municipalityInvalid.set(municipalityCtrl.control.invalid);
      this.municipalityErrors.set(municipalityCtrl.control.errors);
    }
  }  /**
   * Resets both department and municipality selections
   */
  reset(): void {
    // Reset the signals first
    this.selectedDepartmentId.set(undefined);
    this.selectedDepartmentName.set(undefined);
    this.selectedMunicipalityId.set(undefined);
    this.selectedMunicipalityName.set(undefined);

    // Then try to reset the child components if they're available
    const deptSelect = this.departmentSelect();
    const muniSelect = this.municipalitySelect();

    if (deptSelect) {
      deptSelect.reset();
    }
    if (muniSelect) {
      muniSelect.reset();
    }

    this.emitLocationChange();
  }

  /**
   * Gets the current location selection value
   */
  getValue(): LocationSelectionValue {
    return this.currentSelection();
  }

  /**
   * Gets department name by ID (delegated to department component)
   */
  getDepartmentName(id: number | undefined): string | undefined {
    return this.departmentSelect()?.getDepartmentName(id);
  }

  /**
   * Gets municipality name by ID (delegated to municipality component)
   */
  getMunicipalityName(id: number | undefined): string | undefined {
    return this.municipalitySelect()?.getMunicipalityName(id);
  }
}
