import { Component } from '@angular/core';

@Component({
  selector: 'pet-about-us-page',
  standalone: true,
  imports: [],
  templateUrl: './about-us-page.component.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class AboutUsPageComponent {}
