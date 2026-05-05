import { Component, inject, signal } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { form, Field, required, minLength, applyEach } from '@angular/forms/signals';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { submit } from '@angular/forms/signals';
import { RecipeStore } from "../../data-access/recipe.store";

interface RecipeForm {
    name: string;
    category: string;
    description: string;
    ingredients: Ingredient[];
    imageUrl: string;
    notes: string;
    instruction: string;
}

interface Ingredient {
    name: string;
    amount: string;
    unit: string;
}



@Component({
    selector: 'app-recipe-form',
    standalone: true,
    imports: [
        TranslateModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        Field,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './recipe-form.component.html'
})

export class RecipeFormComponent {
    readonly recipeStore = inject(RecipeStore);
    
    private translate = inject(TranslateService);

    readonly recipeModel = signal<RecipeForm>({
        name: '',
        category: '',
        description: '',
        ingredients: [
            { name: '', amount: '', unit: '' }
        ],
        imageUrl: '',
        notes: '',
        instruction: ''
    });


    recipeForm = form(this.recipeModel, (schemaPath) => {
        required(schemaPath.name, { message: this.translate.instant('VALIDATION.REQUIRED', { field: 'Recipe name' }) });
        minLength(schemaPath.name, 2, { message: this.translate.instant('VALIDATION.MIN_LENGTH', { field: 'Recipe name', length: 2 }) });
        applyEach(schemaPath.ingredients, (ingredientPath) => {
            required(ingredientPath.name, { message: this.translate.instant('VALIDATION.REQUIRED', { field: 'Ingredient name' }) });
            minLength(ingredientPath.name, 2, { message: this.translate.instant('VALIDATION.MIN_LENGTH', { field: 'Ingredient name', length: 2 }) });
            required(ingredientPath.amount, { message: this.translate.instant('VALIDATION.REQUIRED', { field: 'Ingredient amount' }) });
            required(ingredientPath.unit, { message: this.translate.instant('VALIDATION.REQUIRED', { field: 'Ingredient unit' }) });
        });
    });

    constructor() {
        console.log('RecipeFormComponent initialized');
    }

   async onSubmit(event: Event): Promise<void> {
        event.preventDefault();
        await submit(this.recipeForm, async () => {
            console.log(this.recipeModel());
            const newRecipe = ({
                id: "1",
                ...this.recipeModel(),
            });
            this.recipeStore.create(newRecipe).subscribe((response) => {
                console.log('Recipe created:', response);
            });
        });
    }

    addIngredient(ingredient?: Ingredient): void {
        this.recipeModel.update((recipe) => ({
            ...recipe,
            ingredients: [
                ...recipe.ingredients,
                ingredient ?? { name: '', amount: '', unit: '' }
            ]
        }));
    }

    onDeleteIngredient(name?: any, index?: number): void {
        this.recipeModel.update((recipe) => ({
            ...recipe,
            ingredients: recipe.ingredients.filter((ingredient, i) => {
                if (index !== undefined) {
                    return i !== index;
                }

                if (name !== undefined) {
                    return ingredient.name !== name;
                }

                return true;
            }),
        }));
    }

    onUpdateIngredient(name: any, updatedIngredient: any): void {
        this.recipeModel.update((recipe) => ({
            ...recipe,
            ingredients: recipe.ingredients.map(ingredient =>
                ingredient.name === name ? updatedIngredient : ingredient
            )
        }));
    }
}