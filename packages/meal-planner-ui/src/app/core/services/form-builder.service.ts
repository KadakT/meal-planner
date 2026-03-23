import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { FormConfig } from '../models/form-config.interface';
import { FormField } from '../models/form-field.interface';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormBuilderService {
  
  constructor(private fb: FormBuilder) {}
  /**
   * Creates a reactive form group from form configuration
   * @param config Form configuration object
   * @returns FormGroup with all fields and validations
   */
  createForm(config: FormConfig): FormGroup {
    try {
      const group: { [key: string]: FormControl } = {};
      // Sort fields by order if specified
      const sortedFields = this.sortFields(config.fields);
      sortedFields.forEach(field => {
        // Skip hidden fields during form creation
        if (!field.hidden) {
          const validators = this.buildValidators(field);
          group[field.key] = new FormControl(
            { 
              value: field.value || null, 
              disabled: field.disabled || false 
            },
            validators
          );
        }
      });
      return this.fb.group(group);
    } catch (error) {
      console.error('Error creating dynamic form:', error);
      throw new Error(`Failed to create form: ${error}`);
    }
  }
  /**
   * Sorts fields by order property
   * @param fields Array of form fields
   * @returns Sorted array of fields
   */
  private sortFields(fields: FormField[]): FormField[] {
    return fields.sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  /**
   * Builds validators array for a form field
   * @param field Form field configuration
   * @returns Array of validators
   */
  private buildValidators(field: FormField): any[] {
    const validators: any[] = [];
    if (!field.validation) return validators;
    // Required validation
    if (field.validation.required) {
      validators.push(Validators.required);
    }
    // Length validations
    if (field.validation.minLength) {
      validators.push(Validators.minLength(field.validation.minLength));
    }
    if (field.validation.maxLength) {
      validators.push(Validators.maxLength(field.validation.maxLength));
    }
    // Number validations
    if (field.validation.min !== undefined) {
      validators.push(Validators.min(field.validation.min));
    }
    if (field.validation.max !== undefined) {
      validators.push(Validators.max(field.validation.max));
    }
    // Pattern validation
    if (field.validation.pattern) {
      validators.push(Validators.pattern(field.validation.pattern));
    }
    // Email validation
    if (field.validation.email) {
      validators.push(Validators.email);
    }
    // Custom validation
    if (field.validation.custom) {
      validators.push((control: AbstractControl) => {
        const error = field.validation!.custom!(control.value);
        return error ? { custom: error } : null;
      });
    }
    return validators;
  }
  /**
   * Updates form field visibility based on dependencies
   * @param form The form group
   * @param fields Array of form fields
   */
  updateFieldVisibility(form: FormGroup, fields: FormField[]): void {
    fields.forEach(field => {
      if (field.dependsOn && field.dependsOnValue !== undefined) {
        const dependentControl = form.get(field.dependsOn);
        const currentControl = form.get(field.key);
        if (dependentControl && currentControl) {
          const shouldShow = dependentControl.value === field.dependsOnValue;
          
          if (shouldShow && !currentControl.enabled) {
            currentControl.enable();
          } else if (!shouldShow && currentControl.enabled) {
            currentControl.disable();
            currentControl.setValue(null);
          }
        }
      }
    });
  }
  /**
   * Gets validation error message for a form control
   * @param field Form field configuration
   * @param control Form control
   * @returns Error message string
   */
  getValidationError(field: FormField, control: AbstractControl): string {
    if (!control.errors) return '';
    const errors = control.errors;
    if (errors['required']) {
      return `${field.label} is required`;
    }
    if (errors['minlength']) {
      return `${field.label} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${field.label} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['min']) {
      return `${field.label} must be at least ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `${field.label} cannot exceed ${errors['max'].max}`;
    }
    if (errors['pattern']) {
      return `${field.label} format is invalid`;
    }
    if (errors['email']) {
      return `${field.label} must be a valid email address`;
    }
    if (errors['custom']) {
      return errors['custom'];
    }
    return 'Invalid input';
  }
}