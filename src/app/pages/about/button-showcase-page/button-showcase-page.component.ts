import { Component } from '@angular/core';
import { ButtonComponent } from '../../../components/shared/button/button.component';
import { faStar } from '@fortawesome/free-solid-svg-icons';

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
