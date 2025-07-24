import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
  output,
  signal,
  effect,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormInputComponent } from '../../../shared/components/inputs/form-input/form-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { getFormControlAndState } from '../../../shared/utils/form-control.utils';
import { FormFileComponent } from '../../../shared/components/inputs/form-file/form-file.component';
import { SubmitShelterRegistrationDto } from '../../models/submit-shelter-registration-request-dto.model';
import { FormSelectComponent } from '../../../shared/components/inputs/form-select/form-select.component';
import {
  LocationSelectComponent,
  LocationSelectionValue,
} from '../../../shared/components/inputs/location-select/location-select.component';
import { SelectOption } from '../../../shared/types/select-option.type';

type SocialMediaFormGroup = FormGroup<{
  platform: FormControl<string>;
  profileUrl: FormControl<string>;
  username: FormControl<string | null>;
}>;

@Component({
  selector: 'pet-shelter-registration-request-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    FormFileComponent,
    ButtonComponent,
    FormSelectComponent,
    LocationSelectComponent,
  ],
  templateUrl: './shelter-registration-request-form.component.html',
})
export class ShelterRegistrationRequestFormComponent {
  // ViewChild references
  readonly locationSelect = viewChild(LocationSelectComponent);

  // Inputs
  readonly isSubmitting = input.required<boolean>();
  readonly wasSuccessfullySubmitted = input.required<boolean>();

  // Outputs
  readonly submitted = output<SubmitShelterRegistrationDto>();

  // Form Controls
  readonly form = new FormGroup({
    shelterName: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    contactEmail: new FormControl('', [Validators.required, Validators.email]),
    cellphoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    phoneNumber: new FormControl('', [Validators.minLength(10)]),
    address: new FormGroup({
      street: new FormControl('', Validators.required),
      city: new FormControl<number | undefined>(undefined, Validators.required),
      department: new FormControl<number | undefined>(
        undefined,
        Validators.required,
      ),
      country: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
    }),
    rut: new FormControl<File | null>(null, [Validators.required]),
    legalCertificate: new FormControl<File | null>(null, [Validators.required]),
    socialMedia: new FormArray<SocialMediaFormGroup>([]),
  });

  // Form Array for Social Media
  readonly socialMediaFormArray = this.form.get(
    'socialMedia',
  ) as unknown as FormArray<SocialMediaFormGroup>;

  // Signals
  readonly socialMediaCount = signal<number>(0);
  readonly currentLocation = signal<LocationSelectionValue>({
    departmentId: undefined,
    departmentName: undefined,
    municipalityId: undefined,
    municipalityName: undefined,
  });

  // Computed signals
  readonly isFormValid = computed(() => this.form.valid);

  // Icons
  readonly faPlus = faPlus;
  readonly faMinus = faMinus;

  // Social Media Platforms
  readonly socialMediaPlatforms: SelectOption<number>[] = [
    { label: 'Facebook', value: 0 },
    { label: 'Instagram', value: 1 },
    { label: 'X', value: 2 }, // Maps to 'Twitter'
    { label: 'LinkedIn', value: 3 },
    { label: 'TikTok', value: 4 },
    { label: 'YouTube', value: 5 },
    { label: 'WhatsApp', value: 6 },
    { label: 'Telegram', value: 7 },
    { label: 'Other', value: 8 },
  ];

  constructor() {
    // React to successful submission
    effect(() => {
      if (this.wasSuccessfullySubmitted()) {
        this.resetForm();
      }
    });
  }

  // Form Control Getters
  get shelterNameControl() {
    const control = getFormControlAndState(this.form, 'shelterName');
    return control;
  }

  get descriptionControl() {
    const control = getFormControlAndState(this.form, 'description');
    return control;
  }

  get contactEmailControl() {
    const control = getFormControlAndState(this.form, 'contactEmail');
    return control;
  }

  get cellphoneNumberControl() {
    const control = getFormControlAndState(this.form, 'cellphoneNumber');
    return control;
  }

  get phoneNumberControl() {
    const control = getFormControlAndState(this.form, 'phoneNumber');
    return control;
  }

  get streetControl() {
    const control = getFormControlAndState(
      this.form.get('address') as FormGroup,
      'street',
    );
    return control;
  }

  get cityControl() {
    const control = getFormControlAndState(
      this.form.get('address') as FormGroup,
      'city',
    );
    return control;
  }

  get departmentControl() {
    const control = getFormControlAndState(
      this.form.get('address') as FormGroup,
      'department',
    );
    return control;
  }

  get countryControl() {
    const control = getFormControlAndState(
      this.form.get('address') as FormGroup,
      'country',
    );
    return control;
  }

  get postalCodeControl() {
    const control = getFormControlAndState(
      this.form.get('address') as FormGroup,
      'postalCode',
    );
    return control;
  }

  get rutControl() {
    return getFormControlAndState(this.form, 'rut');
  }

  get legalCertificateControl() {
    return getFormControlAndState(this.form, 'legalCertificate');
  }

  get socialMediaControls() {
    return this.socialMediaFormArray.controls.map((control) => ({
      platform: getFormControlAndState(control, 'platform'),
      profileUrl: getFormControlAndState(control, 'profileUrl'),
      username: getFormControlAndState(control, 'username'),
    }));
  }

  // Location handling
  handleLocationChange(location: LocationSelectionValue): void {
    this.currentLocation.set(location);
  }

  // Methods
  addSocialMedia(): void {
    this.socialMediaFormArray.push(
      new FormGroup({
        platform: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        profileUrl: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        username: new FormControl(null),
      }) as SocialMediaFormGroup,
    );
    this.socialMediaCount.update((value) => value + 1);
  }

  removeSocialMedia(): void {
    if (this.socialMediaFormArray.length === 0) {
      console.warn('[ShelterForm] No social media to remove');
      return;
    }
    this.socialMediaFormArray.removeAt(this.socialMediaFormArray.length - 1);
    this.socialMediaCount.update((value) => value - 1);
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();

      // Also mark the location select component as touched
      const locationSelectRef = this.locationSelect();
      if (locationSelectRef) {
        locationSelectRef.markAsTouched();
      }

      console.warn(
        '[ShelterRegistrationRequestFormComponent] Form is invalid',
        {
          formErrors: this.form.errors,
          addressErrors: this.form.get('address')?.errors,
          departmentControlState: this.departmentControl,
          cityControlState: this.cityControl,
          allFormControls: this.form.controls,
        },
      );
      return;
    }

    // Map the form data with location names instead of IDs
    const formValue = this.form.value;
    const location = this.currentLocation();

    const submissionData: SubmitShelterRegistrationDto = {
      ...formValue,
      address: {
        ...formValue.address!,
        city: location.municipalityName || '',
        department: location.departmentName || '',
      },
    } as SubmitShelterRegistrationDto;

    this.submitted.emit(submissionData);
  }

  populateFormWithMockData(): void {
    // Fill basic inputs (excluding city and department which will be handled by LocationSelectComponent)
    this.form.patchValue({
      shelterName: 'Refugio Esperanza',
      description: 'Cuida perros y gatos en situación de calle.',
      contactEmail: 'refugio@correo.com',
      cellphoneNumber: '3000000000',
      phoneNumber: '6051234567',
      address: {
        street: 'Calle 123 #45-67',
        country: 'Colombia',
        postalCode: '050001',
        city: 8001,
        department: 8,
      },
    });

    // Create dummy files
    const dummyFile = new File(['Dummy content'], 'document.pdf', {
      type: 'application/pdf',
    });

    this.form.patchValue({
      rut: dummyFile,
      legalCertificate: dummyFile,
    });

    // Add one social media entry
    if (this.socialMediaFormArray.length === 0) {
      this.addSocialMedia();
    }

    this.socialMediaFormArray.at(0).patchValue({
      platform: '0', // Maps to Facebook
      profileUrl: 'https://facebook.com/refugioesperanza',
      username: 'Refugio Esperanza',
    });
  }

  private resetForm(): void {
    this.form.reset();

    // Clear all social media entries
    while (this.socialMediaFormArray.length > 0) {
      this.socialMediaFormArray.removeAt(0);
    }

    // Reset count
    this.socialMediaCount.set(0);
  }
}
