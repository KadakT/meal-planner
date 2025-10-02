import { Injectable } from '@angular/core';
import { SessionKeys } from 'app/shared/definitions';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  storeTokenWithExpiry(token: string, rememberMe: boolean, ttlInMs: number): void{
    if (rememberMe){
      const expiry = new Date().getTime() + ttlInMs;
      const data = { token: token, expiry };
      localStorage.setItem(SessionKeys.Token, JSON.stringify(data));
    } else {
      sessionStorage.setItem(SessionKeys.Token, token)
    }
  
  }

  getToken(): string | null {
    const localItem  = localStorage.getItem(SessionKeys.Token);
    if (localItem){
      try{
        const parsed = JSON.parse(localItem);
        const now = new Date().getTime();

        if (now > parsed.expiry){
          this.removeToken();
          return null;
        }

        return parsed.token;
      } catch{
        this.removeToken();
        return null;
      }
    }

    return sessionStorage.getItem(SessionKeys.Token);
  }

  removeToken(){
    localStorage.removeItem(SessionKeys.Token);
    sessionStorage.removeItem(SessionKeys.Token);
  }
}
