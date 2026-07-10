import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from 'app/features/auth/auth.actions';

@Component({
  selector: 'app-sidebar',
  imports: [ RouterLinkActive, RouterLink, MatIcon ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    private store = inject(Store);
    
    logOut(){
      this.store.dispatch(AuthActions.logout());
    }
}
