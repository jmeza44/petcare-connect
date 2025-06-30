import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/auth`;
  private tokenKey = 'auth_token';
  private isLoggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) {
    const hasToken = !!this.localStorageService.getItem(this.tokenKey);
    this.isLoggedInSubject = new BehaviorSubject<boolean>(hasToken);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.localStorageService.setItem(this.tokenKey, response.token);
          this.isLoggedInSubject.next(true);
        }),
      );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/logout`, {})
      .pipe(tap(() => this.removeToken()));
  }

  getToken(): string | null {
    return this.localStorageService.getItem(this.tokenKey);
  }

  removeToken() {
    this.localStorageService.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    const token = this.localStorageService.getItem(this.tokenKey);
    if (!token || token === 'undefined') return false;
    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch {
      return true;
    }
  }
}
