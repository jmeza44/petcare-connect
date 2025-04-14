import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SideBarMenuComponent } from '../../components/side-bar-menu/side-bar-menu.component';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, FontAwesomeModule, SideBarMenuComponent, DashboardHeaderComponent],
  templateUrl: './dashboard-page.component.html',
  styles: `:host {
    display: contents;
  }`,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class DashboardPageComponent implements OnInit {
  icons = {
    bell: faBell,
    menu: faBars,
    close: faTimes,
  }

  isSidebarVisible: boolean = false;
  screenIsLarge = window.innerWidth >= 1024;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
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

  handleSignOut() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
