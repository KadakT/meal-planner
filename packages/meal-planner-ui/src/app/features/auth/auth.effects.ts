import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService, TokenService } from "app/core/services";
import { AuthActions } from "./auth.actions";
import { catchError, map, mergeMap, of, tap } from "rxjs";
import { User } from "./auth.model";
import { SessionKeys } from "app/shared/definitions";

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
          map(({ user, token }) => {
            return AuthActions.loginSuccess({ user, token, rememberMe });
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
        const stored = localStorage.getItem(SessionKeys.AuthData) || sessionStorage.getItem(SessionKeys.AuthData);
        if (!stored) return AuthActions.logout();
        const { user, token } = JSON.parse(stored);
        return AuthActions.autoLoginSuccess({ user, token });
      }),
      catchError(err =>
            of(AuthActions.loginFailure({ error: err?.message || 'Login failed' }))
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({user, token, rememberMe}) => this.authService.handleSuccessfulLogin(user, token, rememberMe))
      ),
      { dispatch : false}
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => this.authService.logout())
      ),
      { dispatch : false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerStart),
      mergeMap(({email, name, password, rememberMe}) =>
        this.authService.registerUser({ email, name, password, rememberMe }).pipe(
          map(({ user, token })=>
            AuthActions.registerSuccess({ user, token, rememberMe})
          ),
          catchError(err =>
            of(AuthActions.registerFailure({ error: err?.message || 'Register failed'}))
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
          tap(({ user, token, rememberMe }) =>  this.authService.handleSuccessfulLogin(user, token, rememberMe))
      ),
      { dispatch: false }
  );


}