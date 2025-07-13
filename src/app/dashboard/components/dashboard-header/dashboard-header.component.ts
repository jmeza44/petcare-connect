import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faEdit, faUser } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterLink } from '@angular/router';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MenuOption } from '../../../shared/models/menu-option';

@Component({
  selector: 'dashboard-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, RouterLink, SearchBarComponent, ButtonComponent],
  templateUrl: './dashboard-header.component.html',
})
export class DashboardHeaderComponent {
  readonly screenIsLarge = input(false);
  readonly toggleSidebar = output<void>();

  readonly icons = {
    user: faUser,
    menu: faBars,
  };

  readonly menuOptions: MenuOption[] = [
    {
      label: 'Cambiar contraseña',
      icon: faEdit,
      action: () => this.router.navigate(['dashboard', 'cambiar-contraseña']),
    },
  ];

  constructor(private readonly router: Router) {}

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
