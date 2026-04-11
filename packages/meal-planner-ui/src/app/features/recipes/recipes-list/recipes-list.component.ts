import { Component, inject } from "@angular/core";
import { RecipeCardComponent } from "./recipe-card/recipe-card.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { RecipeStore } from "../data-access/recipe.store";
import { ButtonsComponent } from "@components/index";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-recipes-list',
    standalone: true,
    imports: [ RecipeCardComponent, TranslateModule, ButtonsComponent ],
    template: `
    <div class="recipes">
        <h1>{{ 'PAGES.RECIPES_LIST.TITLE' | translate }}</h1>
    </div>
    <app-button
        (click)="addNewRecipe()"
    >{{ 'PAGES.RECIPES_LIST.ADD_NEW' | translate }}</app-button>
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
    readonly translate = inject(TranslateService);

    private router = inject(Router);
    private route = inject(ActivatedRoute);

    constructor() {
        console.log('RecipesListComponent created');
        this.recipeStore.load().subscribe();
    }

    addNewRecipe() {
        this.router.navigate(['../new'], {relativeTo: this.route});
    }
}