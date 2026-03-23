import { FormField } from './form-field.interface';
export interface FormConfig {
  title?: string;
  description?: string;
  fields: FormField[];
  submitButtonText?: string;
  resetButtonText?: string;
  showReset?: boolean;
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: number; // For grid layout
  validationTrigger?: 'blur' | 'change' | 'submit';
}
export interface FormSubmissionResult {
  valid: boolean;
  data: any;
  errors?: { [key: string]: string };
}