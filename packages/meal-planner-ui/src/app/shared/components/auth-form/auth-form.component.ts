import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonsComponent } from '@components/buttons/buttons.component';
import { LoginPayload } from '@meal-planner/shared';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonsComponent, CommonModule],
  templateUrl: './auth-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})

export class AuthFormComponent implements OnInit{
  isLogin = input<boolean>();

  @Output() switchForm = new EventEmitter<void>();
  @Output() onSubmitCredentials = new EventEmitter<FormGroup>();

  private submited: boolean = false;

  authForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    rememberMe: new FormControl('')
  });

  ngOnInit(): void {
    // console.log(this.loginForm);
  }
  onSubmit(){
    this.submited = true;

    if (this.authForm.valid){
        this.onSubmitCredentials.emit(this.authForm);
    }

    this.switchForm.emit();
  }

  get userNameRequired() {
    const control = this.authForm.get('username');
    return control?.hasError('required') && this.submited;
  }

  get passwordRequired() {
    const control = this.authForm.get('password');
    return control?.hasError('required') && this.submited;
  }

  get passwordMinLength() {
    const control = this.authForm.get('password');
    return control?.hasError('minLength') && this.submited;
  }
}
