import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { RecipeStore } from 'app/features/recipes/data-access/recipe.store';
import { RecipeComponentTest } from 'app/features/recipes/recipe.component';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [ RecipeComponentTest, JsonPipe, AsyncPipe ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss'
})
export class RecipesComponent {
  readonly recipeStore = inject(RecipeStore);

}
