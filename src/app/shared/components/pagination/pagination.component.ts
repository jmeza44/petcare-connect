import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAnglesLeft,
  faAnglesRight,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pet-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule],
  templateUrl: './pagination.component.html',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class PaginationComponent {
  // Inputs
  readonly customClass = input<string>('');
  readonly currentPage = input(1);
  readonly pageSize = input(10);
  readonly totalPages = input(1);
  readonly hasPreviousPage = input(false);
  readonly hasNextPage = input(false);
  readonly pageSizeOptions = input<number[]>([5, 10, 20, 50, 100]);
  readonly totalItems = input(0);

  // Outputs
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = 5;
    const pages: number[] = [];

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(current - Math.floor(maxVisible / 2), 1);
      let end = start + maxVisible - 1;

      // If we're near the end, adjust start and end
      if (end > total) {
        end = total;
        start = total - maxVisible + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  });

  readonly fromItem = computed(() =>
    this.totalItems() === 0
      ? 0
      : (this.currentPage() - 1) * this.pageSize() + 1,
  );

  readonly toItem = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.totalItems()),
  );

  readonly dropdownIcon = faChevronDown;
  readonly previousPageIcon = faChevronLeft;
  readonly nextPageIcon = faChevronRight;
  readonly firstPageIcon = faAnglesLeft;
  readonly lastPageIcon = faAnglesRight;

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    if (page === this.currentPage()) return;
    this.pageChange.emit(page);
  }

  changePageSize(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const parsed = Number(target.value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      this.pageSizeChange.emit(parsed);
    }
  }
}
