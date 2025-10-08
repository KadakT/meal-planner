import { Component, inject } from '@angular/core';
import { ButtonsComponent, ThemeSwitchComponent } from '@components/index';
import { AuthService } from 'app/core/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ ButtonsComponent, ThemeSwitchComponent ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private authService = inject(AuthService);

  logOut(){
    this.authService.logout();
  }
}
