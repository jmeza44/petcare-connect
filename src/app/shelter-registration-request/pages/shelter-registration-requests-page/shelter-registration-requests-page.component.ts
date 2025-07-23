import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { GetAllShelterRegistrationsResult } from '../../models/get-all-shelter-registrations-result.model';
import { ShelterRegistrationRequestsReviewTableComponent } from '../../components/shelter-registration-requests-review-table/shelter-registration-requests-review-table.component';
import { ShelterRegistrationRequestService } from '../../services/shelter-registration-request.service';
import { ShelterRegistrationFilterFormComponent } from '../../components/shelter-registration-filter-form/shelter-registration-filter-form.component';
import {
  GetAllShelterRegistrationsQuery,
  ShelterRequestSortBy,
  ShelterRequestSortDirection,
} from '../../models/get-all-shelter-registrations-query.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ShelterRegistrationDetailsPageComponent } from '../shelter-registration-details-page/shelter-registration-details-page.component';
import { DialogService } from '../../../shared/services/dialog.service';
import { SkeletonIfDirective } from '../../../shared/directives/skeleton-if.directive';
import { ShelterRegistrationRequestsReviewTableSkeletonComponent } from '../../components/shelter-registration-requests-review-table/shelter-registration-requests-review-table-skeleton.component';

@Component({
  selector: 'pet-shelter-registration-requests-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ShelterRegistrationFilterFormComponent,
    ShelterRegistrationRequestsReviewTableComponent,
    PaginationComponent,
    SkeletonIfDirective,
  ],
  template: `
    <section
      class="mx-auto flex h-full w-full flex-col justify-center overflow-hidden px-5 py-6"
    >
      <h1 class="mb-4 flex-initial text-2xl font-semibold">
        Solicitudes de Registro de Refugio
      </h1>

      <pet-shelter-registration-filter-form
        [customClass]="'mb-6 flex-initial'"
        [initialValues]="query()"
        (filtersChange)="handleFiltersChange($event)"
      ></pet-shelter-registration-filter-form>

      <pet-shelter-registration-requests-review-table
        *skeletonIf="loading(); skeleton: skeleton"
        [requests]="requests()"
        [customClass]="'flex-auto'"
        [sortBy]="query().sortBy"
        [sortDirection]="query().sortDirection"
        (sortChange)="handleSortChange($event)"
        (viewRequest)="handleView($event)"
        (approveRequest)="handleApprove($event)"
        (rejectRequest)="handleReject($event)"
      ></pet-shelter-registration-requests-review-table>

      <div class="flex-auto"></div>

      <pet-pagination
        [customClass]="'flex-initial mt-6'"
        [currentPage]="pagination().page"
        [pageSize]="pagination().pageSize"
        [totalPages]="pagination().totalPages"
        [hasPreviousPage]="pagination().hasPreviousPage"
        [hasNextPage]="pagination().hasNextPage"
        [pageSizeOptions]="allowedPageSizes"
        [totalItems]="pagination().totalCount"
        [debounceDelay]="300"
        (pageChange)="handlePageChange($event)"
        (pageSizeChange)="handlePageSizeChange($event)"
      />
    </section>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class ShelterRegistrationRequestsPageComponent implements OnInit {
  readonly requests = signal<GetAllShelterRegistrationsResult[]>([]);
  readonly query = signal<GetAllShelterRegistrationsQuery>({});
  readonly loading = signal(false);
  readonly pagination = signal({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
    totalCount: 0,
  });

  readonly shelterRegistrationRequestService = inject(
    ShelterRegistrationRequestService,
  );
  readonly notificationService = inject(NotificationService);
  readonly dialogService = inject(DialogService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  readonly skeleton = ShelterRegistrationRequestsReviewTableSkeletonComponent;
  readonly allowedPageSizes = [5, 10, 20];

  private previousQuery: GetAllShelterRegistrationsQuery | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const query: GetAllShelterRegistrationsQuery = {
        search: params['search'] ?? undefined,
        status: params['status'] ?? undefined,
        city: params['city'] ?? undefined,
        department: params['department'] ?? undefined,
        submittedFrom: params['submittedFrom'] ?? undefined,
        submittedTo: params['submittedTo'] ?? undefined,
        page: +params['page'] || 1,
        pageSize: +params['pageSize'] || 5,
        sortBy: params['sortBy'] as ShelterRequestSortBy | undefined,
        sortDirection: params['sortDirection'] as
          | ShelterRequestSortDirection
          | undefined,
      };

      if (!this.allowedPageSizes.includes(query.pageSize ?? 10)) {
        query.pageSize = this.getClosestPageSize(
          query.pageSize ?? 10,
          this.allowedPageSizes,
        );
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { pageSize: query.pageSize },
          queryParamsHandling: 'merge',
        });
        return;
      }

      const queryChanged = !this.areQueriesEqual(this.previousQuery, query);
      this.previousQuery = query;

      this.query.set(query);
      this.pagination.set({
        ...this.pagination(),
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
      });

      if (queryChanged) {
        this.loadRequests(query);
      }

      if (params['id']) {
        this.openDialog(params['id']);
      }
    });
  }

  handleFiltersChange($event: GetAllShelterRegistrationsQuery) {
    const updatedQuery = {
      ...$event,
      page: 1,
      pageSize: this.pagination().pageSize,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: updatedQuery,
      queryParamsHandling: 'merge',
    });
  }

  handlePageChange($event: number) {
    const updatedQuery = { ...this.query(), page: $event };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: updatedQuery,
      queryParamsHandling: 'merge',
    });
  }

  handlePageSizeChange($event: number) {
    const updatedQuery = { ...this.query(), pageSize: $event, page: 1 };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: updatedQuery,
      queryParamsHandling: 'merge',
    });
  }

  handleSortChange({
    sortBy,
    sortDirection,
  }: {
    sortBy: ShelterRequestSortBy;
    sortDirection: ShelterRequestSortDirection;
  }) {
    const updatedQuery = { ...this.query(), sortBy, sortDirection, page: 1 };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: updatedQuery,
      queryParamsHandling: 'merge',
    });
  }

  handleView(id: string): void {
    this.router.navigate([], {
      queryParams: { id },
      queryParamsHandling: 'merge',
    });
  }

  handleApprove(id: string): void {
    // Direct approval without opening dialog
    this.shelterRegistrationRequestService.approveRegistration(id).subscribe({
      next: () => {
        this.notificationService.success(
          'Solicitud aprobada exitosamente.',
          '¡Aprobación exitosa!',
        );

        // Update the request in the local list
        this.updateRequestInList(id, {
          status: 'Approved',
          reviewedAt: new Date().toISOString(),
        });
      },
      error: (error) => {
        this.notificationService.error(
          error.error?.message || 'Ocurrió un error al aprobar la solicitud.',
          'Error aprobando solicitud',
        );
      },
    });
  }

  handleReject(id: string): void {
    // For reject, we need to open the dialog to get the reason
    this.router.navigate([], {
      queryParams: { id },
      queryParamsHandling: 'merge',
    });
  }

  openDialog(id: string): void {
    const ref = this.dialogService.open(
      ShelterRegistrationDetailsPageComponent,
      {
        data: { id },
        closeOnBackdropClick: true,
        panelClass: ['min-w-[582px]', 'min-h-[460px]'],
      },
    );

    ref.afterClosed.subscribe((result: any) => {
      this.router.navigate([], {
        queryParams: { id: null },
        queryParamsHandling: 'merge',
      });

      // Update the request in the local list if action was performed
      if (result?.action === 'approved') {
        this.updateRequestInList(result.id, {
          status: 'Approved',
          reviewedAt: new Date().toISOString(),
        });
      } else if (result?.action === 'rejected') {
        this.updateRequestInList(result.id, {
          status: 'Rejected',
          reviewedAt: new Date().toISOString(),
        });
      }
    });
  }

  private updateRequestInList(
    id: string,
    updates: Partial<GetAllShelterRegistrationsResult>,
  ): void {
    this.requests.update((requests) =>
      requests.map((request) =>
        request.id === id ? { ...request, ...updates } : request,
      ),
    );
  }

  private loadRequests(query: GetAllShelterRegistrationsQuery) {
    this.loading.set(true);
    this.shelterRegistrationRequestService
      .getAllRegistrations(query)
      .subscribe({
        next: (result) => {
          const {
            page,
            pageSize,
            totalPages,
            hasPreviousPage,
            hasNextPage,
            totalCount,
          } = result;
          this.pagination.set({
            page,
            pageSize,
            totalPages,
            hasPreviousPage,
            hasNextPage,
            totalCount,
          });
          this.requests.set(result.items);
          this.loading.set(false);
        },
        error: (error) => {
          this.notificationService.error(
            error.error?.message || 'Error loading requests',
            'Error loading requests:',
          );
          this.loading.set(false);
        },
      });
  }

  private getClosestPageSize(value: number, options: number[]): number {
    return options.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
    );
  }

  private areQueriesEqual(
    a: GetAllShelterRegistrationsQuery | null,
    b: GetAllShelterRegistrationsQuery,
  ): boolean {
    if (!a) return false;

    return (
      a.search === b.search &&
      a.status === b.status &&
      a.city === b.city &&
      a.department === b.department &&
      a.submittedFrom === b.submittedFrom &&
      a.submittedTo === b.submittedTo &&
      a.page === b.page &&
      a.pageSize === b.pageSize &&
      a.sortBy === b.sortBy &&
      a.sortDirection === b.sortDirection
    );
  }
}
