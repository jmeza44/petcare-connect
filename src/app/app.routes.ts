import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/main/home-page/home-page.component';
import { SignInPageComponent } from './pages/auth/sign-in-page/sign-in-page.component';
import { SignUpPageComponent } from './pages/auth/sign-up-page/sign-up-page.component';
import { DashboardComponent } from './pages/main/dashboard/dashboard.component';
import { NotFoundPageComponent } from './pages/global/not-found-page/not-found-page.component';
import { authGuard } from './global/guards/auth.guard';
import { AdoptablePetsPageComponent } from './pages/main/adoptable-pets-page/adoptable-pets-page.component';
import { VisionPageComponent } from './pages/about/vision-page/vision-page.component';
import { TransparencyPageComponent } from './pages/about/transparency-page/transparency-page.component';
import { AboutUsPageComponent } from './pages/about/about-us-page/about-us-page.component';
import { MissionPageComponent } from './pages/about/mission-page/mission-page.component';
import { CallToActionPageComponent } from './pages/about/call-to-action-page/call-to-action-page.component';

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
    children: [
      {
        path: '',
        component: CallToActionPageComponent,
      },
      {
        path: 'mascotas-adoptables',
        component: AdoptablePetsPageComponent,
      },
      {
        path: 'quienes-somos',
        component: AboutUsPageComponent,
      },
      {
        path: 'mision',
        component: MissionPageComponent,
      },
      {
        path: 'vision',
        component: VisionPageComponent,
      },
      {
        path: 'transparencia',
        component: TransparencyPageComponent,
      }
    ],
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  }
];
