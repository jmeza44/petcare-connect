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
import { GetAllShelterRegistrationsQuery } from '../../models/get-all-shelter-registrations-query.model';
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
      class="mx-auto flex min-h-full w-full flex-col justify-center px-5 py-12"
    >
      <h1 class="mb-4 text-2xl font-semibold">
        Solicitudes de Registro de Refugio
      </h1>

      <pet-shelter-registration-filter-form
        customClass="mb-6"
        (filtersChange)="handleFiltersChange($event)"
      ></pet-shelter-registration-filter-form>

      <pet-shelter-registration-requests-review-table
        *skeletonIf="loading(); skeleton: skeleton"
        [requests]="requests()"
        (viewRequest)="handleView($event)"
        (approveRequest)="handleApprove($event)"
        (rejectRequest)="handleReject($event)"
      ></pet-shelter-registration-requests-review-table>

      <div class="flex-auto"></div>

      <pet-pagination
        customClass="mt-6"
        [currentPage]="pagination().page"
        [pageSize]="pagination().pageSize"
        [totalPages]="pagination().totalPages"
        [hasPreviousPage]="pagination().hasPreviousPage"
        [hasNextPage]="pagination().hasNextPage"
        [pageSizeOptions]="[5, 10, 20]"
        [totalItems]="pagination().totalCount"
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
    pageSize: 5,
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

  ngOnInit(): void {
    this.loadRequests({});

    this.route.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.openDialog(id);
      }
    });
  }

  handleFiltersChange($event: GetAllShelterRegistrationsQuery) {
    const updatedQuery = {
      ...$event,
      page: 1,
      pageSize: this.pagination().pageSize,
    };
    this.query.set(updatedQuery);
    this.pagination.set({
      ...this.pagination(),
      page: 1,
    });
    this.loadRequests(updatedQuery);
  }

  handlePageChange($event: number) {
    const updatedQuery = { ...this.query(), page: $event };
    this.query.set(updatedQuery);
    this.pagination.set({ ...this.pagination(), page: $event });
    this.loadRequests(updatedQuery);
  }

  handlePageSizeChange($event: number) {
    const updatedQuery = { ...this.query(), pageSize: $event, page: 1 };
    this.query.set(updatedQuery);
    this.pagination.set({
      ...this.pagination(),
      pageSize: $event,
      page: 1,
    });
    this.loadRequests(updatedQuery);
  }

  handleView(id: string): void {
    this.router.navigate([], {
      queryParams: { id },
      queryParamsHandling: 'merge',
    });
  }

  handleApprove(id: string): void {
    console.log('Approve shelter with id', id);
    // Call service to approve
  }

  handleReject(id: string): void {
    console.log('Reject shelter with id', id);
    // Call service to reject
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

    ref.afterClosed.subscribe(() => {
      this.router.navigate([], {
        queryParams: { id: null },
        queryParamsHandling: 'merge',
      });
    });
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
            error.error?.message,
            'Error loading requests:',
          );
          this.loading.set(false);
        },
      });
  }
}
