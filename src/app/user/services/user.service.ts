import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ChangePasswordRequest,
  ConfirmEmailRequest,
  ForgotPasswordRequest,
  RegisterUserRequest,
  ResetPasswordRequest,
} from '../models';
import { ResendConfirmationEmail } from '../models/resend-confirmation-email';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.apiBaseUrl}/user`;

  constructor(private http: HttpClient) {}

  register(data: RegisterUserRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/register`,
      data,
    );
  }

  confirmEmail(data: ConfirmEmailRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/confirm-email`,
      data,
    );
  }

  resendConfirmationEmail(
    data: ResendConfirmationEmail,
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/resend-confirmation-email`,
      data,
    );
  }

  changePassword(data: ChangePasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/change-password`,
      data,
    );
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/forgot-password`,
      data,
    );
  }

  resetPassword(data: ResetPasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/reset-password`,
      data,
    );
  }

  getUserProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/${userId}/profile`);
  }

  getUserProfiles(userIds: string[]): Observable<UserProfile[]> {
    return this.http.post<UserProfile[]>(`${this.baseUrl}/profiles`, { userIds });
  }
}
