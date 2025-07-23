import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { AddressComponent } from '../../../address/components/address/address.component';
import { SocialMediaListComponent } from '../../../social-media/components/social-media-list/social-media-list.component';
import { FileMetadata } from '../../../file/models/file-metadata.model';
import { ShelterRegistrationRequestDetailsDto } from '../../models/shelter-registration-request-details-dto.model';
import { CellphoneNumberPipe } from '../../../shared/pipes/cellphone-number.pipe';
import { PhoneNumberPipe } from '../../../shared/pipes/phone-number.pipe';
import { UploadedFilesListComponent } from '../uploaded-files-list/uploaded-files-list.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { UserNameDisplayComponent } from '../../../user/components/user-name-display/user-name-display.component';
import {
  faArrowCircleLeft,
  faCheckCircle,
  faXmark,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pet-shelter-registration-details',
  standalone: true,
  imports: [
    DatePipe,
    PhoneNumberPipe,
    CellphoneNumberPipe,
    AddressComponent,
    SocialMediaListComponent,
    UploadedFilesListComponent,
    ButtonComponent,
    UserNameDisplayComponent,
  ],
  template: `
    <section class="space-y-6 bg-white p-6 text-gray-800">
      <!-- Shelter Name -->
      <header class="mb-2 flex items-end justify-between">
        <h2 class="inline-block text-2xl font-bold">
          {{ registration().shelterName }}
        </h2>
        <pet-button
          [icon]="icons['faXmark']"
          [styling]="'link'"
          [color]="'basic'"
          [size]="'large'"
          (clickTriggered)="handleClickClose()"
        >
        </pet-button>
      </header>

      <!-- Contact + Status Info -->
      <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-2">
          <p><strong>Email:</strong> {{ registration().email }}</p>
          <p>
            <strong>Celular:</strong>
            {{ registration().cellphoneNumber | cellphoneNumber }}
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
          @if (registration().phoneNumber) {
            <p>
              <strong>Teléfono:</strong>
              {{ registration().phoneNumber | phoneNumber }}
            </p>
          }
          <p>
            <strong>Solicitado Por:</strong>
            <pet-user-name-display [userId]="registration().userId" />
          </p>
          @if (registration().reviewedByUserId) {
            <p>
              <strong>Revisado Por:</strong>
              <pet-user-name-display
                [userId]="registration().reviewedByUserId!"
              />
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
        <pet-uploaded-files-list
          [files]="uploadedFiles()"
          (onDownloadFile)="downloadFile.emit($event)"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between space-x-2">
        @if (registration().status === 'Pending') {
          <pet-button
            [text]="'Aprobar Solicitud'"
            [icon]="icons['faCheckCircle']"
            [color]="'success'"
            [styling]="'link'"
            [loadingText]="'Aprobando...'"
            [isLoading]="approveButtonLoading()"
            (clickTriggered)="handleClickApprove()"
          />
          <pet-button
            [text]="'Rechazar solicitud'"
            [icon]="icons['faXmarkCircle']"
            [color]="'danger'"
            [styling]="'link'"
            [isDisabled]="approveButtonLoading()"
            (clickTriggered)="handleClickReject()"
          />
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelterRegistrationDetailsComponent {
  readonly registration =
    input.required<ShelterRegistrationRequestDetailsDto>();
  readonly uploadedFiles = input.required<FileMetadata[]>();
  readonly approveButtonLoading = input<boolean>(false);
  readonly downloadFile = output<FileMetadata>();
  readonly approveRequest = output<string>();
  readonly rejectRequest = output<string>();
  readonly closeDialog = output<void>();

  readonly icons = {
    faCheckCircle,
    faXmarkCircle,
    faArrowCircleLeft,
    faXmark,
  };

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

  handleClickApprove() {
    this.approveRequest.emit(this.registration().id);
  }

  handleClickReject() {
    this.rejectRequest.emit(this.registration().id);
  }

  handleClickClose() {
    this.closeDialog.emit();
  }
}
