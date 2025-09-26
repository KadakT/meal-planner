import { Component, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthFormComponent, ButtonsComponent  } from "@components/index";

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ AuthFormComponent, ButtonsComponent ],
    template: `
            <div class="login__container">
            <div class="login__welcome-container">
                <div class="login__welcome-text">
                    <h2>Create Account</h2>
                    <p></p>
                </div>
            </div>
            <div class="login__sign-in">
                <p>' errorMessage '</p>
                <app-auth-form (onSubmitCredentials)="formSubmitted($event)">
                    <h1>MEMBER LOGIN</h1>
                    <app-buttons [btnClass]="'btn-primary'" [btnType]="'submit'">REGISTER</app-buttons>
                </app-auth-form>
                    <p>Already a user? <a (click)="switchForm()" tabindex="0">Sign In</a></p>
            </div>
        </div>
    `
})

export class RegisterComponent{
     private router = inject(Router);
     
    formSubmitted(event: FormGroup){

    }

    switchForm(){
        this.router.navigate(['/login']);
    }

};