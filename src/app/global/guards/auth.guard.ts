import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { LocalStorageService } from '../services/global/local-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  // Import the necessary services
  const authService = inject(AuthService);
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);

  // Check if the user is authenticated
  return authService.isAuthenticatedAsync().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      } else {
        localStorageService.setItem('redirectUrl', router.url);
        router.navigate(['/ingreso']);
        return false;
      }
    }),
    catchError((error) => {
      console.error('Error in authGuard:', error);
      router.navigate(['/ingreso']);
      return [false];
    })
  );
};
