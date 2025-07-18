import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pet-address-skeleton',
  standalone: true,
  imports: [],
  template: ` <div class="skeleton h-4 w-3/4 rounded"></div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressSkeletonComponent {}
