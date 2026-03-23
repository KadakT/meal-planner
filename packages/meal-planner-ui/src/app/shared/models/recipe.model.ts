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