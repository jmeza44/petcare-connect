import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faEdit,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MenuOption } from '../../../shared/models/menu-option';

@Component({
  selector: 'dashboard-header',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLink,
    SearchBarComponent,
    ButtonComponent,
  ],
  templateUrl: './dashboard-header.component.html',
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
      label: 'Edit',
      icon: faEdit,
      action: () => console.log('Edit clicked'),
    },
    {
      label: 'Delete',
      icon: faTrash,
      action: () => console.log('Delete clicked'),
    },
  ];

  onUserClick() {
    // Handle user icon click event here
    console.log('User icon clicked!');
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
