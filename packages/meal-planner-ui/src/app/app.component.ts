import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CookieKeys } from './shared/definitions';
import { AuthService, StorageService } from './core/services';
import { activateTheme } from './shared/utils';
import { TranslateService, TranslateModule} from "@ngx-translate/core";
import { FooterComponent, HeaderComponent, SidebarComponent } from './layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,  
            RouterOutlet,  
            FooterComponent, 
            HeaderComponent,
           TranslateModule,
           SidebarComponent
          ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  private translate = inject(TranslateService);
  private storageService = inject(StorageService);
  private authService = inject(AuthService)

  isLoggedIn$ = this.authService.isLoggedIn$;
   
  title = 'lerning';
  appLanguage = 'en';

  constructor() {
    this.translate.setFallbackLang('en');
    this.translate.use('en');
  }


  ngOnInit(){
    this.setTheme();  
  }

  setTheme = () => {
    if (document.body.classList) {
      activateTheme(this.storageService.getCookie(CookieKeys.Theme, 'dark'));
      if (!this.storageService.getCookie(CookieKeys.Theme)) {
        this.storageService.setCookie(CookieKeys.Theme, 'dark');
      }
    }
  };

}
