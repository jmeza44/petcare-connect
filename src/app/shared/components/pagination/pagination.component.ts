import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pet-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FontAwesomeModule],
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
    const pages: number[] = [];
    const total = this.totalPages();
    for (let i = 1; i <= total; i++) {
      pages.push(i);
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
