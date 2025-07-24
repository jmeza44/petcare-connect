import { Component, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'pet-uploaded-file-list-skeleton',
  standalone: true,
  imports: [],
  template: `
    <ul class="space-y-3">
      @for (_ of [1, 2]; track _) {
        <li
          class="flex items-center justify-between rounded-md border bg-gray-50 px-4 py-3 shadow-sm"
        >
          <div class="flex items-center gap-3">
            <div class="skeleton h-6 w-6 rounded-full"></div>
            <div>
              <div class="skeleton mb-1 h-4 w-40"></div>
              <div class="skeleton h-3 w-32"></div>
            </div>
          </div>
          <div class="skeleton h-6 w-6 rounded-full"></div>
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadedFileListSkeletonComponent {}
