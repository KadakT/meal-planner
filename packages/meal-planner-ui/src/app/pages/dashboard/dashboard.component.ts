import { Component } from '@angular/core';
import { FooterComponent } from "../../layout/footer/footer.component";
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from 'app/layout/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ 
            RouterOutlet, 
            RouterLink, 
            FooterComponent, 
            HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
