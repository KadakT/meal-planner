import { ActionReducerMap } from "@ngrx/store";
import { AppState } from "./app.state";
import { mealsReducer } from "app/features/saved-meals/saved-meals.reducer";

export const appReducers: ActionReducerMap<AppState> = {
    meals: mealsReducer
}
