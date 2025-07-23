import { Injectable, inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from './auth.service';
import { CustomJwtPayload } from '../models/custom-jwt-payload.model';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  private readonly authService = inject(AuthService);

  /**
   * Gets the current user's ID from the JWT token
   * @returns User ID string or null if not authenticated or token is invalid
   */
  getCurrentUserId(): string | null {
    const token = this.authService.getToken();

    if (!token) {
      return null;
    }

    try {
      const decoded: CustomJwtPayload = jwtDecode(token);

      // Try different common JWT claims for user ID, prioritizing Microsoft Identity format
      return (
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ] ||
        decoded.sub ||
        decoded.nameid ||
        decoded.userId ||
        null
      );
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  /**
   * Gets the current user's email from the JWT token
   * @returns User email string or null if not available
   */
  getCurrentUserEmail(): string | null {
    const token = this.authService.getToken();

    if (!token) {
      return null;
    }

    try {
      const decoded: CustomJwtPayload = jwtDecode(token);
      return (
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ] ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        null
      );
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  /**
   * Gets the current user's role from the JWT token
   * @returns User role string or null if not available
   */
  getCurrentUserRole(): string | null {
    const token = this.authService.getToken();

    if (!token) {
      return null;
    }

    try {
      const decoded: CustomJwtPayload = jwtDecode(token);
      return (
        decoded[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] || null
      );
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  /**
   * Gets the current user's name from the JWT token
   * @returns User name string or null if not available
   */
  getCurrentUserName(): string | null {
    const token = this.authService.getToken();

    if (!token) {
      return null;
    }

    try {
      const decoded: CustomJwtPayload = jwtDecode(token);
      return (
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        null
      );
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  /**
   * Checks if the current user is authenticated
   * @returns True if user is authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
