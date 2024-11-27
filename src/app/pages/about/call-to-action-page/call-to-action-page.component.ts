import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pet-call-to-action-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './call-to-action-page.component.html',
  styles: `:host {display: contents;}`
})
export class CallToActionPageComponent {

}
