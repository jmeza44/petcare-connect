import { ErrorHandler, Injectable, Injector, isDevMode } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    if (isDevMode()) {
      console.error('Global error caught:', error);
    }
  }
}
