export interface User{
    id: string;
    email: string;
    name: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface RefreshResponse {
  user: User;
  accessToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}