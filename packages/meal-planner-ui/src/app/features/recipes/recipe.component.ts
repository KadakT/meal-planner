import { Component, inject } from "@angular/core";
import { RecipeStore } from "./data-access/recipe.store";
import { JsonPipe } from "@angular/common";

@Component({
    selector: 'app-recipe-test',
    standalone: true,
    imports: [ JsonPipe],
    template: `
        <h2>Recipes</h2>
        <pre>{{ recipeStore.items() | json }}</pre>
    `,
    styles: []
})

export class RecipeComponentTest {
   readonly recipeStore = inject(RecipeStore);

    constructor() {
        this.recipeStore.load().subscribe();
    }
}