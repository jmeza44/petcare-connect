import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../global/services/auth/auth.service';
import { ButtonComponent } from '../../../components/shared/button/button.component';
import { faHome } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './not-found-page.component.html',
  styles: ``
})
export class NotFoundPageComponent implements OnInit {
  isAuthenticated: boolean = false;
  homeIcon = faHome;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  navigate() {
    if (this.isAuthenticated) this.router.navigate(['/dashboard']);
    else this.router.navigate(['/']);
  }
}
