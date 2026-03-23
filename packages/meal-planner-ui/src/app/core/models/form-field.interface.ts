export type FieldType = 'text' | 'email' | 'password' | 'number' | 'select' | 
                       'checkbox' | 'radio' | 'textarea' | 'date' | 'file';
export interface FormFieldOption {
  label: string;
  value: any;
  disabled?: boolean;
}
export interface FormFieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  email?: boolean;
  custom?: (value: any) => string | null;
}
export interface FormField {
  key: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  value?: any;
  options?: FormFieldOption[];
  validation?: FormFieldValidation;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  dependsOn?: string; // Field dependency for conditional rendering
  dependsOnValue?: any; // Value that triggers dependency
  order?: number;
  helpText?: string;
  group?: string; // For grouping related fields
}