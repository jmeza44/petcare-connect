import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faAngry } from '@fortawesome/free-regular-svg-icons';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import { SearchBarComponent } from '../../../components/shared/search-bar/search-bar.component';
import { PermissionService } from '../../../global/services/auth/permission.service';
import { ProgramGroup } from '../../../global/models/permissions/program-group.model';
import { Program } from '../../../global/models/permissions/program.model';
import { AuthService } from '../../../global/services/auth/auth.service';
import { SideBarMenuComponent } from '../../../components/shared/side-bar-menu/side-bar-menu.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, FontAwesomeModule, SearchBarComponent, SideBarMenuComponent],
  templateUrl: './dashboard.component.html',
  styles: `:host {
    display: contents;
  }`
})
export class DashboardComponent implements OnInit {
  sampleData = {
    usersCount: 120,
    ordersCount: 45,
    revenue: 8000,
  };
  icons: { [key: string]: IconDefinition; } = {
    angry: faAngry,
    paw: faPaw,
  };
  loadingMenuItems: boolean = false;

  menuContent: { programGroup: ProgramGroup, programs: Program[]; }[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.loadingMenuItems = true;
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.authService.getUserById(user.uid).subscribe((user) => {
      this.permissionService.getMenuContent(user.role).subscribe((menuContent) => {
        this.menuContent = Object.values(menuContent);
        this.loadingMenuItems = false;
      });
    });
  };

  handleSignOut() {
    this.authService.signOut().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
