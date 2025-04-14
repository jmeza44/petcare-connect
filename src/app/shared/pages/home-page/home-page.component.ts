import { Component } from '@angular/core';
import { NavigationBarComponent } from '../../components/navigation-bar/navigation-bar.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFacebook, faXTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

@Component({
  standalone: true,
  imports: [FaIconComponent, NavigationBarComponent],
  templateUrl: './home-page.component.html',
  styles: ``
})
export class HomePageComponent {
  facebook = faFacebook;
  twitter = faXTwitter;
  instagram = faInstagram;
  youtube = faYoutube;
}
