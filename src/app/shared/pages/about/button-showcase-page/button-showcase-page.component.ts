import { Component } from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../../components/button/button.component';

@Component({
  selector: 'pet-button-showcase-page',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './button-showcase-page.component.html',
  styles: ``
})
export class ButtonShowcasePageComponent {
  starIcon = faStar;
}
