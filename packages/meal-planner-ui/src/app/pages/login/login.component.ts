import { Component, inject } from '@angular/core';
import { ApiError, AuthResponse, LoginPayload } from '@meal-planner/shared';
import { AuthService } from 'app/core/services';
import { AuthFormComponent } from '@components/index';
import { ButtonsComponent } from "../../shared/components/buttons/buttons.component";
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthFormComponent, ButtonsComponent ],
  template: `
    <div class="login">
        <div class="login__container">
          <div class="login__welcome-container">
                  <div class="login__welcome-text">
                      <div class="logo logo--big">
                          <img src="assets/svg/logo.svg" width="100" alt="Meal Planner Logo">
                          <h1>Meal Planner</h1>
                      </div>                      
                  </div>
          </div>
          <div class="login__sign-in">
                  <p>{{ errorMessage }}</p>
                  <app-auth-form [isLogin]="isLogin" (onSubmitCredentials)="formSubmitted($event)">
                      <h2>Member Login</h2>
                      <app-buttons [btnClass]="'btn btn-primary'" [btnType]="'submit'">Login</app-buttons>
                  </app-auth-form>
                      <p>New Here? <a (click)="switchForm()"  tabindex="0">Create an Account</a></p>
          </div>
        </div>
      </div>
    `
})


export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public isLogin: boolean = true;
  public loading: boolean = false;
  public errorMessage: string = '';

  formSubmitted(event : FormGroup){
   const {username, password}: LoginPayload = {
    username: event.get('username')?.value,
    password: event.get('password')?.value
   }
   const rememberMe = event.get('rememberMe')?.value || null;
   this.login({username, password}, rememberMe);
  }

  login(credentials : LoginPayload, rememberMe: boolean = false){
    this.authService.login(credentials).subscribe({
      next: (res: AuthResponse) => this.authService.handleSuccessfulLogin(res.token, rememberMe),
      error: (err: ApiError) => {
        this.errorMessage = err.message;
      }
    });
  }

  switchForm(){
    this.router.navigate(['/register']);
  }
}
