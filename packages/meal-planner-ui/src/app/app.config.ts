import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClientModule, provideHttpClient, withInterceptors } from "@angular/common/http";
import { environment } from './../environments/environment';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideStore } from '@ngrx/store';
import { authReducer } from './features/auth/auth.reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './features/auth/auth.effects';

console.log('appConfig providers applied');
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideTranslateService({
        loader: provideTranslateHttpLoader({
            prefix: environment.translationPath,
            suffix: '.json'
        }),
        fallbackLang: 'en',
        lang: 'en'
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideEffects([AuthEffects]),
    provideStore({ auth: authReducer })
]
};


