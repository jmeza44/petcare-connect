import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { NotificationService } from '../../shared/services/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const localStorageService = inject(LocalStorageService);
  const notificationService = inject(NotificationService);

  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return true;
  } else {
    localStorageService.setItem('redirectUrl', state.url); // use state.url instead of router.url
    notificationService.warning('Debes iniciar sesión para acceder a esta sección.', 'Acceso restringido');
    router.navigate(['/ingreso']);
    return false;
  }
};
