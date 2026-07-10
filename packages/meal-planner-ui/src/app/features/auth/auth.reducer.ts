import { createReducer, on } from "@ngrx/store";
import { AuthState } from "./auth.model";
import { AuthActions } from "./auth.actions";

export const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null
}

export const authReducer = createReducer(
    initialState,

    on( AuthActions.loginStart, 
        AuthActions.registerStart,
        AuthActions.refreshTokenStart, 
        (state: any) => ({
        ...state,
        loading: true,
        error: null
    })),

    on( AuthActions.loginSuccess, 
        AuthActions.registerSuccess,
        AuthActions.refreshTokenSuccess,
            (state, {user, accessToken}) =>({
            ...state,
            user,
            accessToken,
            isAuthenticated: true,
            loading: false,
            error: null
    })),

    on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error } ) => ({
        ...state,
        error,
        loading: false
    })),

    on(AuthActions.autoLoginFailure, AuthActions.refreshTokenFailure, AuthActions.logout, () => ({
    ...initialState,
  }))
)