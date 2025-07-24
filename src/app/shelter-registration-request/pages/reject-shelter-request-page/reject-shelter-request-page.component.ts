import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  Inject,
} from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogRef } from '../../../shared/ref/dialog.ref';
import { DIALOG_CONFIG } from '../../../shared/tokens/dialog.tokens';
import { NotificationService } from '../../../shared/services/notification.service';
import { ShelterRegistrationRequestService } from '../../services/shelter-registration-request.service';
import { RejectShelterRequestFormComponent } from '../../components/reject-shelter-request-form/reject-shelter-request-form.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'pet-reject-shelter-request-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    RejectShelterRequestFormComponent,
    ButtonComponent,
  ],
  template: `
    <div class="mx-auto max-w-xl p-6">
      <header class="mb-2 flex items-end justify-between">
        <h2 class="inline-block text-2xl font-bold">Rechazo de solicitud</h2>
        <pet-button
          [icon]="closeIcon"
          [styling]="'link'"
          [color]="'basic'"
          [size]="'large'"
          (clickTriggered)="closeDialog()"
        >
        </pet-button>
      </header>
      <p class="mb-6 text-gray-400">
        Indica claramente las razones del rechazo de esta solicitud.
      </p>

      @if (requestId()) {
        <pet-reject-shelter-request-form
          [isSubmitting]="isSubmitting()"
          (rejectionSubmitted)="onRejection($event)"
        />
      } @else {
        <p class="text-red-500">
          Algo anda mal. No hemos podido identificar la solicitud que intentas
          rechazar. Intenta nuevamente.
        </p>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class RejectShelterRequestPageComponent {
  private service = inject(ShelterRegistrationRequestService);
  private notifications = inject(NotificationService);

  readonly isSubmitting = signal(false);
  readonly requestId = signal<string | null>(null);

  readonly closeIcon = faXmark;

  constructor(
    @Inject(DIALOG_CONFIG)
    readonly data: { id: string },
    private readonly dialogRef: DialogRef<RejectShelterRequestPageComponent>,
  ) {
    this.requestId.set(data.id);
  }

  onRejection(reason: string): void {
    const id = this.requestId();
    if (!id) return;

    this.isSubmitting.set(true);

    this.service.rejectRegistration(id, { reason }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notifications.success(
          'Solicitud rechazada exitosamente.',
          'Rechazo exitoso'
        );

        // Close dialog with result
        this.dialogRef.close({ action: 'rejected', reason });
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.notifications.error(
          error.error?.message || 'Ocurrió un error al rechazar la solicitud.',
          'Error rechazando solicitud'
        );
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
