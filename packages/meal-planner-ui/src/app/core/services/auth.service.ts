import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { BehaviorSubject, catchError, delay, finalize, Observable, throwError } from 'rxjs';
import { ApiError, LoginPayload, RegisterPayload } from '@meal-planner/shared';
import { LoadingService } from './loading.service';
import { SessionKeys, TOKEN_TTL } from 'app/shared/definitions';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { AuthResponse, RefreshResponse, User } from 'app/features/auth/auth.model';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = environment.apiUrl;
  private loadingService = inject(LoadingService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private loggedIn = new BehaviorSubject<boolean>(false);
  private readonly cookieService = inject(CookieService);
  private readonly refreshTokenKey = 'refresh_token';


  login(credentials: LoginPayload): Observable<AuthResponse> {
    this.loadingService.setLoading(true);
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials, { withCredentials: true }).pipe(
      catchError(this.handleError),
      finalize(() => {
        this.loadingService.setLoading(false);
      })
    );
  }

  testConnection() {
    return this.http.get(`${environment.apiUrl}/test`);
  }

  registerUser(userData: RegisterPayload): Observable<AuthResponse> {
    this.loadingService.setLoading(true);
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData, { withCredentials: true }).pipe(
      catchError(this.handleError),
      finalize(() => {
        this.loadingService.setLoading(false);
      })
    );
  }

  refreshToken(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(
      `${environment.apiUrl}/auth/refresh`,
        {},
    { withCredentials: true }
    );
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }

  handleSuccessfulLogin(): void {
    delay(1000),
      this.router.navigate(['/overview']);
  }

  getRefreshToken(): string | null {
    return this.cookieService.get(this.refreshTokenKey) || null;
  }

  private handleError(error: HttpErrorResponse) {
    const apiError: ApiError = {
      code: error.error?.errorCode || 'UNKNOWN_ERROR',
      message: error.error?.message || 'Unexpected error occurred',
    }
    return throwError(() => apiError);
  }

  logout() {
    localStorage.removeItem(SessionKeys.AuthData);
    sessionStorage.removeItem(SessionKeys.AuthData);
    this.router.navigate(['/login']);
    this.loggedIn.next(false);
  }
}
