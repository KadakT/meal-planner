import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { ApiError, AuthResponse, LoginPayload } from '@meal-planner/shared';
import { LoadingService } from './loading.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loadingService = inject(LoadingService)

  constructor(private http: HttpClient) { }

  // login(credentials: LoginPayload): Observable<AuthResponse> {
  //   this.loadingService.setLoading(true);
  //   return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
  //     catchError(this.handleError),
  //     finalize(() => {
  //       this.loadingService.setLoading(false);
  //     })
  //   );
  // }

  testConnection() {
    return this.http.get(`${environment.apiUrl}/test`);
  }

  // registerUser(userData: LoginPayload): Observable<AuthResponse> {
  //   this.loadingService.setLoading(true);
  //   return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData).pipe(
  //     catchError(this.handleError),
  //     finalize(() => {
  //       this.loadingService.setLoading(false);
  //     })
  //   );
  // }

  // getProfile(token: string): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}/profile`, {
  //     headers: { Authorization: `Bearer ${token}` }
  //   });
  // }

  private handleError(error: HttpErrorResponse) {
    const apiError: ApiError = {
      code: error.error?.errorCode || 'UNKNOWN_ERROR',
      message: error.error?.message || 'Unexpected error occurred',
    }
    return throwError(() => apiError);
  }
}
