import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Address } from '../../models/address.model';

@Component({
  selector: 'pet-address',
  standalone: true,
  imports: [],
  template: `
    <address class="not-italic">
      {{ address.street }}, {{ address.city }}, {{ address.department }},
      {{ address.country }} - {{ address.postalCode }}
    </address>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
  @Input({ required: true }) address!: Address;
}
