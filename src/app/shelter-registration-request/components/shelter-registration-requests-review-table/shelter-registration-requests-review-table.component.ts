import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FontAwesomeModule,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import {
  faCheckCircle,
  faDotCircle,
  faEye,
  faHouseCircleCheck,
  faHouseCircleXmark,
  faMinusCircle,
  faSpinner,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { GetAllShelterRegistrationsResult } from '../../models/get-all-shelter-registrations-result.model';
import { fadeInOutAnimation } from '../../../shared/animations/fade-in-out.animation';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';
import { CellphoneNumberPipe } from '../../../shared/pipes/cellphone-number.pipe';
import { UtcToLocalPipe } from '../../../shared/pipes/utc-to-local.pipe';

@Component({
  selector: 'pet-shelter-registration-requests-review-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    CellphoneNumberPipe,
    UtcToLocalPipe,
    ButtonComponent,
    FontAwesomeModule,
    TooltipDirective,
  ],
  animations: [fadeInOutAnimation],
  template: `
    <div class="w-full overflow-x-auto rounded-xl border border-gray-100">
      <table class="min-w-full table-auto border-collapse text-left">
        <thead>
          <tr class="bg-primary-100">
            <th class="p-3">Nombre del Refugio</th>
            <th class="p-3">Correo</th>
            <th class="p-3">Teléfono</th>
            <th class="p-3">Ciudad</th>
            <th class="p-3">Departamento</th>
            <th class="p-3">Estado</th>
            <th class="p-3">Fecha de Envío</th>
            <th class="p-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody [@fadeInOut]>
          @if (requests().length === 0) {
            <tr>
              <td colspan="8" class="p-6 text-center text-gray-500">
                No hay registros para mostrar.
              </td>
            </tr>
          } @else {
            @for (request of requests(); track request.id) {
              <tr
                class="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
              >
                <td class="p-3">{{ request.shelterName }}</td>
                <td class="p-3">{{ request.email }}</td>
                <td class="p-3">
                  {{ request.cellphoneNumber | cellphoneNumber }}
                </td>
                <td class="p-3">{{ request.city }}</td>
                <td class="p-3">{{ request.department }}</td>
                <td class="p-3">
                  @if (request.status === 'Pending') {
                    <fa-icon
                      [icon]="icons['faMinusCircle']"
                      class="mr-4 text-amber-500"
                      size="lg"
                      [appTooltip]="'Pendiente de revisión'"
                    />
                  }
                  @if (request.status === 'Withdrawn') {
                    <fa-icon
                      [icon]="icons['faDotCircle']"
                      class="mr-4 text-gray-500"
                      size="lg"
                      [appTooltip]="'Retirada por el refugio'"
                    />
                  }
                  @if (request.status === 'Approved') {
                    <fa-icon
                      [icon]="icons['faCheckCircle']"
                      class="mr-4 text-green-500"
                      size="lg"
                      [appTooltip]="'Aprobada'"
                    />
                  }
                  @if (request.status === 'Rejected') {
                    <fa-icon
                      [icon]="icons['faXmarkCircle']"
                      class="mr-4 text-red-500"
                      size="lg"
                      [appTooltip]="'Rechazada'"
                    />
                  }
                </td>
                <td class="p-3">
                  {{ request.createdAt | utcToLocal | date: 'medium' }}
                </td>
                <td class="p-3 text-right">
                  <pet-button
                    [icon]="icons['faEye']"
                    [color]="'basic'"
                    [styling]="'link'"
                    [tooltip]="'Detalles de la solicitud'"
                    (clickTriggered)="viewRequest.emit(request.id)"
                  />
                  <pet-button
                    [icon]="icons['faHouseCircleCheck']"
                    [color]="'success'"
                    [styling]="'link'"
                    [tooltip]="'Aprobar solicitud'"
                    (clickTriggered)="approveRequest.emit(request.id)"
                  />
                  <pet-button
                    [icon]="icons['faHouseCircleXmark']"
                    [color]="'danger'"
                    [styling]="'link'"
                    [tooltip]="'Rechazar solicitud'"
                    (clickTriggered)="rejectRequest.emit(request.id)"
                  />
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
})
export class ShelterRegistrationRequestsReviewTableComponent {
  readonly requests = input<GetAllShelterRegistrationsResult[]>([]);
  readonly viewRequest = output<string>();
  readonly approveRequest = output<string>();
  readonly rejectRequest = output<string>();

  constructor() {}

  readonly icons: Record<string, IconDefinition> = {
    faMinusCircle,
    faDotCircle,
    faCheckCircle,
    faXmarkCircle,
    faHouseCircleCheck,
    faHouseCircleXmark,
    faEye,
    faSpinner,
  };
}
