import { Component, inject } from '@angular/core';
import { ButtonsComponent, ThemeSwitchComponent } from '@components/index';
import { Store } from '@ngrx/store';
import { AuthService } from 'app/core/services';
import { AuthActions } from 'app/features/auth/auth.actions';
import { AppStore } from 'app/store/app.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ ButtonsComponent, ThemeSwitchComponent ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private store = inject(Store);

  logOut(){
    this.store.dispatch(AuthActions.logout());
  }
}
