import {
    HttpInterceptorFn,
    HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

export const globalHttpInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const notificationService = inject(NotificationService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let message = 'An unexpected error occurred. Please try again.';

            if (error.error && typeof error.error === 'object') {
                const { error: errorType, message: backendMessage, errors } = error.error;

                switch (errorType) {
                    case 'UserNotFoundException':
                        message = 'User not found.';
                        break;
                    case 'InvalidCredentialsException':
                        message = 'Invalid email or password.';
                        break;
                    case 'UserAlreadyExistsException':
                        message = 'An account with this email already exists.';
                        break;
                    case 'WeakPasswordException':
                        message = 'The provided password is too weak.';
                        break;
                    case 'InvalidEmailConfirmationException':
                        message = 'The email confirmation link is invalid or expired.';
                        break;
                    case 'UserOperationFailedException':
                        message = errors && Array.isArray(errors)
                            ? errors.join(', ')
                            : backendMessage || 'User operation failed.';
                        break;
                    default:
                        message = backendMessage || message;
                }
            }

            console.warn('Backend error:', error);

            notificationService.error(message);
            if (error.status === 401) {
                notificationService.error('Acceso no autorizado. Por favor, inicia sesión.');
                router.navigate(['/ingreso']);
            };

            return throwError(() => error);
        })
    );
};
