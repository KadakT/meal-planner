import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CookieEntry, CookieKeys, SessionKeys, StorageEntry } from '../../shared/definitions';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private cookiesSub = new Subject<CookieEntry>();
  private storageSub = new Subject<StorageEntry>();

  private readonly DEFAULT_COOKIE_EXPIRATION_DAYS = 365;
  private readonly localStorageKeys = [SessionKeys.Language, SessionKeys.SessionId, SessionKeys.Token]

  constructor(
    private cookieService: CookieService,
    private router: Router
  ) {
    if (!navigator.cookieEnabled) {
      this.router.navigate(['/cookies-disabled']);
    }
  }
 getCookie(name: CookieKeys, defaultValue: string = ''): string {
    const cookieValue = this.cookieService.get(name);
    return cookieValue || defaultValue;
  }

  getAllCookies() {
    return this.cookieService.getAll();
  }

  setCookie(name: CookieKeys, value: string) {
    this.cookieService.set(name, value, {
      expires: this.DEFAULT_COOKIE_EXPIRATION_DAYS
    });
    this.cookiesSub.next({ name, value });
  }

  deleteCookie(name: CookieKeys) {
    this.cookieService.delete(name, '/', StorageService.getCookieDomain());
  }


  private static getCookieDomain() {
    return '.' + location.host.split('.').slice(1).join('.');
  }

  watchStorage(): Observable<StorageEntry> {
    return this.storageSub.asObservable();
  }

  watchCookies(): Observable<CookieEntry> {
    return this.cookiesSub.asObservable();
  }

  getFromStorage(key: SessionKeys, defaultValue: string = ''): string {
    if (!navigator.cookieEnabled) {
      return defaultValue;
    }
    try {
      if (SessionKeys.SessionId === key) {
        return sessionStorage.getItem(key) || defaultValue;
      }
      if (this.localStorageKeys.includes(key)) {
        return localStorage.getItem(key) || defaultValue;
      }
      return sessionStorage.getItem(key) || defaultValue;
    } catch (error) {
      console.debug(error);
      return defaultValue;
    }
  }

  saveToStorage(key: SessionKeys, value: string | null) {
    if (!value) {
      return;
    }
    try {
      //temp block for SessionId set, later need to be deleted. Also langauge, clientype is back to localStorage
      if (this.localStorageKeys.includes(key)) {
        localStorage?.setItem(key, value);
      }
      sessionStorage?.setItem(key, value);
      this.storageSub.next({ key, value });
    } catch (error) {
      console.debug(error);
    }
  }

  removeFromStorage(key: SessionKeys) {
    try {
      sessionStorage.removeItem(key);
      if (this.localStorageKeys.includes(key)) {
        localStorage.removeItem(key);
      }
      this.storageSub.next({ key, value: null });
    } catch (error) {
      console.debug(error);
    }
  }
}
