import { Component, input } from "@angular/core";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-mat-card',
  standalone: true,
  imports: [ MatCardModule, MatButtonModule ],
  templateUrl: './mat-card.component.html',
})

export class MatCardComponent {
  title = input<string>();
  subtitle = input<string>();
}