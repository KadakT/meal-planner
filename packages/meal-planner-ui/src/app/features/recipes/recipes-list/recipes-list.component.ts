import { Component, inject } from "@angular/core";
import { RecipeCardComponent } from "./recipe-card/recipe-card.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { RecipeStore } from "../data-access/recipe.store";
import { ButtonsComponent } from "@components/index";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-recipes-list',
    standalone: true,
    imports: [ RecipeCardComponent, TranslateModule, ButtonsComponent, ButtonsComponent ],
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
                <app-button (click)="existingRecipe(recipe.id)">
                    {{ 'PAGES.RECIPES_LIST.VIEW_DETAILS' | translate }}
                </app-button>
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
        this.recipeStore.load().subscribe(() =>{
            console.log('Recipes loaded:', this.recipeStore.items());
        });
    }

    addNewRecipe() {
        this.router.navigate(['../new'], {relativeTo: this.route});
    }

    existingRecipe(id: string) {
        console.log('Navigating to recipe with id:', id);
        this.router.navigate(['../', id], {relativeTo: this.route});
    }
}