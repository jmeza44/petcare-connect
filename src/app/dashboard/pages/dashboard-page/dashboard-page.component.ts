import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { faBell, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SideBarMenuComponent } from '../../components/side-bar-menu/side-bar-menu.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FontAwesomeModule, SearchBarComponent, SideBarMenuComponent],
  templateUrl: './dashboard-page.component.html',
  styles: `:host {
    display: contents;
  }`
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
        this.isSidebarVisible = true; // Always visible on large screens
      }
    });

    // Ensure it's visible on init if large
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
