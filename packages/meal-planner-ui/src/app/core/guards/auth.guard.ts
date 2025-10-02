import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services';
import { SessionKeys } from 'app/shared/definitions';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
    private router = inject(Router);
    private tokenService = inject(TokenService);

  canActivate(): boolean {
    const token = this.tokenService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
