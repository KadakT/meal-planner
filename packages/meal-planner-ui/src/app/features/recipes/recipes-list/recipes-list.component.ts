import { Component, inject } from "@angular/core";
import { RecipeCardComponent } from "./recipe-card/recipe-card.component";
import { TranslateModule } from "@ngx-translate/core";
import { RecipeStore } from "../data-access/recipe.store";

@Component({
    selector: 'app-recipes-list',
    standalone: true,
    imports: [ RecipeCardComponent, TranslateModule ],
    template: `
    <div class="recipes">
        <h1>{{ 'PAGES.RECIPES_LIST.TITLE' | translate }}</h1>
    </div>
    <div class="recipes__list">
        @for(recipe of recipeStore.listVM().recipes; track recipe.id) {
            <app-recipe-card [title]="recipe.name">
                <img [src]="recipe.imageUrl" width="340px" alt="{{ recipe.name }}">
                <p>{{ recipe.description }}</p>
            </app-recipe-card>
        }
    </div>

    `
})

export class RecipesListComponent {
    readonly recipeStore = inject(RecipeStore);

    constructor() {
        console.log('RecipesListComponent created');
        this.recipeStore.load().subscribe();
    }
}