import { Component, NgModule } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ThemeSwitchComponent } from '../../shared/components/theme-switch/theme-switch.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ ThemeSwitchComponent ],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
 

}
