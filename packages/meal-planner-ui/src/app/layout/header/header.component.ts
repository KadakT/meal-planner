import { Component, inject } from '@angular/core';
import { ButtonsComponent } from '@components/index';
import { AuthService } from 'app/core/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ ButtonsComponent ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private authService = inject(AuthService);

  logOut(){
    this.authService.logout();
  }
}
