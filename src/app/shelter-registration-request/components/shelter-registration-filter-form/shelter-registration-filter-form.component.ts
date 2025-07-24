import {
  ChangeDetectionStrategy,
  Component,
  signal,
  effect,
  input,
  output,
  computed,
  OnInit,
  inject,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  GetAllShelterRegistrationsQuery,
  ShelterRequestStatus,
} from '../../models/get-all-shelter-registrations-query.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormInputComponent } from '../../../shared/components/inputs/form-input/form-input.component';
import { FormSelectComponent } from '../../../shared/components/inputs/form-select/form-select.component';
import {
  LocationSelectComponent,
  LocationSelectionValue,
} from '../../../shared/components/inputs/location-select/location-select.component';
import { SelectOption } from '../../../shared/types/select-option.type';
import { getFormControlAndState } from '../../../shared/utils/form-control.utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { useViewportWidth } from '../../../shared/utils/viewport.signal';
import { slideToggleAnimation } from './slide-toggle.animation';
import { getUtcDateRange } from '../../../shared/utils/date.utils';

@Component({
  selector: 'pet-shelter-registration-filter-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    FormInputComponent,
    FormSelectComponent,
    LocationSelectComponent,
  ],
  animations: [slideToggleAnimation],
  templateUrl: './shelter-registration-filter-form.component.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class ShelterRegistrationFilterFormComponent implements OnInit {
  // ViewChild for location component
  readonly locationSelect = viewChild(LocationSelectComponent);

  // Signals
  readonly viewportWidth = useViewportWidth();
  readonly isExpanded = signal(false);
  readonly currentLocation = signal<LocationSelectionValue>({
    departmentId: undefined,
    departmentName: undefined,
    municipalityId: undefined,
    municipalityName: undefined,
  });

  // Inputs
  customClass = input<string>('');
  initialValues = input<GetAllShelterRegistrationsQuery>();

  // Output that emits on filter change
  readonly filtersChange = output<GetAllShelterRegistrationsQuery>();

  // Computed Signals
  readonly statusOptions = signal<
    SelectOption<ShelterRequestStatus | undefined>[]
  >([
    { label: 'Todos los estados', value: undefined },
    { label: 'Pendiente', value: 'Pending' },
    { label: 'Retirada', value: 'Withdrawn' },
    { label: 'Aprobada', value: 'Approved' },
    { label: 'Rechazada', value: 'Rejected' },
  ]);
  readonly isDesktop = computed(() => this.viewportWidth() >= 768);

  // Avoids triggering filtersChange on initialization which leads to redundant API calls
  private filtersChangeCount = 0;

  constructor() {
    const formValueChanges = this.form.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    );

    const debouncedSignal = toSignal(formValueChanges);

    effect(() => {
      const _ = debouncedSignal();
      if (this.filtersChangeCount < 3) {
        this.filtersChangeCount += 1; // Skip the first two changes (initialization)
        return;
      }
      this.filtersChange.emit(this.mapToQuery());
    });

    // Also emit when location changes (separate from form changes)
    effect(() => {
      const _ = this.currentLocation();
      this.filtersChange.emit(this.mapToQuery());
    });
  }

  // Form setup
  readonly form = new FormGroup({
    search: new FormControl<string | undefined>(undefined, {
      nonNullable: true,
    }),
    status: new FormControl<ShelterRequestStatus | undefined>(undefined, {
      nonNullable: true,
      updateOn: 'change',
    }),
    city: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
      updateOn: 'change',
    }),
    department: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
    }),
    submittedFrom: new FormControl<string | undefined>(undefined),
    submittedTo: new FormControl<string | undefined>(undefined),
  });

  // Getters
  get searchControl() {
    return getFormControlAndState<string>(this.form, 'search');
  }

  get statusControl() {
    return getFormControlAndState<ShelterRequestStatus | undefined>(
      this.form,
      'status',
    );
  }

  get submittedFromControl() {
    return getFormControlAndState<string | undefined>(
      this.form,
      'submittedFrom',
    );
  }

  get submittedToControl() {
    return getFormControlAndState<string | undefined>(this.form, 'submittedTo');
  }

  // Methods
  ngOnInit(): void {
    // Don't call resetFilters here - it causes NG0950 error because viewChild isn't ready
    // Instead, just reset the form controls directly
    this.form.get('search')?.setValue(undefined);
    this.form.get('status')?.setValue(undefined);
    this.form.get('department')?.setValue(undefined);
    this.form.get('city')?.setValue(undefined);
    this.form.get('submittedFrom')?.setValue(undefined);
    this.form.get('submittedTo')?.setValue(undefined);

    const query = this.initialValues();

    // Set initial form values (excluding location fields)
    this.form.patchValue(
      {
        search: query?.search,
        status: query?.status,
        submittedFrom: query?.submittedFrom,
        submittedTo: query?.submittedTo,
      },
      { emitEvent: false },
    );

    this.filtersChangeCount += 1; // Mark init as partially complete
  }  toggleExpanded(): void {
    this.isExpanded.update((v) => !v);
  }

  // Simplified - no more manual department/city handling!
  handleLocationChange(location: LocationSelectionValue): void {
    this.currentLocation.set(location);
  }

  resetFilters(): void {
    this.form.get('search')?.setValue(undefined);
    this.form.get('status')?.setValue(undefined);
    this.form.get('submittedFrom')?.setValue(undefined);
    this.form.get('submittedTo')?.setValue(undefined);

    // Reset location using the component's method
    this.locationSelect()?.reset();
  }

  // Much cleaner mapping - no more manual ID to name conversion!
  private mapToQuery(): GetAllShelterRegistrationsQuery {
    const { search, status, submittedFrom, submittedTo } = this.form.value;
    const { fromUtc, toUtc } = getUtcDateRange(submittedFrom, submittedTo);
    const location = this.currentLocation();

    return {
      search: search,
      status:
        status !== undefined && status !== null
          ? (status ?? undefined)
          : undefined,
      // Direct mapping - no more complex logic needed!
      city: location.municipalityName,
      department: location.departmentName,
      submittedFrom:
        fromUtc !== undefined && fromUtc !== null ? fromUtc : undefined,
      submittedTo: toUtc !== undefined && toUtc !== null ? toUtc : undefined,
    };
  }
}
