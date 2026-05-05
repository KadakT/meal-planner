import { Recipe, RecipeApi } from "app/shared/models/recipe.model";

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

export function buildRecipeListVm(recipes: Recipe[], loading: boolean, error: string | null)
: RecipesListVM {
    console.log(recipes);
    return {
        recipes: recipes.map(mapRecipe),
        loading,
        error,
    }
}

function mapRecipe(recipe: Recipe): RecipeVM {
    return {
        id: recipe.id,
        name: recipe.name,
        description: recipe.instruction,
        category: recipe.category || 'Uncategorized',
        imageUrl: recipe.imageUrl || '/assets/images/meal-default.jpg',
        createdAt: recipe.createdAt || new Date(),
    };
}

export function mapRecipeApiToRecipe(api: RecipeApi): Recipe {
  return {
    id: api._id,
    name: api.name,
    ingredients: api.ingredients.map((ingredient) => ({
      name: ingredient.name,
      amount: ingredient.amount ?? '',
      unit: ingredient.unit ?? '',
    })),
    instruction: api.instruction,
    category: api.category,
    imageUrl: api.imageUrl,
    notes: api.notes,
    createdAt: new Date(api.createdAt),
  };
}