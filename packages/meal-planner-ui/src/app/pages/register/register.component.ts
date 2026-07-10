import { Component, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthFormComponent, ButtonsComponent } from "@components/index";
import { RegisterPayload } from "@meal-planner/shared";
import { Store } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import { AuthActions } from "app/features/auth/auth.actions";
import { ButtonVariant } from "app/shared/constants/ui/button.constants";

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [AuthFormComponent, ButtonsComponent, TranslateModule],
    template: `
    <div class="login">
        <div class="login__container">
            <div class="login__welcome-container">
                <div class="login__welcome-text">
                    <div class="logo logo--big">
                          <img src="assets/svg/logo.svg" width="100" alt="Meal Planner Logo">
                          <h1>{{ 'PAGES.AUTH.TITLE' | translate }}</h1>
                      </div>
                </div>
            </div>
            <div class="login__sign-in">
                    <p>{{ errorMessage }}</p>
                    <app-auth-form [mode]="'register'" (onSubmitCredentials)="formSubmitted($event)">
                        <h2>{{ 'PAGES.AUTH.REGISTER.TITLE' | translate }}</h2>
                        <app-button [btnVariant]="ButtonVariant.Primary" [btnClass]="'w-full'" [btnType]="'submit'">{{ 'PAGES.AUTH.REGISTER.TITLE' | translate }}</app-button>
                    </app-auth-form>
                        <p>{{ 'PAGES.AUTH.REGISTER.TITLE_EXISTING' | translate }} <a (click)="switchForm()" tabindex="0">{{ 'PAGES.AUTH.REGISTER.LOGIN_LINK' | translate }}</a></p>
            </div>
        </div>
    </div>
           
    `
})

export class RegisterComponent {
    public errorMessage: string = '';

    protected readonly ButtonVariant = ButtonVariant;

    private router = inject(Router);
    private store = inject(Store);

    formSubmitted(event: FormGroup) {
        const { email, name, password, rememberMe } = {
            email: event.get('email')?.value,
            name: event.get('name')?.value,
            password: event.get('password')?.value,
            rememberMe: event.get('rememberMe')?.value || false
        }
        this.createUser({ email, password, name, rememberMe });
    }

    switchForm() {
        this.router.navigate(['/login']);
    }

    createUser(credentials: RegisterPayload) {
        this.store.dispatch(AuthActions.registerStart(credentials))
    }
};