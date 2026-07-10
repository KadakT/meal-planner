import { Component, effect, inject, signal } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { form, Field, required, minLength, applyEach } from '@angular/forms/signals';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { submit } from '@angular/forms/signals';
import { RecipeStore } from "../../data-access/recipe.store";
import { ButtonsComponent } from "@components/index";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastService } from "app/shared/services/toast.service";

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
        MatButtonModule,
        ButtonsComponent
    ],
    templateUrl: './recipe-form.component.html'
})

export class RecipeFormComponent {
    readonly recipeStore = inject(RecipeStore);
    readonly toast = inject(ToastService);
 
    private translate = inject(TranslateService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

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
        effect(() => {
            const recipe = this.recipeStore.currentItem();

            if (!recipe) return;

            this.recipeModel.set({
                name: recipe.name ?? '',
                ingredients: recipe.ingredients.length
                    ? recipe.ingredients.map((ingredient) => ({
                        name: ingredient.name ?? '',
                        amount: ingredient.amount ?? '',
                        unit: ingredient.unit ?? '',
                    }))
                    : [{ name: '', amount: '', unit: '' }],
                description: recipe.instruction ?? '',
                category: recipe.category ?? '',
                imageUrl: recipe.imageUrl ?? '',
                notes: recipe.notes ?? '',
                instruction: recipe.instruction ?? '',
            });
        });
    }

    async onSubmit(event: Event): Promise<void> {
        console.log('Form submitted with value:', this.recipeModel());
        console.log('Form validity:', this.recipeForm().valid);
        event.preventDefault();
        await submit(this.recipeForm, async () => {
            console.log('Form is valid, proceeding with submission');
            console.log(this.recipeStore.isCreateMode() ? 'Creating new recipe...' : 'Updating existing recipe...');
            if (this.recipeStore.isCreateMode()) {
                this.onCreateRecipe();
            } else {
                this.onEditRecipe();
            }
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

    onCancel(): void {
        if (this.recipeStore.isCreateMode()) {
            this.router.navigate(['../list'], { relativeTo: this.route });
        } else {
            this.recipeStore.setViewMode();
        }
    }

    onCreateRecipe(): void {
        const newRecipe = ({
            ...this.recipeModel(),
        });
        this.recipeStore.create(newRecipe).subscribe((response) => {
            console.log('Recipe created:', response);
            this.recipeStore.setViewMode();
            this.toast.success('Recipe created');
        });
    }

    onEditRecipe(): void {
        const value = this.recipeModel();
        console.log('Updating recipe with value:', value);
        console.log('Selected recipe ID:', this.recipeStore.selectedRecipeId());
        console.log('Current item in store:', this.recipeStore.currentItem()?.id);
        if(!this.recipeStore.currentItem()?.id) {
            return;
        }

        this.recipeStore.update(this.recipeStore.currentItem()?.id!, {
            name: value.name,
            ingredients: value.ingredients,
            instruction: value.instruction,
            category: value.category || undefined,
            imageUrl: value.imageUrl || undefined,
            notes: value.notes || undefined,
        }).subscribe((response) => {
            this.recipeStore.setViewMode();
            this.toast.success('Recipe updated');
            console.log('Recipe updated:', response);
        });
    }
}