import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services';
import { CookieKeys } from '../../definitions';
import { activateTheme } from './../../utils';
import { TranslateModule } from '@ngx-translate/core';
import { AppStore } from 'app/store/app.store';

@Component({
  selector: 'app-theme-switch',
  standalone: true,
  imports:  [ ReactiveFormsModule, TranslateModule ],
  templateUrl: './theme-switch.component.html'
})
export class ThemeSwitchComponent {
   readonly appStore = inject(AppStore);
  themeSwitch;
  activeTheme: string = '';
  focusedInput: boolean = false;
  
  constructor( fb: FormBuilder, private storageService: StorageService) {
    this.themeSwitch = fb.group({
      theme: ['']
    });
  }

  toggleClassName(event: Event) {
   // this.focusedInput = event.type == 'keyup';
  
  }
}
