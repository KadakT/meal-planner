import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services';
import { selectAccessToken } from 'app/features/auth/auth.selector';
import { AuthActions } from 'app/features/auth/auth.actions';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const authService = inject(AuthService);
  let isRefreshing = false;

  const isAuthEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/refresh');

  if (isAuthEndpoint) {
    return next(req);
  }

  const accessToken = store.selectSignal(selectAccessToken)();

  const authReq = accessToken
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isRefreshing) {
        return throwError(() => error);
      }

      isRefreshing = true;

      return authService.refreshToken().pipe(
        switchMap(({ user, accessToken }) => {
          isRefreshing = false;

          store.dispatch(
            AuthActions.refreshTokenSuccess({ user, accessToken })
          );

          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          return next(retryReq);
        }),

        catchError((refreshError) => {
          isRefreshing = false;
          store.dispatch(AuthActions.logout());
          return throwError(() => refreshError);
        })
      );
    })
  );
};