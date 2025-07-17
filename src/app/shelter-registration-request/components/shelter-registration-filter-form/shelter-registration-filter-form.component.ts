import {
  ChangeDetectionStrategy,
  Component,
  signal,
  effect,
  input,
  output,
  computed,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
import { cities } from '../../../shared/utils/cities.const';
import { departments } from '../../../shared/utils/departments.const';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { useViewportWidth } from '../../../shared/utils/viewport.signal';

@Component({
  selector: 'pet-shelter-registration-filter-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FormInputComponent,
    FormSelectComponent,
  ],
  animations: [
    trigger('slideToggle', [
      state(
        'collapsed',
        style({
          height: '0px',
          opacity: 0,
          overflow: 'hidden',
        }),
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
          overflow: 'hidden',
        }),
      ),
      transition('collapsed <=> expanded', animate('250ms ease-in-out')),
    ]),
  ],
  template: `
    <!-- Toggle Button for Mobile -->
    <pet-button
      [text]="isExpanded() ? 'Ocultar filtros' : 'Mostrar filtros'"
      [type]="'button'"
      [styling]="'link'"
      [color]="'primary'"
      (clickTriggered)="toggleExpanded()"
      [customClass]="'md:hidden w-full flex-initial h-12 min-h-12'"
    />
    <div
      class="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end"
      [class]="customClass()"
    >
      <form
        [@slideToggle]="isExpanded() || isDesktop() ? 'expanded' : 'collapsed'"
        class="grid w-full flex-auto grid-cols-1 gap-4 md:w-fit md:grid-cols-3 2xl:grid-cols-6"
        [formGroup]="form"
        [class.grid]="isExpanded() || isDesktop()"
      >
        <pet-form-input
          [label]="'Buscar por nombre o correo'"
          [control]="searchControl.control!"
        />

        <pet-form-select
          [label]="'Estado'"
          [control]="statusControl.control!"
          [options]="statusOptions()"
          [placeholder]="'Todos los estados'"
        />

        <pet-form-select
          [label]="'Ciudad'"
          [control]="cityControl.control!"
          [options]="cityOptions()"
          [placeholder]="'Todas las ciudades'"
        />

        <pet-form-select
          [label]="'Departamento'"
          [control]="departmentControl.control!"
          [options]="departmentOptions()"
          [placeholder]="'Todos los departamentos'"
        />

        <pet-form-input
          [label]="'Desde'"
          [type]="'date'"
          [control]="submittedFromControl.control!"
        />

        <pet-form-input
          [label]="'Hasta'"
          [type]="'date'"
          [control]="submittedToControl.control!"
        />
      </form>

      <pet-button
        [text]="'Limpiar'"
        [type]="'button'"
        [color]="'basic'"
        (clickTriggered)="resetFilters()"
        [customClass]="'w-full md:w-fit flex-initial h-12 min-h-12'"
      />
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class ShelterRegistrationFilterFormComponent {
  // Signals for cities and departments
  readonly cities = signal<string[]>(cities);
  readonly departments = signal<string[]>(departments);

  // Inputs to populate city and department options
  setAvailableCities = input(this.cities.set);
  setAvailableDepartments = input(this.departments.set);
  customClass = input<string>('');

  // Output that emits on filter change
  readonly filtersChange = output<GetAllShelterRegistrationsQuery>();

  // Internal state
  private readonly initialFilters: GetAllShelterRegistrationsQuery = {
    search: '',
    status: undefined,
    city: undefined,
    department: undefined,
    submittedFrom: undefined,
    submittedTo: undefined,
  };

  // Form setup
  readonly form = new FormGroup({
    search: new FormControl(this.initialFilters.search, { nonNullable: true }),
    status: new FormControl(this.initialFilters.status),
    city: new FormControl(this.initialFilters.city),
    department: new FormControl(this.initialFilters.department),
    submittedFrom: new FormControl(this.initialFilters.submittedFrom),
    submittedTo: new FormControl(this.initialFilters.submittedTo),
  });

  // Derived status options
  readonly statuses: Record<string, string> = {
    Pendiente: 'Pending',
    Retirada: 'Withdrawn',
    Aprobada: 'Approved',
    Rechazada: 'Rejected',
  };

  readonly isExpanded = signal(false);
  readonly viewportWidth = useViewportWidth();
  readonly isDesktop = computed(() => this.viewportWidth() >= 768);

  toggleExpanded(): void {
    this.isExpanded.update((v) => !v);
  }

  // Computed options for select inputs
  readonly statusOptions = computed<
    SelectOption<ShelterRequestStatus | undefined>[]
  >(() => [
    { label: 'Todos los estados', value: undefined },
    ...Object.entries(this.statuses).map(
      ([label, value]) =>
        ({ label, value }) as SelectOption<ShelterRequestStatus>,
    ),
  ]);

  readonly cityOptions = computed<SelectOption<string>[]>(() =>
    this.cities().map((c) => ({ label: c, value: c })),
  );

  readonly departmentOptions = computed<SelectOption<string>[]>(() =>
    this.departments().map((d) => ({ label: d, value: d })),
  );

  constructor() {
    const formValueChanges = this.form.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    );

    const debouncedSignal = toSignal(formValueChanges, {
      initialValue: this.form.value,
    });

    effect(() => {
      const _ = debouncedSignal(); // triggers the effect
      this.filtersChange.emit(this.mapToQuery());
    });
  }

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
    return getFormControlAndState<string | undefined>(this.form, 'city');
  }

  get departmentControl() {
    return getFormControlAndState<string | undefined>(this.form, 'department');
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

  get reviewedControl() {
    return getFormControlAndState<boolean | undefined>(this.form, 'reviewed');
  }

  resetFilters(): void {
    this.form.reset(this.initialFilters);
    this.filtersChange.emit(this.initialFilters);
  }

  private mapToQuery(): GetAllShelterRegistrationsQuery {
    return {
      search: this.form.value.search,
      status:
        this.form.value.status !== undefined
          ? (this.form.value.status ?? undefined)
          : undefined,
      city: this.form.value.city ?? undefined,
      department: this.form.value.department ?? undefined,
      submittedFrom:
        this.form.value.submittedFrom !== undefined &&
        this.form.value.submittedFrom !== null
          ? new Date(this.form.value.submittedFrom).toISOString()
          : undefined,
      submittedTo:
        this.form.value.submittedTo !== undefined &&
        this.form.value.submittedTo !== null
          ? new Date(this.form.value.submittedTo).toISOString()
          : undefined,
    };
  }
}
