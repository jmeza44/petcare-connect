import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  Inject,
} from '@angular/core';
import { catchError, forkJoin, map, of } from 'rxjs';
import { DialogRef } from '../../../shared/ref/dialog.ref';
import { DIALOG_CONFIG } from '../../../shared/tokens/dialog.tokens';
import { FileMetadata } from '../../../file/models/file-metadata.model';
import { FileUploadService } from '../../../file/services/file-upload.service';
import { ShelterRegistrationRequestService } from '../../services/shelter-registration-request.service';
import { ShelterRegistrationDetailsComponent } from '../../components/shelter-registration-details/shelter-registration-details.component';
import { saveBlobAsFile } from '../../../file/utils/save-blob-as-file.util';
import { NotificationService } from '../../../shared/services/notification.service';
import { ShelterRegistrationRequestDetailsDto } from '../../models/shelter-registration-request-details-dto.model';
import { SkeletonIfDirective } from '../../../shared/directives/skeleton-if.directive';
import { ShelterRegistrationDetailsSkeletonComponent } from '../../components/shelter-registration-details/shelter-registration-details-skeleton.component';
import { DialogService } from '../../../shared/services/dialog.service';
import { RejectShelterRequestPageComponent } from '../reject-shelter-request-page/reject-shelter-request-page.component';
import { UserProfileCacheService } from '../../../user/services/user-profile-cache.service';
import { CurrentUserService } from '../../../auth/services/current-user.service';

@Component({
  selector: 'pet-shelter-registration-details-page',
  standalone: true,
  imports: [ShelterRegistrationDetailsComponent, SkeletonIfDirective],
  template: `
    <pet-shelter-registration-details
      *skeletonIf="
        registration() !== null && registration() !== undefined;
        skeleton: shelterRegistrationDetailsSkeletonComponent
      "
      [registration]="registration()!"
      [uploadedFiles]="uploadedFiles()!"
      [approveButtonLoading]="approveButtonLoading()"
      (closeDialog)="handleCloseDialog()"
      (downloadFile)="handleDownloadFile($event)"
      (approveRequest)="handleApproveRequest($event)"
      (rejectRequest)="handleRejectRequest($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelterRegistrationDetailsPageComponent {
  private readonly service = inject(ShelterRegistrationRequestService);
  private readonly fileService = inject(FileUploadService);
  private readonly notificationService = inject(NotificationService);
  private readonly userProfileCache = inject(UserProfileCacheService);
  private readonly currentUserService = inject(CurrentUserService);
  readonly dialogService = inject(DialogService);

  readonly registration = signal<ShelterRegistrationRequestDetailsDto | null>(
    null,
  );
  readonly uploadedFiles = signal<FileMetadata[]>([]);
  readonly shelterRegistrationDetailsSkeletonComponent =
    ShelterRegistrationDetailsSkeletonComponent;
  readonly approveButtonLoading = signal<boolean>(false);

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

          // Preload user profiles for better UX
          if (result) {
            const userIds = [result.userId, result.reviewedByUserId].filter(Boolean) as string[];
            if (userIds.length > 0) {
              this.userProfileCache.preloadUserProfiles(userIds);
            }
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

  handleApproveRequest($event: string) {
    this.approveButtonLoading.set(true);
    this.service.approveRegistration($event).subscribe({
      next: () => {
        this.approveButtonLoading.set(false);
        this.notificationService.success(
          'Solicitud aprobada exitosamente.',
          '¡Aprobación exitosa!',
        );

        // Update registration status locally
        this.registration.update((reg) => {
          if (reg) {
            return {
              ...reg,
              status: 'Approved',
              reviewedAt: new Date().toISOString(),
              reviewedByUserId: this.currentUserService.getCurrentUserId() || '',
            };
          }
          return reg;
        });

        // Close dialog after success
        setTimeout(() => {
          this.dialogRef.close({ action: 'approved', id: $event });
        }, 1500);
      },
      error: (error) => {
        this.approveButtonLoading.set(false);
        this.notificationService.error(
          error.error?.message || 'Ocurrió un error al aprobar la solicitud.',
          'Error aprobando solicitud:',
        );
      },
    });
  }

  handleRejectRequest($event: string) {
    this.openRejectDialog($event);
  }

  handleCloseDialog(): void {
    this.dialogRef.close();
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

  private openRejectDialog(id: string): void {
    const ref = this.dialogService.open(RejectShelterRequestPageComponent, {
      data: { id },
      closeOnBackdropClick: false,
      size: 'large', // Uses max-w-lg (512px) responsively
      panelClass: ['min-h-[300px]'], // Keep minimum height only
    });

    ref.afterClosed.subscribe((result: any) => {
      if (result?.action === 'rejected') {
        // Update registration status locally
        this.registration.update((reg) => {
          if (reg) {
            return {
              ...reg,
              status: 'Rejected',
              reviewedAt: new Date().toISOString(),
              reviewedByUserId: this.currentUserService.getCurrentUserId() || '',
              rejectionReason: result.reason,
            };
          }
          return reg;
        });

        // Close main dialog after rejection
        setTimeout(() => {
          this.dialogRef.close({ action: 'rejected', id, reason: result.reason });
        }, 1500);
      }
    });
  }
}
