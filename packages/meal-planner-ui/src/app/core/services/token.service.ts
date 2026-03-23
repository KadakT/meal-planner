import { Injectable } from '@angular/core';
import { User } from 'app/features/auth/auth.model';
import { SessionKeys } from 'app/shared/definitions';

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  storeTokenWithExpiry(token: string, rememberMe: boolean, ttlInMs: number): void {
    if (rememberMe) {
      const expiry = new Date().getTime() + ttlInMs;
      const data = { token: token, expiry };
      localStorage.setItem(SessionKeys.Token, JSON.stringify(data));
    } else {
      sessionStorage.setItem(SessionKeys.Token, token)
    }
  }

  storeAuthDataWithExpiry( token: string, rememberMe: boolean, ttlInMs: number, user?: User ): void {
    const expiry = new Date().getTime() + ttlInMs;
     const authData = { user, token, expiry };
     const storage = rememberMe? localStorage : sessionStorage;
     storage.setItem(SessionKeys.AuthData, JSON.stringify(authData));
  }

  getToken(): string | null {
    const localItem = localStorage.getItem(SessionKeys.AuthData);
    if (localItem) {
      try {
        const parsed = JSON.parse(localItem);
        const now = new Date().getTime();

        if (now > parsed.expiry) {
          this.removeToken();
          return null;
        }

        return parsed.token;
      } catch {
        this.removeToken();
        return null;
      }
    }
    const sessionItem = sessionStorage.getItem(SessionKeys.AuthData);
    return sessionItem ? JSON.parse(sessionItem).token : null;
  }

  removeToken() {
    localStorage.removeItem(SessionKeys.AuthData);
    sessionStorage.removeItem(SessionKeys.AuthData);
  }
}
