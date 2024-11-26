import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/main/home-page/home-page.component';
import { SignInPageComponent } from './pages/auth/sign-in-page/sign-in-page.component';
import { SignUpPageComponent } from './pages/auth/sign-up-page/sign-up-page.component';
import { DashboardComponent } from './pages/main/dashboard/dashboard.component';
import { NotFoundPageComponent } from './pages/global/not-found-page/not-found-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'ingreso',
    component: SignInPageComponent,
  },
  {
    path: 'registro',
    component: SignUpPageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  }
];
