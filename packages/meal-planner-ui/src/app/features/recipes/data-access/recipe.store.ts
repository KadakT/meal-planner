import {
    signalStore,
    withState,
    withMethods,
    withComputed,
    patchState,
    StateSource,
    withProps, 
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Recipe } from '../../../shared/models/recipe.model';
import { RecipeService } from './recipe.service';
import { HttpClient } from '@angular/common/http';
import { withCrudStore } from 'app/core/store/with-crud-store';
import { environment } from 'environments/environment';

interface RecipeState {
    recipes: Recipe[];
    selectedRecipeId: string | null;
    selectedRecipe: Recipe;
    loading: boolean;
    error: string | null;
}

const initialState: RecipeState = {
    recipes: [],
    selectedRecipeId: null,
    selectedRecipe: {
            id: '',
            name: '',
            ingredients: [],
            instruction: '',
            category: '',
            imageUrl: '',
            createdAt: new Date(),
            notes: '',
    },
    loading: false,
    error: null,
};

export const RecipeStore = signalStore(
    { providedIn: 'root' },
    withCrudStore<Recipe>({
    baseUrl: `${environment.apiUrl}/recipes`
  })
    // { providedIn: 'root' },
    // withState(initialState),

    // withComputed((store) => ({
    //     selectedRecipe: computed(() =>
    //         store.recipes().find(r => r.id === store.selectedRecipeId())
    //     ),
    //     totalRecipes: computed(() => store.recipes().length),
    // })),
    // withProps((_) => ({
    //     http: inject(HttpClient)
    // })),

    // withMethods((store, recipeService = inject(RecipeService)) => ({
    //     async loadRecipes() {
    //         patchState(store, { loading: true, error: null });
    //         try {
    //             const data = await firstValueFrom(recipeService.getAll());
    //             console.log('Recipes loaded:', data);
    //             patchState(store, { recipes: data, loading: false });
    //             console.log('State after loading recipes:', store.recipes());
    //         } catch (err: any) {
    //             patchState(store, { error: err?.message ?? 'Failed to load recipes', loading: false });
    //         }
    //     },

    //     async addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>) {
    //         patchState(store, { loading: true, error: null });
    //         try {
    //             const newRecipe = await firstValueFrom(recipeService.add(recipe));
    //             // use updater form of patchState for derived next state
    //             patchState(store, (s): Partial<RecipeState> => ({
    //                 recipes: [...s.recipes, newRecipe],
    //                 loading: false,
    //             }));
    //         } catch (err: any) {
    //             patchState(store, { error: err?.message ?? 'Failed to add recipe', loading: false });
    //         }
    //     },

    //     async updateRecipe(id: string, updates: Partial<Recipe>) {
    //         patchState(store, { loading: true, error: null });
    //         try {
    //             const updatedRecipe = await firstValueFrom(recipeService.update(id, updates));
    //             patchState(store, (s): Partial<RecipeState> => ({
    //                 recipes: s.recipes.map(r => r.id === id ? updatedRecipe : r),
    //                 loading: false,
    //             }));
    //         } catch (err: any) {
    //             patchState(store, { error: err?.message ?? 'Failed to update recipe', loading: false });
    //         }
    //     },

    //     async uploadRecipeDetails(id: string) {
    //         patchState(store, { loading: true, error: null });
    //         try {
    //             const recipeDetails = await firstValueFrom(recipeService.getRecipeDetails(id));
    //             console.log('Recipe details loaded:', recipeDetails);
    //             patchState(store, ({
    //                 selectedRecipe: {...recipeDetails},
    //                 loading: false,
    //             }));
    //         }
    //         catch (err: any) {
    //             patchState(store, { error: err?.message ?? 'Failed to load recipe details', loading: false });
    //         }
    //     },

    //     getRecipeDetails(id: string) {
    //         return store.recipes().find(r => r.id === id) || null;
    //     },

    //     selectRecipe(id: string) {
    //         patchState(store, { selectedRecipeId: id });
    //     },

    //     async deleteRecipe(id: string) {
    //         patchState(store, { loading: true, error: null });
    //         try {
    //             await firstValueFrom(recipeService.delete(id));
    //             patchState(store, (s): Partial<RecipeState> => ({
    //                 recipes: s.recipes.filter(r => r.id !== id),
    //                 loading: false,
    //             }));
    //         } catch (err: any) {
    //             patchState(store, { error: err?.message ?? 'Failed to delete recipe', loading: false });
    //         }
    //     },

    //     reset() {
    //       // full replacement of the whole state
    //     //   store[StateSource].set(initialState);
    //     },
    // })),

);
