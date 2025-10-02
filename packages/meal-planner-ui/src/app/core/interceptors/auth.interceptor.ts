import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokeService = inject(TokenService);
  const token = tokeService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
