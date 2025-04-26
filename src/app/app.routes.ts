import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { RegisterUserPageComponent } from './user/pages/register-user-page/register-user-page.component';
import { ConfirmEmailPageComponent } from './user/pages/confirm-email-page/confirm-email-page.component';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    data: { animation: 'HomePage' },
  },
  {
    path: 'ingreso',
    component: LoginPageComponent,
    data: { animation: 'LoginPage' },
  },
  {
    path: 'registro',
    component: RegisterUserPageComponent,
    data: { animation: 'RegisterPage' },
  },
  {
    path: 'confirmar-correo',
    component: ConfirmEmailPageComponent,
    data: { animation: 'ConfirmEmailPage' },
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent,
      ),
    canMatch: [authGuard],
    children: [
      {
        path: 'cambiar-contraseña',
        loadComponent: () =>
          import(
            './user/pages/change-password-page/change-password-page.component'
          ).then((m) => m.ChangePasswordPageComponent),
        canMatch: [authGuard],
        data: { animation: 'ChangePasswordPage' },
      },
      {
        path: 'quienes-somos',
        loadComponent: () =>
          import(
            './shared/pages/about/about-us-page/about-us-page.component'
          ).then((m) => m.AboutUsPageComponent),
        data: { animation: 'AboutUsPage' },
      },
      {
        path: 'mision',
        loadComponent: () =>
          import(
            './shared/pages/about/mission-page/mission-page.component'
          ).then((m) => m.MissionPageComponent),
        data: { animation: 'MissionPage' },
      },
      {
        path: 'vision',
        loadComponent: () =>
          import('./shared/pages/about/vision-page/vision-page.component').then(
            (m) => m.VisionPageComponent,
          ),
        data: { animation: 'VisionPage' },
      },
      {
        path: 'transparencia',
        loadComponent: () =>
          import(
            './shared/pages/about/transparency-page/transparency-page.component'
          ).then((m) => m.TransparencyPageComponent),
        data: { animation: 'TransparencyPage' },
      },
      {
        path: 'button-showcase',
        loadComponent: () =>
          import(
            './shared/pages/about/button-showcase-page/button-showcase-page.component'
          ).then((m) => m.ButtonShowcasePageComponent),
        data: { animation: 'ButtonShowcasePage' },
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import(
            './shared/pages/notifications-testing-page/notifications-testing-page.component'
          ).then((m) => m.NotificationsTestingPageComponent),
        data: { animation: 'NotificationsTestingPage' },
      },
    ],
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    data: { animation: 'NotFoundPage' },
  },
];
