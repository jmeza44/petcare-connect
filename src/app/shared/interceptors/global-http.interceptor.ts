import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { ErrorMappingService } from '../services/error-mapping.service';
import { AuthService } from '../../auth/services/auth.service';

export const globalHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const errorMappingService = inject(ErrorMappingService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred. Please try again.';
      let notificationMethod = 'none';

      if (error.error && typeof error.error === 'object') {
        const { error: errorCode, message: backendMessage } = error.error;
        message =
          errorMappingService.getMessage(errorCode) ||
          backendMessage ||
          message;
      }

      // Set the appropriate notification method and message based on status code
      switch (error.status) {
        case 400: // Bad Request
          notificationMethod = 'warning';
          break;
        case 401: // Unauthorized
          notificationMethod = 'warning';
          break;
        case 403: // Forbidden
          notificationMethod = 'error';
          break;
        case 404: // Not Found
          notificationMethod = 'warning';
          break;
        case 409: // Conflict
          notificationMethod = 'error';
          break;
        case 500: // Internal Server Error
          notificationMethod = 'error';
          break;
        default:
          notificationMethod = 'error';
          break;
      }

      console.warn('Backend error:', error.message);

      // Notify the user using the appropriate method based on status code
      switch (notificationMethod) {
        case 'success':
          notificationService.success(message);
          break;
        case 'error':
          notificationService.error(message);
          break;
        case 'info':
          notificationService.info(
            message || 'Acceso no autorizado. Por favor, inicia sesión.',
          );
          router.navigate(['/ingreso']);
          break;
        case 'warning':
          notificationService.warning(message);
          if (error.status === 401) {
            authService.removeToken();
            router.navigate(['/ingreso']);
          }
          break;
        default:
          notificationService.error(message);
          break;
      }

      return throwError(() => error);
    }),
  );
};
