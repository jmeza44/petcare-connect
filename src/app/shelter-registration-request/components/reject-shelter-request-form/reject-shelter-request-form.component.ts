import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FormInputComponent } from '../../../shared/components/inputs/form-input/form-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'pet-reject-shelter-request-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormInputComponent,
    ButtonComponent,
  ],
  template: `
    <form class="space-y-6" (ngSubmit)="submitForm()">
      <pet-form-input
        name="reason"
        label="Motivo del rechazo"
        [type]="'text'"
        [control]="reasonControl"
        [touched]="reasonControl.touched"
        [invalid]="reasonControl.invalid"
        [errors]="reasonControl.errors"
      />

      <pet-button
        [text]="'Rechazar solicitud'"
        [type]="'submit'"
        [color]="'danger'"
        [size]="'medium'"
        [icon]="rejectIcon"
        [iconPosition]="'left'"
        [isLoading]="isSubmitting()"
        [isDisabled]="reasonControl.invalid"
        [customClass]="'mt-4'"
      ></pet-button>
    </form>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class RejectShelterRequestFormComponent {
  // Inputs & Outputs
  readonly isSubmitting = input<boolean>(false);
  readonly rejectionSubmitted = output<string>();

  // Form
  readonly reasonControl = new FormControl('', Validators.required);

  // Icon
  readonly rejectIcon = faXmarkCircle;

  submitForm(): void {
    if (this.reasonControl.invalid) return;

    this.rejectionSubmitted.emit(this.reasonControl.value!);
  }
}
