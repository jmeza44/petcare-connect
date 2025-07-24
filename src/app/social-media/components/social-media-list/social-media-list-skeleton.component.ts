import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pet-social-media-list-skeleton',
  standalone: true,
  imports: [],
  template: `
    <ul class="space-y-2">
      @for (_ of [1, 2]; track _) {
        <li class="flex items-center space-x-2">
          <div class="skeleton h-5 w-5 rounded-full"></div>
          <div class="skeleton h-4 w-2/3 rounded"></div>
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialMediaListSkeletonComponent {}
