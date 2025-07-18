import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  Inject,
} from '@angular/core';
import { catchError, firstValueFrom, forkJoin, map, of } from 'rxjs';
import { DialogRef } from '../../../shared/ref/dialog.ref';
import { DIALOG_CONFIG } from '../../../shared/tokens/dialog.tokens';
import { FileMetadata } from '../../../file/models/file-metadata.model';
import { FileUploadService } from '../../../file/services/file-upload.service';
import { ShelterRegistrationRequestService } from '../../services/shelter-registration-request.service';
import { ShelterRegistrationDetailsComponent } from '../../components/shelter-registration-details/shelter-registration-details.component';
import { saveBlobAsFile } from '../../../file/utils/save-blob-as-file.util';
import { NotificationService } from '../../../shared/services/notification.service';
import { ShelterRegistrationRequestDetailsDto } from '../../models/shelter-registration-request-details-dto.model';

@Component({
  selector: 'pet-shelter-registration-details-page',
  standalone: true,
  imports: [ShelterRegistrationDetailsComponent],
  template: `
    @if (registration() !== null && registration() !== undefined) {
      <pet-shelter-registration-details
        [registration]="registration()!"
        [uploadedFiles]="uploadedFiles()!"
        (onDownloadFile)="handleDownloadFile($event)"
      />
    } @else {
      <p class="mt-4 text-center">Loading registration details...</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelterRegistrationDetailsPageComponent {
  private readonly service = inject(ShelterRegistrationRequestService);
  private readonly fileService = inject(FileUploadService);
  private readonly notificationService = inject(NotificationService);

  readonly registration = signal<ShelterRegistrationRequestDetailsDto | null>(
    null,
  );
  readonly uploadedFiles = signal<FileMetadata[]>([]);

  constructor(
    @Inject(DIALOG_CONFIG)
    readonly data: { id: string },
    private readonly dialogRef: DialogRef<ShelterRegistrationDetailsPageComponent>,
  ) {
    effect(() => {
      const request$ = this.data.id
        ? this.service.getRegistrationById(this.data.id)
        : this.service.getMyRegistration();

      request$
        .pipe(
          catchError(() => {
            this.registration.set(null);
            return of(null);
          }),
        )
        .subscribe((result) => {
          this.registration.set(result);
          if (result?.uploadedFiles?.length) {
            this.loadFileMetadata(result.uploadedFiles.filter((id) => !!id));
          }
        });
    });
  }

  handleDownloadFile(file: FileMetadata) {
    this.fileService.downloadFile(file.id).subscribe({
      next: (response) => {
        saveBlobAsFile(response, file.fileName);
      },
      error: () => {
        this.notificationService.error(
          'Error downloading file.',
          'Try again later',
        );
      },
    });
  }

  private loadFileMetadata(fileIds: string[]) {
    const requests$ = fileIds.map((id) =>
      this.fileService.getFileMetadata(id).pipe(
        catchError(() => of(null)), // gracefully handle errors per file
      ),
    );

    forkJoin(requests$)
      .pipe(
        map((results) =>
          results.filter((meta): meta is FileMetadata => !!meta),
        ),
      )
      .subscribe((metas) => {
        this.uploadedFiles.set(metas);
      });
  }
}
