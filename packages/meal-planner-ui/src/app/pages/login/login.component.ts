import { Component, inject } from '@angular/core';
import { LoginPayload } from '@meal-planner/shared';
import { AuthFormComponent } from '@components/index';
import { ButtonsComponent } from "../../shared/ui/button/buttons.component";
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from 'app/features/auth/auth.actions';
import { ButtonVariant } from 'app/shared/constants/ui/button.constants';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthFormComponent, ButtonsComponent, TranslateModule ],
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
                  <app-auth-form [mode]="'login'" (onSubmitCredentials)="formSubmitted($event)">
                      <h2>{{ 'PAGES.AUTH.LOGIN.TITLE' | translate }}</h2>
                      <app-button [btnVariant]="ButtonVariant.Primary" [btnType]="'submit'" [btnClass]="'w-full'">{{ 'PAGES.AUTH.LOGIN.TITLE' | translate }}</app-button>
                  </app-auth-form>
                      <p>{{ 'PAGES.AUTH.LOGIN.TITLE_NEW' | translate }} <a (click)="switchForm()"  tabindex="0">{{ 'PAGES.AUTH.LOGIN.ADD_NEW' | translate }}</a></p>
          </div>
        </div>
      </div>
    `
})


export class LoginComponent {
  public isLogin: boolean = true;
  public loading: boolean = false;
  public errorMessage: string = '';

  protected readonly ButtonVariant = ButtonVariant;

  private router = inject(Router);
  private store = inject(Store);


  formSubmitted(event : FormGroup){
   const {email, password, rememberMe}: LoginPayload = {
    email: event.get('email')?.value,
    password: event.get('password')?.value,
    rememberMe: event.get('rememberMe')?.value || false
   }
   this.login({email, password, rememberMe}, );
  }

  login(credentials : LoginPayload, rememberMe: boolean = false){
    event?.preventDefault();
    this.store.dispatch(AuthActions.loginStart({email: credentials.email, password: credentials.password, rememberMe}));
  }

  switchForm(){
    this.router.navigate(['/register']);
  }
}
