import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { BehaviorSubject, catchError, delay, finalize, Observable, throwError } from 'rxjs';
import { ApiError, AuthResponse, LoginPayload } from '@meal-planner/shared';
import { LoadingService } from './loading.service';
import { SessionKeys, TOKEN_TTL } from 'app/shared/definitions';
import { TokenService } from './token.service';
import { Router } from '@angular/router';


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

  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(){
    const token = this.tokenService.getToken();
    if (token){
      this.loggedIn.next(true);
    }
  }

  login(credentials: LoginPayload): Observable<AuthResponse> {
    this.loadingService.setLoading(true);
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      catchError(this.handleError),
      finalize(() => {
        this.loadingService.setLoading(false);
      })
    );
  }

  testConnection() {
    return this.http.get(`${environment.apiUrl}/test`);
  }

  registerUser(userData: LoginPayload): Observable<AuthResponse> {
    this.loadingService.setLoading(true);
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData).pipe(
      catchError(this.handleError),
      finalize(() => {
        this.loadingService.setLoading(false);
      })
    );
  }
  
  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }

  handleSuccessfulLogin(token: string, rememberMe: boolean) : void{
    this.tokenService.storeTokenWithExpiry(token, rememberMe, TOKEN_TTL.REMEMBER_ME);
    delay(1000),
    this.router.navigate(['/dashboard']);
    this.loggedIn.next(true);
  }

  private handleError(error: HttpErrorResponse) {
    const apiError: ApiError = {
      code: error.error?.errorCode || 'UNKNOWN_ERROR',
      message: error.error?.message || 'Unexpected error occurred',
    }
    return throwError(() => apiError);
  }

  logout(){
        localStorage.removeItem(SessionKeys.Token);
        sessionStorage.removeItem(SessionKeys.Token);
        this.router.navigate(['/login']);
        this.loggedIn.next(false);
  }
}
