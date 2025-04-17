import { ErrorHandler, Injectable, Injector } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    // Example: log to console or send to backend
    console.error('Global error caught:', error);

    // Optionally, inject a toast or logging service:
    // const toast = this.injector.get(ToastService);
    // toast.showError('Something went wrong.');
  }
}
