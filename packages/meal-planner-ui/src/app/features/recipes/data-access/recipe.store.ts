import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { computed } from '@angular/core';
import { CreateRecipeRequest, Recipe, RecipeApi, UpdateRecipeRequest } from '../../../shared/models/recipe.model';
import { withCrudStore } from 'app/core/store/with-crud-store';
import { environment } from 'environments/environment';
import { buildRecipeListVm, mapRecipeApiToRecipe } from '../recipes-list/recipes-list.vm-builder';

type RecipeMode = 'create' | 'edit' | 'view';

interface RecipeUiState {
  mode: RecipeMode;
  selectedRecipeId: string | null;
}

export const RecipeStore = signalStore(
  { providedIn: 'root' },


  withCrudStore<Recipe, CreateRecipeRequest, UpdateRecipeRequest, RecipeApi>({
    baseUrl: `${environment.apiUrl}/recipes`,
    mapFromApi: mapRecipeApiToRecipe,
  }),

  withState<RecipeUiState>({
    mode: 'view',
    selectedRecipeId: null as string | null,
  }),

  withComputed((store) => ({

    isCreateMode: computed(() => store.mode() === 'create'),
    isEditMode: computed(() => store.mode() === 'edit'),
    isViewMode: computed(() => store.mode() === 'view'),

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
  })),
  withMethods((store) => ({
    setCreateMode(): void {
      patchState(store, { mode: 'create' });
    },

    setEditMode(): void {
      patchState(store, { mode: 'edit' });
    },

    setViewMode(): void {
      patchState(store, { mode: 'view' });
    },

    resetSelectedRecipe(): void {
      patchState(store, { selectedRecipeId: null });
    }
  }))
);
