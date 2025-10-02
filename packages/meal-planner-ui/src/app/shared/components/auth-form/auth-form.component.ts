import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SHARED_DIRECTIVES } from 'app/shared/directives';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ...SHARED_DIRECTIVES],
  templateUrl: './auth-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})

export class AuthFormComponent {
  isLogin = input<boolean>();

  @Output() switchForm = new EventEmitter<void>();
  @Output() onSubmitCredentials = new EventEmitter<FormGroup>();

  private submited: boolean = false;

  authForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8),  Validators.pattern(/[A-Z]/)]),
    rememberMe: new FormControl(false)
  });


  onSubmit(){
    this.submited = true;

    if (this.authForm.valid){
        this.onSubmitCredentials.emit(this.authForm);
    }
  }

  get userNameRequired() {
    const control = this.authForm.get('username');
    return control?.hasError('required') && this.submited;
  }

  get passwordInvalid(): string | null{
    if (!this.submited) return null;
    const control = this.authForm.get('password');
    console.log(control);
    if (!control ) return null;
    console.log(control);
    if(control?.errors?.['required'] ) return 'required';
    if(control?.errors?.['minlength'] ) return 'minlength';
    if(control?.errors?.['pattern'] ) return 'pattern';
    return 'unknown'
  }
}
