import { Component, inject } from '@angular/core';
import { ButtonsComponent } from '@components/index';
import { LogoutService } from 'app/core/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ ButtonsComponent ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private logoutService = inject(LogoutService);

  logOut(){
    this.logoutService.logout();
  }
}
