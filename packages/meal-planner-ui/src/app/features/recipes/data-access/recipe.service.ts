import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Recipe } from "app/shared/models/recipe.model";
import { catchError, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root'})

export class RecipeService{
private apiUrl = 'assets/data/recipes.json';
private getRecipeDetailsUrl = 'assets/data/recipe-details.json';
private getUpdatedRecipeUrl = 'assets/data/updated-recipe.json';

    private http = inject(HttpClient);

    getAll(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(this.apiUrl).pipe(
            catchError(err => {
                console.log('Error loading recipes:', err);
                return of([]);
            })
        );
    }

    add(recipe: Omit<Recipe, 'id' | 'createdAt'>): Observable<Recipe>{
        const newRecipe: Recipe = {
            ...recipe,
            id: crypto.randomUUID(),
            createdAt: new Date(),
        }
        console.warn('Mock addRecipe called (local JSON). Returning mock observable.');
        return of(newRecipe);
    }

    getRecipeDetails(id: string): Observable<Recipe>{
        console.warn('Mock getRecipeDetails called (local JSON). Returning mock observable.');
        return this.http.get<Recipe>(this.getRecipeDetailsUrl).pipe(
            catchError(err => {
                console.log('Error fetching recipe details:', err);
                throw err;
            }
        ));
    }

    update(id: string, updates: Partial<Recipe>): Observable<Recipe>{
        console.warn('Mock updateRecipe called (local JSON). Returning mock observable.');
        return this.http.get<Recipe>(this.getUpdatedRecipeUrl).pipe(
            catchError(err => {
                console.log('Error updating recipe:', err);
                throw err;
            }
        ));
    }

    delete(id: string): Observable<void>{
        console.warn('Mock deleteRecipe called (local JSON). Returning empty observable.');
        return of(void 0)
    }
}