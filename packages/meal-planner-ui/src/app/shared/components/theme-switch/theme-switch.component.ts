import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services';
import { CookieKeys } from '../../definitions';
import { activateTheme } from './../../utils';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-theme-switch',
  standalone: true,
  imports:  [ ReactiveFormsModule, TranslateModule ],
  templateUrl: './theme-switch.component.html'
})
export class ThemeSwitchComponent {
  themeSwitch;
  activeTheme: string = '';
  focusedInput: boolean = false;
  
  constructor( fb: FormBuilder, private storageService: StorageService) {
    this.themeSwitch = fb.group({
      theme: ['']
    });
  }

  getActiveTheme = () => {
    this.activeTheme = this.storageService.getCookie(CookieKeys.Theme, 'light');
    this.themeSwitch.controls.theme.setValue(this.activeTheme);
  };

  setTheme = (theme: string) => {
    console.log(theme);
    this.storageService.setCookie(CookieKeys.Theme, theme);
    if (document.body.classList) {
      activateTheme(theme);
    }
  };

  toggleClassName(event: Event) {
   // this.focusedInput = event.type == 'keyup';
  
  }
}
