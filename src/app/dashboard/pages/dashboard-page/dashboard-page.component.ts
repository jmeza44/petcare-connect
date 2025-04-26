import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SideBarMenuComponent } from '../../components/side-bar-menu/side-bar-menu.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { fadeInOutAnimation } from '../../../shared/animations/fade-in-out.animation';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FontAwesomeModule,
    ButtonComponent,
    SideBarMenuComponent,
    DashboardHeaderComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styles: `
    :host {
      display: contents;
    }
  `,
  animations: [fadeInOutAnimation],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  icons = {
    bell: faBell,
    menu: faBars,
    close: faTimes,
  };

  isSidebarVisible: boolean = false;
  screenIsLarge = window.innerWidth >= 1024;
  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    window.addEventListener('resize', () => {
      this.screenIsLarge = window.innerWidth >= 1024;
      if (this.screenIsLarge) {
        this.isSidebarVisible = true;
      }
    });

    this.isSidebarVisible = this.screenIsLarge;

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && !this.screenIsLarge) {
        this.isSidebarVisible = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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
