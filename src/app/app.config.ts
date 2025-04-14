import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { GlobalErrorHandler } from './shared/services/global-error-handler.service';
import { GlobalHttpInterceptor } from './shared/interceptors/global-http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideToastr({ maxOpened: 5, autoDismiss: true, timeOut: 5000 }),
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    provideEnvironmentNgxMask(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptor, multi: true }
  ]
};
