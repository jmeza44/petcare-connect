import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { ErrorMappingService } from '../services/error-mapping.service';

export const globalHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const errorMappingService = inject(ErrorMappingService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Se produjo un error inesperado. Inténtalo de nuevo.';
      let notificationMethod = 'none';

      if (error.error && typeof error.error === 'object') {
        const { error: errorCode, message: backendMessage } = error.error;
        if (
          errorCode === 'VALIDATION_EXCEPTION' &&
          Array.isArray(backendMessage)
        ) {
          // Format the list of validation errors
          const formatted = backendMessage
            .map(
              (entry: { field: string; error: string }) =>
                `${entry.field}: ${entry.error}`,
            )
            .join('\n');

          message = `Se encontraron errores en el formulario:\n${formatted}`;
        } else {
          // Fall back to mapped error or backend message
          message =
            errorMappingService.getMessage(errorCode) ||
            backendMessage ||
            message;
        }
      }

      // Set the appropriate notification method and message based on status code
      notificationMethod = errorMappingService.getNotificationMethod(
        error.status,
      );

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
          notificationService.info(message);
          break;
        case 'warning':
          notificationService.warning(message);
          break;
        default:
          notificationService.error(message);
          break;
      }

      return throwError(() => error);
    }),
  );
};
