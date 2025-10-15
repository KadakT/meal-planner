export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealTemplate {
    id: string;
    name: string;
    type?: MealType;
    recipeId: string[];
    notes?: string;
}