import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SHARED_DIRECTIVES } from 'app/shared/directives';
import { selectAuthError, selectAuthLoading } from '../../../features/auth/auth.selector';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ...SHARED_DIRECTIVES],
  templateUrl: './auth-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})

export class AuthFormComponent implements OnInit {
  isLogin = input<boolean>();
  @Input({ required: true }) mode: 'login' | 'register' = 'login';
  @Output() switchForm = new EventEmitter<void>();
  @Output() onSubmitCredentials = new EventEmitter<FormGroup>();

  private submited: boolean = false;
  private store = inject(Store);

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  authForm!: FormGroup;

  ngOnInit() {
    this.authForm =
      this.mode === 'register'
        ? new FormGroup({
          email: new FormControl('', [Validators.required, Validators.email]),
          name: new FormControl('', Validators.required),
          password: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/[A-Z]/),
          ]),
          rememberMe: new FormControl(false),
        })
        : new FormGroup({
          email: new FormControl('', [Validators.required, Validators.email]),
          password: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/[A-Z]/),
          ]),
          rememberMe: new FormControl(false),
        });
  }


  onSubmit() {
    this.submited = true;
    if (this.authForm.valid) {
      this.onSubmitCredentials.emit(this.authForm);
    }
  }

  get emailInvalid(): string | null {
    if (!this.submited) return null;
    const control = this.authForm.get('email');
    if (!control) return null;
    if (control?.errors?.['required']) return 'required';
    if (control?.errors?.['email']) return 'email';
    return null;
  }

  get nameRequired() {
    const control = this.authForm.get('name');
    return control?.hasError('required') && this.submited;
  }

  get passwordInvalid(): string | null {
    if (!this.submited) return null;
    const control = this.authForm.get('password');
    if (!control) return null;
    if (control?.errors?.['required']) return 'required';
    if (control?.errors?.['minlength']) return 'minlength';
    if (control?.errors?.['pattern']) return 'pattern';
    return null;
  }
}
