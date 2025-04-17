import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found-page.component.html',
  styles: ``,
})
export class NotFoundPageComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  navigate() {
    if (this.isAuthenticated) this.router.navigate(['/dashboard']);
    else this.router.navigate(['/']);
  }
}
