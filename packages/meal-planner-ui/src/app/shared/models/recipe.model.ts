import { Ingredient } from "./ingredient.model";

export interface Recipe {
    id: string;
    name: string;
    ingredients: Ingredient[];
    instruction: string;
    category?: string;
    imageUrl?: string;
    createdAt?: Date;
    notes?: string;
}

export interface CreateRecipeRequest {
    name: string;
    ingredients: Ingredient[];
    instruction: string;
    category?: string;
    imageUrl?: string;
    notes?: string;
}

export type UpdateRecipeRequest = Partial<CreateRecipeRequest>;

export interface RecipeApi {
    _id: string;
    userId: string;
    name: string;
    ingredients: Ingredient[];
    instruction: string;
    category?: string;
    imageUrl?: string;
    notes?: string;
    createdAt: string;
    __v: number;
}