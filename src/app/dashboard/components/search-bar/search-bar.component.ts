import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'pet-search-bar',
  imports: [FontAwesomeModule],
  templateUrl: './search-bar.component.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class SearchBarComponent {}
