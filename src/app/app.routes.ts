import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'ingreso',
    component: LoginPageComponent,
  },
  {
    path: 'registro',
    loadComponent: () => import('./user/pages/register-user-page/register-user-page.component').then(m => m.RegisterUserPageComponent),
  },
  {
    path: 'confirmar-correo',
    loadComponent: () => import('./user/pages/confirm-email-page/confirm-email-page.component').then(m => m.ConfirmEmailPageComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/pages/dashboard-page/dashboard-page.component').then(
        m => m.DashboardPageComponent
      ),
    canActivate: [authGuard],
    children: [],
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  }
];
