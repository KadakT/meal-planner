import { Component, inject, OnInit } from '@angular/core';
import { ApiError, AuthResponse, LoginPayload } from '@meal-planner/shared';
import { AuthService, StorageService } from 'app/core/services';
import { AuthFormComponent } from '@components/index';
import { ButtonsComponent } from "../../shared/components/buttons/buttons.component";
import { catchError, delay, EMPTY, filter, finalize, Subject, tap, throwError } from 'rxjs';
import { SessionKeys } from 'app/shared/definitions';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthFormComponent, ButtonsComponent ],
  template: `
            <div class="login__container">
              <div class="login__welcome-container">
                  <div class="login__welcome-text">
                      <h2>Create Account</h2>
                      <p></p>
                  </div>
              </div>
              <div class="login__sign-in">
                  <p>{{ errorMessage }}</p>
                  <app-auth-form [isLogin]="isLogin" (onSubmitCredentials)="formSubmitted($event)">
                      <h1>MEMBER LOGIN</h1>
                      <app-buttons [btnClass]="'btn-secondary'" [btnType]="'submit'">LOGIN</app-buttons>
                  </app-auth-form>
                      <p>New Here? <a (click)="switchForm()"  tabindex="0">Create an Account</a></p>
              </div>
        </div>
    `
})


export class LoginComponent implements OnInit{
  private storageService = inject(StorageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  public isLogin: boolean = true;
  public loading: boolean = false;
  public errorMessage: string = '';

  ngOnInit(): void {
    this.router.events.subscribe((e: any) =>{
      console.log(e);
    })
  }

  createUser(credentials : LoginPayload){
    this.authService.registerUser(credentials).subscribe({
      next: (res: AuthResponse) => this.handleSuccessfulLogin(res.token),
      error: (err: ApiError) => {
        this.errorMessage = err.message;
      }
    });
  }

  login(credentials : LoginPayload){
    this.authService.login(credentials).subscribe({
      next: (res: AuthResponse) => this.handleSuccessfulLogin(res.token),
      error: (err: ApiError) => {
        this.errorMessage = err.message;
      }
    });
  }

  handleSuccessfulLogin(token: string){
      this.storageService.saveToStorage(SessionKeys.Token, token);
      delay(1000),
      this.router.navigate(['/dashboard']);
  }

  formSubmitted(credentials : FormGroup){
    // this.isLogin ? this.login(credentials) : this.createUser(credentials);
  }

  switchForm(){
    this.router.navigate(['/register']);
  }
}
