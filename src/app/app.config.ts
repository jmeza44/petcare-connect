import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { GlobalErrorHandler } from './shared/services/global-error-handler.service';
import { globalHttpInterceptor } from './shared/interceptors/global-http.interceptor';
import { apiKeyInterceptor } from './shared/interceptors/api-key.interceptor';
import { authInterceptor } from './auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        apiKeyInterceptor,
        authInterceptor,
        globalHttpInterceptor,
      ]),
    ),
    provideRouter(routes),
    provideEnvironmentNgxMask(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideToastr({
      maxOpened: 5,
      autoDismiss: true,
      timeOut: 5000,
      progressBar: true,
    }),

    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
