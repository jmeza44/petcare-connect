import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SideBarMenuComponent } from '../../components/side-bar-menu/side-bar-menu.component';
import { AuthService } from '../../../auth/services/auth.service';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { fadeInOutAnimation } from '../../../shared/animations/fade-in-out.animation';

@Component({
  selector: 'pet-dashboard-page',
  standalone: true,
  imports: [
    RouterOutlet,
    FontAwesomeModule,
    ButtonComponent,
    SideBarMenuComponent,
    DashboardHeaderComponent,
  ],
  animations: [fadeInOutAnimation],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class DashboardPageComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly icons = {
    bell: faBell,
    menu: faBars,
    close: faTimes,
  };

  readonly screenWidth = signal(window.innerWidth);
  readonly isSidebarVisible = signal(window.innerWidth >= 1024);

  readonly screenIsLarge = computed(() => this.screenWidth() >= 1024);

  constructor() {
    window.addEventListener('resize', () => {
      this.screenWidth.set(window.innerWidth);
      if (this.screenIsLarge()) this.isSidebarVisible.set(true);
    });

    effect(() =>
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd && !this.screenIsLarge()) {
          this.isSidebarVisible.set(false);
        }
      }),
    );
  }

  toggleSidebar(): void {
    this.isSidebarVisible.update((visible) => !visible);
  }

  handleSignOut(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
