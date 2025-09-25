import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClientModule, provideHttpClient } from "@angular/common/http";
import { environment } from './environments/environment';
import { routes } from './app.routes';
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
    })
  ]
};


