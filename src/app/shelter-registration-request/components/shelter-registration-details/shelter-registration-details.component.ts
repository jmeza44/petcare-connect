import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AddressComponent } from '../../../address/components/address/address.component';
import { SocialMediaListComponent } from '../../../social-media/components/social-media-list/social-media-list.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FileMetadata } from '../../../file/models/file-metadata.model';
import { ShelterRegistrationRequestDetailsDto } from '../../models/shelter-registration-request-details-dto.model';
import { CellphoneNumberPipe } from '../../../shared/pipes/cellphone-number.pipe';
import { PhoneNumberPipe } from '../../../shared/pipes/phone-number.pipe';
import { UploadedFileListComponent } from '../uploaded-file-list/uploaded-file-list.component';

@Component({
  selector: 'pet-shelter-registration-details',
  standalone: true,
  imports: [
    DatePipe,
    PhoneNumberPipe,
    CellphoneNumberPipe,
    AddressComponent,
    SocialMediaListComponent,
    UploadedFileListComponent,
  ],
  template: `
    <section class="space-y-6 rounded-2xl bg-white p-6 text-gray-800 shadow-sm">
      <!-- Shelter Name -->
      <header>
        <h2 class="text-2xl font-bold">{{ registration().shelterName }}</h2>
      </header>

      <!-- Contact + Status Info -->
      <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-2">
          <p><strong>Email:</strong> {{ registration().email }}</p>
          <p>
            <strong>Celular:</strong>
            {{ registration().cellphoneNumber | cellphoneNumber }}
          </p>
          @if (registration().phoneNumber) {
            <p>
              <strong>Teléfono:</strong>
              {{ registration().phoneNumber | phoneNumber }}
            </p>
          }
        </div>
        <div class="space-y-2">
          <p>
            <strong>Estado:</strong>
            <span
              class="ml-1 inline-flex items-center rounded-lg px-3 py-0.5 text-sm"
              [class]="badgeClass()"
            >
              <span
                class="mr-2 inline-block size-2 rounded-full"
                [class]="dotClass()"
              ></span>
              {{ status() }}
            </span>
          </p>
          <p>
            <strong>Solicitado:</strong>
            {{ registration().createdAt | date: 'medium' }}
          </p>
          @if (registration().reviewedAt) {
            <p>
              <strong>Revisado:</strong>
              {{ registration().reviewedAt | date: 'medium' }}
            </p>
          }
          @if (registration().reviewedByUserId) {
            <p>
              <strong>Revisado Por:</strong>
              {{ registration().reviewedByUserId }}
            </p>
          }
        </div>
      </div>

      <!-- Address -->
      <div>
        <h3 class="mb-1 text-lg font-semibold">Dirección</h3>
        <pet-address [address]="registration().address" />
      </div>

      <!-- Description -->
      <div>
        <h3 class="mb-1 text-lg font-semibold">Descripción</h3>
        <p>{{ registration().description }}</p>
      </div>

      <!-- Rejection Reason -->
      @if (registration().rejectionReason) {
        <div>
          <h3 class="mb-1 text-lg font-semibold text-red-600">
            Razón de Rechazo
          </h3>
          <p class="text-red-700">{{ registration().rejectionReason }}</p>
        </div>
      }

      <!-- Social Media -->
      <div>
        <h3 class="mb-1 text-lg font-semibold">Redes Sociales</h3>
        <pet-social-media-list [links]="registration().socialMediaLinks" />
      </div>

      <!-- Uploaded Files -->
      <div>
        <h3 class="mb-1 text-lg font-semibold">Archivos Subidos</h3>
        <pet-uploaded-file-list
          [files]="uploadedFiles()"
          (onDownloadFile)="onDownloadFile.emit($event)"
        />
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelterRegistrationDetailsComponent {
  readonly registration =
    input.required<ShelterRegistrationRequestDetailsDto>();
  readonly uploadedFiles = input.required<FileMetadata[]>();
  readonly onDownloadFile = output<FileMetadata>();

  readonly shelterRequestStatus = {
    Pending: 'Pending',
    Approved: 'Approved',
    Rejected: 'Rejected',
    Withdrawn: 'Withdrawn',
  };

  readonly status = computed(() =>
    this.registration().status === this.shelterRequestStatus.Approved
      ? 'Aprobada'
      : this.registration().status === this.shelterRequestStatus.Rejected
        ? 'Rechazada'
        : this.registration().status === this.shelterRequestStatus.Pending
          ? 'Pendiente'
          : this.registration().status === this.shelterRequestStatus.Withdrawn
            ? 'Retirada'
            : 'Desconocido',
  );

  readonly badgeClass = computed(() => {
    const status = this.registration().status;
    return status === this.shelterRequestStatus.Approved
      ? 'bg-green-100 text-green-800'
      : status === this.shelterRequestStatus.Rejected
        ? 'bg-red-100 text-red-800'
        : status === this.shelterRequestStatus.Pending
          ? 'bg-yellow-100 text-yellow-800'
          : status === this.shelterRequestStatus.Withdrawn
            ? 'bg-gray-100 text-gray-800'
            : '';
  });

  readonly dotClass = computed(() => {
    const status = this.registration().status;
    return status === this.shelterRequestStatus.Approved
      ? 'bg-green-500'
      : status === this.shelterRequestStatus.Rejected
        ? 'bg-red-500'
        : status === this.shelterRequestStatus.Pending
          ? 'bg-yellow-500'
          : status === this.shelterRequestStatus.Withdrawn
            ? 'bg-gray-500'
            : '';
  });
}
