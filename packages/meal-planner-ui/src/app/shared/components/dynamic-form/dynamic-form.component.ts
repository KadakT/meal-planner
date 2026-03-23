import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormField } from '../../../core/models/form-field.interface';
import { FormConfig, FormSubmissionResult } from 'app/core/models/form-config.interface';
import { DynamicFormBuilderService } from 'app/core/services';
import { FormFieldComponent } from '@components/form-field/form-field.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" [class]="formConfig()?.layout || 'vertical'">
      
      <!-- Form Header -->
      @if (formConfig()?.title || formConfig()?.description) {
        <div class="form-header">
          @if (formConfig()?.title) {
            <h2 class="form-title">{{ formConfig()?.title }}</h2>
          }
          @if (formConfig()?.description) {
            <p class="form-description">{{ formConfig()?.description }}</p>
          }
        </div>
      }
      <!-- Form Fields -->
      <div class="form-fields" [ngClass]="getFieldsContainerClass()">
        @for (field of visibleFields(); track field.key) {
          <div class="form-field-wrapper" [ngClass]="field.className">
            <app-form-field
              [field]="field"
              [control]="getFormControl(field.key)"
              [errorMessage]="getFieldError(field)"
              (valueChange)="onFieldValueChange($event)">
            </app-form-field>
          </div>
        }
      </div>
      <!-- Form Actions -->
      <div class="form-actions">
        @if (formConfig()?.showReset) {
          <button 
            type="button" 
            class="btn btn-secondary" 
            (click)="onReset()">
            {{ formConfig()?.resetButtonText || 'Reset' }}
          </button>
        }
        
        <button 
          type="submit" 
          class="btn btn-primary"
          [disabled]="!form.valid || isSubmitting()">
          @if (isSubmitting()) {
            <span class="spinner"></span>
          }
          {{ formConfig()?.submitButtonText || 'Submit' }}
        </button>
      </div>
      <!-- Form Errors -->
      @if (formErrors().length > 0) {
        <div class="form-errors">
          @for (error of formErrors(); track error) {
            <div class="error-message">{{ error }}</div>
          }
        </div>
      }
    </form>
  `,
  styles: [`
    .form-header {
      margin-bottom: 1.5rem;
    }
    .form-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #1f2937;
    }
    .form-description {
      color: #6b7280;
      margin-bottom: 0;
    }
    .form-fields {
      margin-bottom: 1.5rem;
    }
    .form-fields.grid {
      display: grid;
      gap: 1rem;
    }
    .form-fields.horizontal .form-field-wrapper {
      display: inline-block;
      margin-right: 1rem;
    }
    .form-field-wrapper {
      margin-bottom: 1rem;
    }
    .form-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }
    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-secondary {
      background-color: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }
    .btn-secondary:hover {
      background-color: #e5e7eb;
    }
    .spinner {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 2px solid #ffffff;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s ease-in-out infinite;
      margin-right: 0.5rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .form-errors {
      margin-top: 1rem;
      padding: 0.75rem;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 0.375rem;
    }
    .error-message {
      color: #dc2626;
      font-size: 0.875rem;
    }
  `]
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @Input() config!: FormConfig;
  @Output() formSubmit = new EventEmitter<FormSubmissionResult>();
  @Output() formChange = new EventEmitter<any>();
  // Angular 19 Signals for reactive state management
  formConfig = signal<FormConfig | null>(null);
  isSubmitting = signal<boolean>(false);
  formErrors = signal<string[]>([]);
  
  form!: FormGroup;
  private destroy$ = new Subject<void>();
  // Computed signal for visible fields
  visibleFields = computed(() => {
    const config = this.formConfig();
    if (!config) return [];
    
    return config.fields.filter(field => {
      if (field.hidden) return false;
      
      // Handle conditional visibility
      if (field.dependsOn && field.dependsOnValue !== undefined) {
        const dependentControl = this.form?.get(field.dependsOn);
        return dependentControl?.value === field.dependsOnValue;
      }
      
      return true;
    });
  });
  constructor(private formBuilder: DynamicFormBuilderService) {}
  ngOnInit(): void {
    try {
      this.initializeForm();
      this.setupFormSubscriptions();
    } catch (error) {
      console.error('Error initializing dynamic form:', error);
      this.formErrors.set(['Failed to initialize form. Please check the configuration.']);
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private initializeForm(): void {
    if (!this.config) {
      throw new Error('Form configuration is required');
    }
    this.formConfig.set(this.config);
    this.form = this.formBuilder.createForm(this.config);
  }
  private setupFormSubscriptions(): void {
    // Listen to form value changes for conditional field updates
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.formBuilder.updateFieldVisibility(this.form, this.config.fields);
        this.formChange.emit(value);
        
        // Clear form-level errors when user starts fixing issues
        if (this.formErrors().length > 0 && this.form.valid) {
          this.formErrors.set([]);
        }
      });
  }
  onSubmit(): void {
    if (this.isSubmitting()) return;
    this.markAllFieldsAsTouched();
    
    if (this.form.valid) {
      this.isSubmitting.set(true);
      
      const result: FormSubmissionResult = {
        valid: true,
        data: this.form.value
      };
      // Simulate async operation
      setTimeout(() => {
        this.formSubmit.emit(result);
        this.isSubmitting.set(false);
      }, 500);
    } else {
      const result: FormSubmissionResult = {
        valid: false,
        data: this.form.value,
        errors: this.collectFormErrors()
      };
      this.formSubmit.emit(result);
      this.formErrors.set(['Please correct the errors below']);
    }
  }
  onReset(): void {
    this.form.reset();
    this.formErrors.set([]);
    
    // Reset to initial values
    this.config.fields.forEach(field => {
      const control = this.form.get(field.key);
      if (control) {
        control.setValue(field.value || null);
      }
    });
  }
  onFieldValueChange(event: { field: string; value: any }): void {
    // Handle any specific field value change logic here
    console.log('Field changed:', event);
  }
  getFormControl(fieldKey: string): FormControl  {
    return this.form.get(fieldKey) as FormControl;
  }
  getFieldError(field: FormField): string {
    const control = this.form.get(field.key);
    if (!control || !control.errors || !control.touched) return '';
    
    return this.formBuilder.getValidationError(field, control);
  }
  getFieldsContainerClass(): string {
    const config = this.formConfig();
    if (!config) return '';
    const classes = [];
    
    if (config.layout === 'grid') {
      classes.push('grid');
      if (config.columns) {
        classes.push(`grid-cols-${config.columns}`);
      }
    } else if (config.layout === 'horizontal') {
      classes.push('horizontal');
    }
    return classes.join(' ');
  }
  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }
  private collectFormErrors(): { [key: string]: string } {
    const errors: { [key: string]: string } = {};
    
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      const field = this.config.fields.find(f => f.key === key);
      
      if (control && control.errors && field) {
        errors[key] = this.formBuilder.getValidationError(field, control);
      }
    });
    return errors;
  }
}
