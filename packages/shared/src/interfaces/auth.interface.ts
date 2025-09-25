export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
}