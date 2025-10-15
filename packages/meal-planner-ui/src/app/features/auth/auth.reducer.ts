import { createReducer, on } from "@ngrx/store";
import { AuthState } from "./auth.model";
import { AuthActions } from "./auth.actions";

export const initialSate: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
}

export const authReducer = createReducer(
    initialSate,

    on(AuthActions.loginStart, AuthActions.registerStart, (state: any) => ({
        ...state,
        loading: true,
        error: null
    })),

    on( AuthActions.loginSuccess, AuthActions.registerSuccess, (state, {user, token}) =>({
        ...state,
        user,
        token,
        isAuthenticated: true,
        loading: false
    })),

    on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error } ) => ({
        ...state,
        error,
        loading: false
    })),

    on(AuthActions.logout, state => ({
        ...initialSate
    })),

    on( AuthActions.autoLoginSuccess ,( state, {user, token}) => ({
        ...state,
        user,
        token,
        isAuthenticated: true
    }))
)