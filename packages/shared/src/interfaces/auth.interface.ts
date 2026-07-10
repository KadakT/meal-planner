export interface User{
    id: string;
    email: string;
    name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export interface ApiError {
  code: string;
  message: string;
}