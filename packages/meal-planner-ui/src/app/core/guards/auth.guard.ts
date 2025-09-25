import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services';
import { SessionKeys } from 'app/shared/definitions';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
    private router = inject(Router);
    private storageService = inject(StorageService);

  canActivate(): boolean {
    const token = this.storageService.getFromStorage(SessionKeys.Token);
    console.log(token);
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
