import { Routes } from "@angular/router";
import { RecipeDetailsComponent } from "./recipe-details/recipe-details.component";
import { RecipesListComponent } from "./recipes-list/recipes-list.component";

export const RECIPES_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list',
                component: RecipesListComponent,
                title: 'Recipes List'
            },
            {
                path: 'new',
                component: RecipeDetailsComponent,
                title: 'New Recipe',
            },
            {
                path: ':id',
                component: RecipeDetailsComponent,
                title: 'Recipe Details',
            }
        ]
    }
];