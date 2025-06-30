import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faEdit, faUser } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterLink } from '@angular/router';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MenuOption } from '../../../shared/models/menu-option';

@Component({
    selector: 'dashboard-header',
    imports: [
    FontAwesomeModule,
    RouterLink,
    SearchBarComponent,
    ButtonComponent
],
    templateUrl: './dashboard-header.component.html'
})
export class DashboardHeaderComponent {
  @Input() screenIsLarge = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  icons = {
    user: faUser,
    menu: faBars,
  };
  menuOptions: MenuOption[] = [
    {
      label: 'Change Password',
      icon: faEdit,
      action: () => this.router.navigate(['dashboard', 'cambiar-contraseña']),
    },
  ];

  constructor(private router: Router) {}

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
