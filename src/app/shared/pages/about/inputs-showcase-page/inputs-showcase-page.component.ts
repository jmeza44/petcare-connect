import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { FormInputComponent } from '../../../components/inputs/form-input/form-input.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { FormPasswordComponent } from '../../../components/inputs/form-password/form-password.component';
import { FormSelectComponent } from '../../../components/inputs/form-select/form-select.component';
import { getFormControlAndState } from '../../../utils/form-control.utils';
import { FormFileComponent } from '../../../components/inputs/form-file/form-file.component';
import { LocationService } from '../../../services/location.service';
import { SelectOption } from '../../../types/select-option.type';

@Component({
  selector: 'pet-input-showcase-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    FormPasswordComponent,
    FormSelectComponent,
    FormFileComponent,
    ButtonComponent,
  ],
  templateUrl: './inputs-showcase-page.component.html',
})
export class InputsShowcasePageComponent implements OnInit {
  readonly locationService = inject(LocationService);

  readonly departments = signal<SelectOption<number>[]>([]);
  readonly municipalities = signal<SelectOption<number>[]>([]);

  form = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    cellphone: new FormControl('', [Validators.required]),
    identification: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]*$/),
    ]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    idType: new FormControl('', [Validators.required]),
    idDocument: new FormControl('', [Validators.required]),
    department: new FormControl('', [Validators.required]),
    municipality: new FormControl('', [Validators.required]),
  });

  get firstNameControl() {
    return getFormControlAndState(this.form, 'firstName');
  }

  get lastNameControl() {
    return getFormControlAndState(this.form, 'lastName');
  }

  get emailControl() {
    return getFormControlAndState(this.form, 'email');
  }

  get cellphoneControl() {
    return getFormControlAndState(this.form, 'cellphone');
  }

  get identificationControl() {
    return getFormControlAndState(this.form, 'identification');
  }

  get newPasswordControl() {
    return getFormControlAndState(this.form, 'newPassword');
  }

  get idTypeControl() {
    return getFormControlAndState(this.form, 'idType');
  }

  get idDocumentControl() {
    return getFormControlAndState(this.form, 'idDocument');
  }

  get departmentControl() {
    return getFormControlAndState(this.form, 'department');
  }

  get municipalityControl() {
    return getFormControlAndState(this.form, 'municipality');
  }

  constructor() {
    effect(() => {
      if (this.municipalities().length > 0) {
        this.form.get('municipality')?.enable();
      } else {
        this.form.get('municipality')?.disable();
      }
    });
  }

  ngOnInit(): void {
    this.locationService.getDepartments().subscribe((departments) => {
      this.departments.set(departments);
    });
  }

  handleOnDepartmentChange(departmentId: unknown): void {
    this.form.get('municipality')?.reset();
    this.locationService
      .getMunicipalitiesByDepartmentId(+(departmentId as number))
      .subscribe((municipalities) => {
        this.municipalities.set(municipalities);
      });
  }

  submit(): void {
    // 🔹 Mark all controls as touched to trigger validation messages
    if (this.form.invalid) this.form.markAllAsTouched();
  }
}
