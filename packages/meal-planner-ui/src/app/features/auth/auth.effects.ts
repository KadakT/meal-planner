import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from "app/core/services";
import { AuthActions } from "./auth.actions";
import { catchError, exhaustMap, map, mergeMap, of, tap } from "rxjs";
import { User } from "./auth.model";

@Injectable()


export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  user: User = {
    name: 'Test Name',
    email: 'test@test.test',
    id: crypto.randomUUID()
  }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      mergeMap(({ email, password, rememberMe }) =>
        this.authService.login({ email, password, rememberMe }).pipe(
          map(({ user, accessToken }) => {
            return AuthActions.loginSuccess({ user, accessToken });
          }),
          catchError(err =>
            of(AuthActions.loginFailure({ error: err?.message || 'Login failed' }))
          )
        )
      )
    )
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const refreshToken = this.authService.getRefreshToken();

        if (!refreshToken) {
          return AuthActions.autoLoginFailure();
        }

        return AuthActions.refreshTokenStart();
      })
    )
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshTokenStart),
      exhaustMap(() =>
        this.authService.refreshToken().pipe(
          map(({ user, accessToken }) =>
            AuthActions.refreshTokenSuccess({ user, accessToken })
          ),
          catchError(() => of(AuthActions.refreshTokenFailure()))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.authService.handleSuccessfulLogin())
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout, AuthActions.refreshTokenFailure),
        tap(() => this.authService.logout())
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerStart),
      mergeMap(({ email, name, password, rememberMe }) =>
        this.authService.registerUser({ email, name, password, rememberMe }).pipe(
          map(({ user, accessToken }) =>
            AuthActions.registerSuccess({ user, accessToken, rememberMe })
          ),
          catchError(err =>
            of(AuthActions.registerFailure({ error: err?.message || 'Register failed' }))
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.authService.handleSuccessfulLogin( ))
      ),
    { dispatch: false }
  );


}