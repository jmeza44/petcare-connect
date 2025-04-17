import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  success(message: string, title?: string): void {
    this.toastr.success(message, title ?? 'Éxito', {});
  }

  error(message: string, title?: string): void {
    this.toastr.error(message, title ?? 'Error');
  }

  info(message: string, title?: string): void {
    this.toastr.info(message, title ?? 'Información');
  }

  warning(message: string, title?: string): void {
    this.toastr.warning(message, title ?? 'Advertencia');
  }

  clear(): void {
    this.toastr.clear();
  }
}
