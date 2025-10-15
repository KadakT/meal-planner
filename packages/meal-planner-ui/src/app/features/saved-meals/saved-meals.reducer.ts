import { createReducer } from "@ngrx/store";
import { Meal } from "./saved-meals.model";

export interface MealsState {
    meals: Meal[];
    loading: boolean;
}

export const initialState: MealsState = {
    meals: [],
    loading: false
};

export const mealsReducer = createReducer(
    initialState
    //.....
);