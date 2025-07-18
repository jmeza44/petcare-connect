import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pet-shelter-registration-requests-review-table-skeleton',
  standalone: true,
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
        <tbody>
          @for (_ of placeholders; track _) {
            <tr class="border-b border-gray-100 last:border-b-0">
              <td class="p-3">
                <div class="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td class="p-3">
                <div class="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td class="p-3">
                <div class="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td class="p-3">
                <div class="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td class="p-3">
                <div class="h-4 w-28 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td class="p-3">
                <div
                  class="h-5 w-5 animate-pulse rounded-full bg-gray-300"
                ></div>
              </td>
              <td class="p-3">
                <div class="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td class="p-3 text-right">
                <div class="flex justify-end gap-2">
                  <div class="h-5 w-5 animate-pulse rounded bg-gray-300"></div>
                  <div class="h-5 w-5 animate-pulse rounded bg-gray-300"></div>
                  <div class="h-5 w-5 animate-pulse rounded bg-gray-300"></div>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelterRegistrationRequestsReviewTableSkeletonComponent {
  placeholders = Array(5);
}
