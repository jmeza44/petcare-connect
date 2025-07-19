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
import { SelectOption } from '../../../shared/types/select-option.type';
import { getFormControlAndState } from '../../../shared/utils/form-control.utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { useViewportWidth } from '../../../shared/utils/viewport.signal';
import { LocationService } from '../../../shared/services/location.service';
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
  // Injects
  readonly locationService = inject(LocationService);

  // Signals
  readonly departments = signal<SelectOption<number | undefined>[]>([
    {
      label: 'Todos los departamentos',
      value: undefined,
    },
  ]);
  readonly cities = signal<SelectOption<number | undefined>[]>([
    {
      label: 'Todas las ciudades',
      value: undefined,
    },
  ]);
  readonly viewportWidth = useViewportWidth();
  readonly isExpanded = signal(false);

  // Inputs
  customClass = input<string>('');

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

  constructor() {
    let initialized = false;

    const formValueChanges = this.form.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    );

    const debouncedSignal = toSignal(formValueChanges);

    effect(() => {
      const _ = debouncedSignal();
      if (initialized) {
        this.filtersChange.emit(this.mapToQuery());
      } else {
        initialized = true;
      }
    });

    effect(() => {
      if (this.cities().length > 0) {
        this.form.get('city')?.enable();
      } else {
        this.form.get('city')?.disable();
      }
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

  get cityControl() {
    return getFormControlAndState<number | undefined>(this.form, 'city');
  }

  get departmentControl() {
    return getFormControlAndState<number | undefined>(this.form, 'department');
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
    this.resetFilters();
    this.locationService.getDepartments().subscribe((departments) => {
      this.departments.set([
        {
          label: 'Todos los departamentos',
          value: undefined,
        },
        ...departments,
      ]);
    });
  }

  toggleExpanded(): void {
    this.isExpanded.update((v) => !v);
  }

  handleOnDepartmentChange(department: unknown): void {
    this.form.get('city')?.setValue(undefined);
    this.locationService
      .getMunicipalitiesByDepartmentId(+(department as number))
      .subscribe((cities) => {
        this.cities.set([
          {
            label: 'Todas las ciudades',
            value: undefined,
          },
          ...cities,
        ]);
      });
  }

  resetFilters(): void {
    this.form.get('search')?.setValue(undefined);
    this.form.get('status')?.setValue(undefined);
    this.form.get('city')?.setValue(undefined);
    this.form.get('department')?.setValue(undefined);
    this.form.get('submittedFrom')?.setValue(undefined);
    this.form.get('submittedTo')?.setValue(undefined);
  }

  private mapToQuery(): GetAllShelterRegistrationsQuery {
    const { search, status, city, department, submittedFrom, submittedTo } =
      this.form.value;
    const { fromUtc, toUtc } = getUtcDateRange(submittedFrom, submittedTo);

    return {
      search: search,
      status:
        status !== undefined && status !== null
          ? (status ?? undefined)
          : undefined,
      city:
        city !== undefined && city !== null
          ? (this.cities().find((c) => c.value == city)?.label ?? undefined)
          : undefined,
      department:
        department !== undefined && department !== null
          ? (this.departments().find((d) => d.value == department)?.label ??
            undefined)
          : undefined,
      submittedFrom:
        fromUtc !== undefined && fromUtc !== null ? fromUtc : undefined,
      submittedTo: toUtc !== undefined && toUtc !== null ? toUtc : undefined,
    };
  }
}
