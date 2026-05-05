import {
    signalStore,
    withState,
    withComputed,
} from '@ngrx/signals';
import { computed} from '@angular/core';
import { CreateRecipeRequest, Recipe, RecipeApi, UpdateRecipeRequest } from '../../../shared/models/recipe.model';
import { withCrudStore } from 'app/core/store/with-crud-store';
import { environment } from 'environments/environment';
import { buildRecipeListVm, mapRecipeApiToRecipe } from '../recipes-list/recipes-list.vm-builder';

export const RecipeStore = signalStore(
  { providedIn: 'root' },

  withState({
    selectedRecipeId: null as string | null,
  }),

  withCrudStore<Recipe, CreateRecipeRequest, UpdateRecipeRequest, RecipeApi>({
    baseUrl: `${environment.apiUrl}/recipes`,
    mapFromApi: mapRecipeApiToRecipe,
  }),

  withComputed((store) => ({

    selectedRecipe: computed(() =>
      store.items().find(r => r.id === store.selectedRecipeId())
    ),

    listVM: computed(() =>
      buildRecipeListVm(
        store.items(),
        store.loading().load,
        store.error()
      )
    ),
  }))
);
