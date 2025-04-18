import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { authGuard } from './auth/guards/auth.guard';
import { AboutUsPageComponent } from './shared/pages/about/about-us-page/about-us-page.component';
import { MissionPageComponent } from './shared/pages/about/mission-page/mission-page.component';
import { VisionPageComponent } from './shared/pages/about/vision-page/vision-page.component';
import { TransparencyPageComponent } from './shared/pages/about/transparency-page/transparency-page.component';
import { ButtonShowcasePageComponent } from './shared/pages/about/button-showcase-page/button-showcase-page.component';
import { RegisterUserPageComponent } from './user/pages/register-user-page/register-user-page.component';
import { ConfirmEmailPageComponent } from './user/pages/confirm-email-page/confirm-email-page.component';
import { NotificationsTestingPageComponent } from './shared/pages/notifications-testing-page/notifications-testing-page.component';

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
    canActivate: [authGuard],
    children: [
      {
        path: 'quienes-somos',
        component: AboutUsPageComponent,
        data: { animation: 'AboutUsPage' },
      },
      {
        path: 'mision',
        component: MissionPageComponent,
        data: { animation: 'MissionPage' },
      },
      {
        path: 'vision',
        component: VisionPageComponent,
        data: { animation: 'VisionPage' },
      },
      {
        path: 'transparencia',
        component: TransparencyPageComponent,
        data: { animation: 'TransparencyPage' },
      },
      {
        path: 'button-showcase',
        component: ButtonShowcasePageComponent,
        data: { animation: 'ButtonShowcasePage' },
      },
      {
        path: 'notifications',
        component: NotificationsTestingPageComponent,
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
