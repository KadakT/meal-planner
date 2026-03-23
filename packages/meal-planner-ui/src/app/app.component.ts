import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule} from "@ngx-translate/core";
import { FooterComponent, HeaderComponent, SidebarComponent } from './layout';
import { Store } from '@ngrx/store';
import { selectIsAuthenticate } from './features/auth/auth.selector';
import { AuthActions } from './features/auth/auth.actions';

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
  private store = inject(Store);

  isLoggedIn$ = this.store.select(selectIsAuthenticate);
   
  title = 'lerning';
  appLanguage = 'en';

  constructor() {
    this.translate.setFallbackLang('en');
    this.translate.use('en');
  }


  ngOnInit(){
    this.store.dispatch(AuthActions.autoLogin());
  }
}
