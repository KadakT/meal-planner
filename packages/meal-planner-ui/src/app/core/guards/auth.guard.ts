import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from '../services';
import { Store } from '@ngrx/store';
import { selectAccessToken } from 'app/features/auth/auth.selector';
import { AuthActions } from 'app/features/auth/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);

  canActivate(): Observable<boolean | UrlTree> {
    const accessToken = this.store.selectSignal(selectAccessToken)();

    console.log('AuthGuard: canActivate called. Access token:', accessToken);
    if (accessToken) {
      return of(true);
    }


    return this.authService.refreshToken().pipe(
      tap(() => console.log('AuthGuard: Refresh token request sent.')),
      map(({ user, accessToken }) => {
        this.store.dispatch(
          AuthActions.refreshTokenSuccess({ user, accessToken })
        );

        return true;
      }),

      catchError(() => {
        console.log('AuthGuard: Token refresh failed. Redirecting to login.');
        this.store.dispatch(AuthActions.logout());
        return of(this.router.createUrlTree(['/login']));
      })
    );
  }
}
