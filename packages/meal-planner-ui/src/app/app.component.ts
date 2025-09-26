import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';
import { CommonModule } from '@angular/common';
import { environment } from './../environments/environment';
import { HeaderComponent } from './layout/header/header.component';
import { CookieKeys } from './shared/definitions';
import { StorageService } from './core/services';
import { activateTheme } from './shared/utils';
import {
    TranslateService,
    TranslatePipe,
    TranslateDirective,
    TranslateModule
} from "@ngx-translate/core";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,  
            RouterOutlet,  
            FooterComponent, 
            HeaderComponent,
           TranslateModule
          ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
   private http = inject(HttpClient);

  private translate = inject(TranslateService);
   private storageService = inject(StorageService)
   
  title = 'lerning';
  appLanguage = 'en';
  private router = inject(Router);

  constructor() {
  this.translate.setFallbackLang('en');
  this.translate.use('en');
}

  // constructor(){
  //   this.translate.addLangs(environment.languages);
  //   this.translate.setFallbackLang(this.appLanguage);
  // }

  ngOnInit(){
    this.setTheme();
    this.router.events.subscribe(event => {
      console.log(event);
    });
  }

  setTheme = () => {
    if (document.body.classList) {
      activateTheme(this.storageService.getCookie(CookieKeys.Theme, 'light'));
      if (!this.storageService.getCookie(CookieKeys.Theme)) {
        this.storageService.setCookie(CookieKeys.Theme, 'light');
      }
    }
  };

}
