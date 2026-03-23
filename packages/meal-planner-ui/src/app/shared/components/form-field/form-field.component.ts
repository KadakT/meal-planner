import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormField } from '../../../core/models/form-field.interface';
@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ],
  template: `
    <div class="field-container" [ngClass]="getFieldClasses()">
      
      <!-- Field Label -->
      @if (field.label) {
        <label [for]="field.key" class="field-label">
          {{ field.label }}
          @if (field.validation?.required) {
            <span class="required-asterisk">*</span>
          }
        </label>
      }
      <!-- Input Field -->
      @switch (field.type) {
        
        @case ('text') {
          <input
            [id]="field.key"
            type="text"
            class="form-input"
            [placeholder]="field.placeholder || ''"
            [formControl]="control"
            [readonly]="field.disabled"
            (blur)="onBlur()"
            (focus)="onFocus()" />
        }
        @case ('email') {
          <input
            [id]="field.key"
            type="email"
            class="form-input"
            [placeholder]="field.placeholder || 'Enter email address'"
            [formControl]="control"
            [readonly]="field.disabled"
            (blur)="onBlur()"
            (focus)="onFocus()" />
        }
        @case ('password') {
          <div class="password-field">
            <input
              [id]="field.key"
              [type]="showPassword ? 'text' : 'password'"
              class="form-input"
              [placeholder]="field.placeholder || 'Enter password'"
              [formControl]="control"
              [readonly]="field.disabled"
              (blur)="onBlur()"
              (focus)="onFocus()" />
            <button 
              type="button" 
              class="password-toggle"
              (click)="togglePasswordVisibility()"
              [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'">
              {{ showPassword ? '👁️' : '🙈' }}
            </button>
          </div>
        }
        @case ('number') {
          <input
            [id]="field.key"
            type="number"
            class="form-input"
            [placeholder]="field.placeholder || '0'"
            [formControl]="control"
            [readonly]="field.disabled"
            [min]="field.validation?.min ?? null"
            [max]="field.validation?.max ?? null"
            (blur)="onBlur()"
            (focus)="onFocus()" />
        }
        @case ('select') {
          <select
            [id]="field.key"
            class="form-select"
            [formControl]="control"
            [disabled]="field.disabled ?? false"
            (blur)="onBlur()"
            (focus)="onFocus()">
            
            @if (field.placeholder) {
              <option value="" disabled>{{ field.placeholder }}</option>
            }
            
            @for (option of field.options; track option.value) {
              <option [value]="option.value" [disabled]="option.disabled">
                {{ option.label }}
              </option>
            }
          </select>
        }
        @case ('textarea') {
          <textarea
            [id]="field.key"
            class="form-textarea"
            [placeholder]="field.placeholder || ''"
            [formControl]="control"
            [readonly]="field.disabled ?? false"
            [maxlength]="field.validation?.maxLength ?? null"
            rows="4"
            (blur)="onBlur()"
            (focus)="onFocus()">
          </textarea>
          
          @if (field.validation?.maxLength) {
            <div class="character-count">
              {{ (control.value || '').length }} / {{ field.validation?.maxLength}}
            </div>
          }
        }
        @case ('checkbox') {
          <div class="checkbox-field">
            <input
              [id]="field.key"
              type="checkbox"
              class="form-checkbox"
              [formControl]="control"
              [disabled]="field.disabled ?? false"
              (blur)="onBlur()"
              (focus)="onFocus()" />
            <label [for]="field.key" class="checkbox-label">
              {{ field.placeholder || field.label }}
            </label>
          </div>
        }
        @case ('radio') {
          <div class="radio-group">
            @for (option of field.options; track option.value) {
              <div class="radio-option">
                <input
                  [id]="field.key + '_' + option.value"
                  type="radio"
                  class="form-radio"
                  [name]="field.key"
                  [value]="option.value"
                  [formControl]="control"
                  [disabled]="(field.disabled || option.disabled ) ?? false"
                  (blur)="onBlur()"
                  (focus)="onFocus()" />
                <label [for]="field.key + '_' + option.value" class="radio-label">
                  {{ option.label }}
                </label>
              </div>
            }
          </div>
        }
        @case ('date') {
          <input
            [id]="field.key"
            type="date"
            class="form-input"
            [formControl]="control"
            [readonly]="field.disabled"
            (blur)="onBlur()"
            (focus)="onFocus()" />
        }
        @case ('file') {
          <input
            [id]="field.key"
            type="file"
            class="form-file"
            [accept]="field.validation?.pattern || ''"
            [disabled]="field.disabled"
            (change)="onFileChange($event)"
            (blur)="onBlur()"
            (focus)="onFocus()" />
          
          @if (selectedFileName) {
            <div class="file-info">
              Selected: {{ selectedFileName }}
            </div>
          }
        }
      }
      <!-- Help Text -->
      @if (field.helpText) {
        <div class="help-text">{{ field.helpText }}</div>
      }
      <!-- Error Message -->
      @if (errorMessage && (control.touched || control.dirty)) {
        <div class="error-message">{{ errorMessage }}</div>
      }
    </div>
  `,
  styles: [`
    .field-container {
      position: relative;
      margin-bottom: 1rem;
    }
    .field-label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }
    .required-asterisk {
      color: #dc2626;
      margin-left: 0.125rem;
    }
    .form-input,
    .form-select,
    .form-textarea {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .form-input:disabled,
    .form-select:disabled,
    .form-textarea:disabled {
      background-color: #f9fafb;
      cursor: not-allowed;
    }
    .password-field {
      position: relative;
    }
    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      font-size: 1rem;
    }
    .checkbox-field {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .form-checkbox {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
    }
    .checkbox-label {
      cursor: pointer;
      font-weight: normal;
      margin-bottom: 0;
    }
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .form-radio {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
    }
    .radio-label {
      cursor: pointer;
      font-weight: normal;
      margin-bottom: 0;
    }
    .form-file {
      width: 100%;
      padding: 0.5rem;
      border: 2px dashed #d1d5db;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: border-color 0.2s ease-in-out;
    }
    .form-file:hover {
      border-color: #3b82f6;
    }
    .file-info {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: #6b7280;
    }
    .character-count {
      text-align: right;
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }
    .help-text {
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }
    .error-message {
      font-size: 0.75rem;
      color: #dc2626;
      margin-top: 0.25rem;
    }
    .field-container.has-error .form-input,
    .field-container.has-error .form-select,
    .field-container.has-error .form-textarea {
      border-color: #dc2626;
    }
    .field-container.focused .form-input,
    .field-container.focused .form-select,
    .field-container.focused .form-textarea {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  `]
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() field!: FormField;
  @Input() control!: FormControl;
  @Input() errorMessage: string = '';
  @Output() valueChange = new EventEmitter<{field: string, value: any}>();
  showPassword = false;
  selectedFileName = '';
  isFocused = false;
  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  private onTouched = () => {};
  writeValue(value: any): void {
    if (this.control) {
      this.control.setValue(value, { emitEvent: false });
    }
  }
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    if (this.control) {
      isDisabled ? this.control.disable() : this.control.enable();
    }
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.control.setValue(file);
      this.valueChange.emit({ field: this.field.key, value: file });
      this.onChange(file);
    }
  }
  onFocus(): void {
    this.isFocused = true;
  }
  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }
  getFieldClasses(): string {
    const classes = [];
    
    if (this.errorMessage && (this.control.touched || this.control.dirty)) {
      classes.push('has-error');
    }
    
    if (this.isFocused) {
      classes.push('focused');
    }
    
    if (this.field.disabled) {
      classes.push('disabled');
    }
    return classes.join(' ');
  }
}