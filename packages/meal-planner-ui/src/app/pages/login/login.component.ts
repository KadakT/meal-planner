import { Component, inject, OnInit } from '@angular/core';
import { ApiError, AuthResponse, LoginPayload } from '@meal-planner/shared';
import { AuthService, StorageService } from 'app/core/services';
import { LoginFormComponent } from '@components/index';
import { ButtonsComponent } from "../../shared/components/buttons/buttons.component";
import { catchError, delay, EMPTY, filter, finalize, Subject, tap, throwError } from 'rxjs';
import { SessionKeys } from 'app/shared/definitions';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent, ButtonsComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
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
    // this.router.events.subscribe((e: any) =>{
    //   console.log(e);
    // })
  }

  createUser(credentials : LoginPayload){
    // this.authService.registerUser(credentials).subscribe({
    //   next: (res: AuthResponse) => this.handleSuccessfulLogin(res.token),
    //   error: (err: ApiError) => {
    //     this.errorMessage = err.message;
    //   }
    // });
  }

  login(credentials : LoginPayload){
    // this.authService.login(credentials).subscribe({
    //   next: (res: AuthResponse) => this.handleSuccessfulLogin(res.token),
    //   error: (err: ApiError) => {
    //     this.errorMessage = err.message;
    //   }
    // });
  }

  handleSuccessfulLogin(token: string){
      this.storageService.saveToStorage(SessionKeys.Token, token);
      delay(1000),
      this.router.navigate(['/dashboard']);
  }

  formSubmitted(credentials : LoginPayload){
    this.isLogin ? this.login(credentials) : this.createUser(credentials);
  }

  switchForm(isLogin: boolean){
    this.isLogin = isLogin;
  }
}
