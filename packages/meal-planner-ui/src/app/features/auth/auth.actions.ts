import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { User } from "./auth.model";

export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        'Login Start': props<{ email: string; password: string, rememberMe: boolean }>(),
        'Login Success': props<{ user: User; accessToken: string; }>(),
        'Login Failure': props<{ error: string }>(),

        'Register Start': props<{ email: string; name: string, password: string, rememberMe: boolean }>(),
        'Register Success': props<{ user: User; accessToken: string; rememberMe: boolean }>(),
        'Register Failure': props<{ error: string }>(),

        'Auto Login': emptyProps(),
        'Auto Login Failure': emptyProps(),

        'Refresh Token Start': emptyProps(),
        'Refresh Token Success': props<{ user: User; accessToken: string }>(),
        'Refresh Token Failure': emptyProps(),

        'Logout': emptyProps(),

    }
});