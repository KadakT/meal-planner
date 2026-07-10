import { Component, inject } from '@angular/core';
import { ButtonsComponent, ThemeSwitchComponent } from '@components/index';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AuthActions } from 'app/features/auth/auth.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ TranslateModule, ThemeSwitchComponent ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private store = inject(Store);

  logOut(){
    this.store.dispatch(AuthActions.logout());
  }
}
