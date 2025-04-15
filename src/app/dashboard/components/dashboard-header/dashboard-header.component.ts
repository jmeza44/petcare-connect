import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
    selector: 'dashboard-header',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, RouterLink, SearchBarComponent, ButtonComponent],
    templateUrl: './dashboard-header.component.html',
})
export class DashboardHeaderComponent {
    @Input() screenIsLarge = false;
    @Output() toggleSidebar = new EventEmitter<void>();

    icons = {
        user: faUser,
        menu: faBars,
    }

    onUserClick() {
        // Handle user icon click event here
        console.log('User icon clicked!');
    }

    onToggleSidebar() {
        this.toggleSidebar.emit();
    }
}
