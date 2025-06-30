import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AuthService } from '../../../auth/services/auth.service';
import { ButtonComponent } from '../button/button.component';
import { fadeInOutAnimation } from '../../animations/fade-in-out.animation';
import { slideHeightAnimation } from '../../animations/slide-height.animations';

@Component({
    selector: 'pet-navigation-bar',
    imports: [RouterLink, FontAwesomeModule, ButtonComponent],
    templateUrl: './navigation-bar.component.html',
    styles: ``,
    animations: [fadeInOutAnimation, slideHeightAnimation]
})
export class NavigationBarComponent implements OnInit {
  icons = {
    menu: faBars,
  };

  isAuthenticated = false;
  isSidebarVisible: boolean = false;
  screenIsLarge = window.innerWidth >= 1024;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    window.addEventListener('resize', () => {
      this.screenIsLarge = window.innerWidth >= 1024;
      if (this.screenIsLarge) {
        this.isSidebarVisible = true;
      }
    });

    this.isSidebarVisible = this.screenIsLarge;
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
