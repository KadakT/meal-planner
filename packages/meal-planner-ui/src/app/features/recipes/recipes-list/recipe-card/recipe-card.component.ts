import { Component, input } from "@angular/core";
import { MatCardComponent } from "app/shared";

@Component({
    selector: 'app-recipe-card',
    standalone: true,
    imports: [ MatCardComponent ],
    template: `
        <app-mat-card [title]="title()" [subtitle]="subtitle()">
            <ng-content />
        </app-mat-card>
    `,

})

export class RecipeCardComponent {
    title = input<string>('Default Title');
    subtitle = input<string>('');
}