import { Recipe } from "app/shared/models/recipe.model";

export interface RecipesListVM {
    recipes: RecipeVM[];
    loading: boolean;
    error: string | null;
}

export interface RecipeVM {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    createdAt: Date;
}

export function buildRecipeListVm(recipes: Recipe[], loading: boolean, error: string | null) {
    console.log(recipes);
    return {
        recipes: recipes.map(r => ({
            id: r.id,
            name: r.name,
            description: r.instruction.substring(0, 100) + '...', 
            imageUrl: r.imageUrl ? r.imageUrl : '/assets/images/meal-default.jpg',
            category: r.category,
            createdAt: r.createdAt,
        })),
        loading,
        error,
    }
}