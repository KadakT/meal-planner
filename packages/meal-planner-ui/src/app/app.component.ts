import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CookieKeys } from './shared/definitions';
import { StorageService } from './core/services';
import { activateTheme } from './shared/utils';
import { TranslateService, TranslateModule} from "@ngx-translate/core";
import { HttpClient } from '@angular/common/http';
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


  ngOnInit(){
    this.setTheme();
    this.router.events.subscribe(event => {
      console.log(event);
    });
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
