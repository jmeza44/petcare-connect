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
  faArrowDownAZ,
  faArrowDownShortWide,
  faArrowUpAZ,
  faArrowUpShortWide,
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
import {
  ShelterRequestSortBy,
  ShelterRequestSortDirection,
} from '../../models/get-all-shelter-registrations-query.model';

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
    <div
      class="h-full w-full overflow-x-auto rounded-xl border border-gray-100"
      [class]="customClass()"
    >
      <div class="max-h-full overflow-y-auto">
        <table class="min-w-full table-fixed border-collapse">
          <thead class="sticky top-0 z-10 bg-primary-100">
            <tr>
              <th
                class="group w-2/12 cursor-pointer select-none border-r border-gray-100 p-3"
                (click)="onSort('shelterName')"
              >
                Nombre
                @if (sortBy() === 'shelterName') {
                  <fa-icon
                    [icon]="
                      sortDirection() === 'asc'
                        ? icons['faArrowUpAZ']
                        : icons['faArrowDownAZ']
                    "
                    class="ml-1 text-gray-600"
                  />
                } @else {
                  <fa-icon
                    [icon]="icons['faArrowDownAZ']"
                    class="ml-1 text-gray-400 opacity-0 group-hover:opacity-100"
                  />
                }
              </th>
              <th class="w-1/12 border-r border-gray-100 p-3">Correo</th>
              <th class="w-1/12 border-r border-gray-100 p-3">Teléfono</th>
              <th class="w-1/12 border-r border-gray-100 p-3">Ciudad</th>
              <th class="w-1/12 border-r border-gray-100 p-3">Departamento</th>
              <th
                class="group w-1/12 cursor-pointer select-none border-r border-gray-100 p-3"
                (click)="onSort('status')"
              >
                Estado
                @if (sortBy() === 'status') {
                  <fa-icon
                    [icon]="
                      sortDirection() === 'asc'
                        ? icons['faArrowUpShortWide']
                        : icons['faArrowDownShortWide']
                    "
                    class="ml-1 text-gray-600"
                  />
                } @else {
                  <fa-icon
                    [icon]="icons['faArrowDownShortWide']"
                    class="ml-1 text-gray-400 opacity-0 group-hover:opacity-100"
                  />
                }
              </th>
              <th
                class="group w-2/12 cursor-pointer select-none border-r border-gray-100 p-3"
                (click)="onSort('createdAt')"
              >
                Fecha de Envío
                @if (sortBy() === 'createdAt') {
                  <fa-icon
                    [icon]="
                      sortDirection() === 'asc'
                        ? icons['faArrowUpShortWide']
                        : icons['faArrowDownShortWide']
                    "
                    class="ml-1 text-gray-600"
                  />
                } @else {
                  <fa-icon
                    [icon]="icons['faArrowDownShortWide']"
                    class="ml-1 text-gray-400 opacity-0 group-hover:opacity-100"
                  />
                }
              </th>
              <th
                class="group w-2/12 cursor-pointer select-none border-r border-gray-100 p-3"
                (click)="onSort('reviewedAt')"
              >
                Fecha de Revisión
                @if (sortBy() === 'reviewedAt') {
                  <fa-icon
                    [icon]="
                      sortDirection() === 'asc'
                        ? icons['faArrowUpShortWide']
                        : icons['faArrowDownShortWide']
                    "
                    class="ml-1 text-gray-600"
                  />
                } @else {
                  <fa-icon
                    [icon]="icons['faArrowDownShortWide']"
                    class="ml-1 text-gray-400 opacity-0 group-hover:opacity-100"
                  />
                }
              </th>
              <th class="w-fit p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody [@fadeInOut] class="overflow-y-auto">
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
                  <td class="w-2/12 p-3">{{ request.shelterName }}</td>
                  <td class="w-1/12 p-3">{{ request.email }}</td>
                  <td class="w-1/12 p-3">
                    {{ request.cellphoneNumber | cellphoneNumber }}
                  </td>
                  <td class="w-1/12 p-3">{{ request.city }}</td>
                  <td class="w-1/12 p-3">{{ request.department }}</td>
                  <td class="w-1/12 p-3">
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
                  <td class="w-2/12 p-3">
                    {{ request.createdAt | utcToLocal | date: 'medium' }}
                  </td>
                  <td class="w-2/12 p-3">
                    {{
                      request.reviewedAt
                        ? (request.reviewedAt | utcToLocal | date: 'medium')
                        : 'No revisado'
                    }}
                  </td>
                  <td class="w-fit p-3 text-right">
                    <pet-button
                      [icon]="icons['faEye']"
                      [color]="'basic'"
                      [styling]="'link'"
                      [tooltip]="'Detalles de la solicitud'"
                      (clickTriggered)="viewRequest.emit(request.id)"
                    />
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
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
export class ShelterRegistrationRequestsReviewTableComponent {
  readonly customClass = input<string>('');
  readonly requests = input<GetAllShelterRegistrationsResult[]>([]);
  readonly sortBy = input<ShelterRequestSortBy | undefined>(undefined);
  readonly sortDirection = input<ShelterRequestSortDirection | undefined>(
    undefined,
  );
  readonly viewRequest = output<string>();
  readonly approveRequest = output<string>();
  readonly rejectRequest = output<string>();
  readonly sortChange = output<{
    sortBy: ShelterRequestSortBy;
    sortDirection: ShelterRequestSortDirection;
  }>();

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
    faArrowUpAZ,
    faArrowDownAZ,
    faArrowUpShortWide,
    faArrowDownShortWide,
  };

  onSort(column: ShelterRequestSortBy) {
    if (this.sortBy() !== column) {
      this.sortChange.emit({ sortBy: column, sortDirection: 'desc' });
    } else {
      const next = this.sortDirection() === 'asc' ? 'desc' : 'asc';
      this.sortChange.emit({ sortBy: column, sortDirection: next });
    }
  }
}
