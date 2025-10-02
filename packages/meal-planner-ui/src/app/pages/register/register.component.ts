import { Component, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthFormComponent, ButtonsComponent } from "@components/index";
import { ApiError, AuthResponse, LoginPayload } from "@meal-planner/shared";
import { AuthService, StorageService } from "app/core/services";

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [AuthFormComponent, ButtonsComponent],
    template: `
    <div class="login">
        <div class="login__container">
            <div class="login__welcome-container">
                <div class="login__welcome-text">
                    <div class="logo logo--big">
                          <img src="assets/svg/logo.svg" width="100" alt="Meal Planner Logo">
                          <h1>Meal Planner</h1>
                      </div>
                    <p></p>
                </div>
            </div>
            <div class="login__sign-in">
                    <p>{{ errorMessage }}</p>
                    <app-auth-form (onSubmitCredentials)="formSubmitted($event)">
                        <h2>Register</h2>
                        <app-buttons [btnClass]="'btn btn-primary'" [btnType]="'submit'">Register</app-buttons>
                    </app-auth-form>
                        <p>Already a user? <a (click)="switchForm()" tabindex="0">Sign In</a></p>
            </div>
        </div>
    </div>
           
    `
})

export class RegisterComponent {
    public errorMessage: string = '';

    private router = inject(Router);
    private authService = inject(AuthService);

    formSubmitted(event: FormGroup) {
        const { username, password }: LoginPayload = {
            username: event.get('username')?.value,
            password: event.get('password')?.value
        }
        const rememberMe = event.get('rememberMe')?.value || null;
        this.createUser({ username, password }, rememberMe);
    }

    switchForm() {
        this.router.navigate(['/login']);
    }

    createUser(credentials: LoginPayload, rememberMe: boolean = false) {
        this.authService.registerUser(credentials).subscribe({
            next: (res: AuthResponse) => this.authService.handleSuccessfulLogin(res.token, rememberMe),
            error: (err: ApiError) => {
                this.errorMessage = err.message;
            }
        });
    }
};