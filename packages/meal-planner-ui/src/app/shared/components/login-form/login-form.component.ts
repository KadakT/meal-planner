import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonsComponent } from '@components/buttons/buttons.component';
import { LoginPayload } from '@meal-planner/shared';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ ReactiveFormsModule, ButtonsComponent ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})

export class LoginFormComponent implements OnInit{
  isLogin = input<boolean>();
  @Output() switchForm = new EventEmitter<void>();
  @Output() onSubmitCredentials = new EventEmitter<LoginPayload>();

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl('')
  });

  ngOnInit(): void {
    // console.log(this.loginForm);
  }
  onSubmit(){
        console.log(this.loginForm);
    this.onSubmitCredentials.emit(this.loginForm.value as LoginPayload);

    //this.switchForm.emit();
  }
}
