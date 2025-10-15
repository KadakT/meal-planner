import { LoginPayload } from "@meal-planner/shared";
import { createActionGroup, props } from "@ngrx/store";
import { User } from "./auth.model";

export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        'Login Start': props<{ email: string; password: string, rememberMe: boolean }>(),
        'Login Success': props< {user: User; token: string, rememberMe: boolean}>(),
        'Login Failure': props<{error : string}>(),
        'Logout': props<any>(), // Type 'void' does not satisfy the constraint 'never'
        'Auto Login': props<any>(), 
        'Auto Login Success': props<{ user: User; token: string}>(),
        'Register Start': props<{ email: string; name: string, password: string, rememberMe: boolean }>(),
        'Register Success': props<{ user: User; token: string, rememberMe: boolean }>(),
        'Register Failure': props<{ error: string }>(),
    }
});