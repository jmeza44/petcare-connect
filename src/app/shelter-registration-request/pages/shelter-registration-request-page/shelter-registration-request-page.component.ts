import { Component, signal } from '@angular/core';
import { ShelterRegistrationRequestFormComponent } from '../../components/shelter-registration-request-form/shelter-registration-request-form.component';
import {
  mapPlatform,
  SubmitShelterRegistrationDto,
} from '../../models/submit-shelter-registration-request-dto.model';
import { ShelterRegistrationRequestService } from '../../services/shelter-registration-request.service';
import { FileUploadService } from '../../../file/services/file-upload.service';
import { finalize, switchMap } from 'rxjs';
import { SubmitShelterRegistration } from '../../models/submit-shelter-registration-request.model';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  standalone: true,
  imports: [ShelterRegistrationRequestFormComponent],
  templateUrl: './shelter-registration-request-page.component.html',
})
export class ShelterRegistrationRequestPageComponent {
  isSubmitting = signal(false);
  wasSuccessfullySubmitted = signal(false);

  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly notificationService: NotificationService,
    private readonly shelterRegistrationRequestService: ShelterRegistrationRequestService,
  ) {}

  handleSubmit(request: SubmitShelterRegistrationDto) {
    this.isSubmitting.set(true);
    this.wasSuccessfullySubmitted.set(false);

    this.fileUploadService
      .uploadFiles([request.rut, request.legalCertificate])
      .pipe(
        switchMap((uploadResult) => {
          const uploadedIds = uploadResult.successfullyUploaded.map(
            (f) => f.id,
          );
          const payload = this.mapSubmitShelterRegistrationDtoToPayload(
            request,
            uploadedIds,
          );
          return this.shelterRegistrationRequestService.submitRegistration(
            payload,
          );
        }),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe({
        next: (response) => {
          console.log(
            'Shelter registered with ID:',
            response.shelterRegistrationRequestId,
          );
          this.notificationService.success(
            'Solicitud de registro de refugio enviada con éxito.',
            'Registro exitoso',
            0,
          );
          this.wasSuccessfullySubmitted.set(true);
          // TODO: Navigate to the details of the request
        },
        error: (err) => {
          console.error('Registration failed:', err);
          if (err.error?.error !== 'VALIDATION_EXCEPTION')
            this.notificationService.error(
              err.error?.message ||
                'Ocurrió un error al enviar la solicitud de registro de refugio.',
              'Registro fallido',
              0,
            );
        },
      });
  }

  private mapSubmitShelterRegistrationDtoToPayload(
    dto: SubmitShelterRegistrationDto,
    uploadedFileIds: string[],
  ): SubmitShelterRegistration {
    return {
      shelterName: dto.shelterName,
      description: dto.description,
      contactEmail: dto.contactEmail,
      cellphoneNumber: dto.cellphoneNumber,
      phoneNumber: dto.phoneNumber,
      address: {
        street: dto.address.street,
        city: dto.address.city,
        department: dto.address.department,
        country: dto.address.country,
        postalCode: dto.address.postalCode,
      },
      uploadedFileIds,
      socialMedia: dto.socialMedia.map((s) => ({
        platform: mapPlatform(s.platform),
        profileUrl: s.profileUrl,
        username: s.username,
      })),
    };
  }
}
