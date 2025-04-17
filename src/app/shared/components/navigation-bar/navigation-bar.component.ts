import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'pet-navigation-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './navigation-bar.component.html',
  styles: ``,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
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
