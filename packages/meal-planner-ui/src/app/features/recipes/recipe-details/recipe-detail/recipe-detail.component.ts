import { Component, inject } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { RecipeStore } from "../../data-access/recipe.store";
import { ButtonsComponent } from "@components/index";
import { DatePipe } from "@angular/common";
import { ToastService } from "app/shared/services/toast.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { ButtonVariant } from "app/shared/constants/ui/button.constants";

@Component({
    selector: 'app-recipe-detail',
    standalone: true,
    imports: [ TranslateModule, 
                ButtonsComponent, 
                DatePipe,
                MatIcon ],
    template: `
        <div class="recipe-page">

            <div class="recipe-page__header">
                <div class="recipe-page__title-block">
                    <div class="recipe-page__meta">
                        <mat-icon>label</mat-icon>
                        <span>{{ recipeStore.currentItem()?.category }}</span>
                        <span>•</span>
                        <mat-icon>schedule</mat-icon>
                        <span>{{ recipeStore.currentItem()?.createdAt | date:'mediumDate' }}</span>
                    </div>
                    </div>

                    <div class="recipe-page__actions">
                        <app-button [btnVariant]="ButtonVariant.Secondary" (click)="editRecipe()">Edit</app-button>
                        <app-button [btnVariant]="ButtonVariant.Secondary" [btnClass]="'danger'" (click)="deleteRecipe()">Delete</app-button>
                    </div>
                </div>

            <div class="recipe-page__content">
                 <div class="recipe-page__card">
                    <img
                        [src]="recipeStore.currentItem()?.imageUrl || '/assets/images/meal-default.jpg'"
                        alt="{{ recipeStore.currentItem()?.name }}"
                        class="recipe-page__image"
                    >
                </div>
                <!-- Ingredients -->
                <div class="recipe-page__card">
                    <h2>Ingredients</h2>

                    <ul>
                        @for (ingredient of recipeStore.currentItem()?.ingredients; track $index) {
                        <li>
                            <span class="recipe-page__card-name">{{ ingredient.name }}</span>
                            <span class="recipe-page__card-amount">
                            {{ ingredient.amount }} {{ ingredient.unit }}
                            </span>
                        </li>
                        }
                    </ul>
                </div>

                <!-- Instructions -->
                <div class="recipe-page__card recipe-page__card--full-width">
                    <h2>Instructions</h2>

                    <p class="recipe-page__instruction">
                        {{ recipeStore.currentItem()?.instruction }}
                    </p>
                </div>

                <!-- Notes -->
                @if (recipeStore.currentItem()?.notes) {
                <div class="recipe-page__card recipe-page__card--full-width">
                    <h2>Notes</h2>
                    <p>{{ recipeStore.currentItem()?.notes }}</p>
                </div>
                }

            </div>

        </div>
    `
})

export class RecipeDetailComponent {
    readonly recipeStore = inject(RecipeStore);
    readonly toast = inject(ToastService);
    protected readonly ButtonVariant = ButtonVariant;
    
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    deleteRecipe(){
        if(!this.recipeStore.currentItem()?.id) return;

        this.recipeStore.delete(this.recipeStore.currentItem()!.id).subscribe({
            next: () => {
                this.toast.success('Recipe deleted');
                this.navigateToList();
            },
            error: () => {
                this.toast.error('Failed to delete recipe');
            }
        });
    }

    editRecipe() {
        this.recipeStore.setEditMode();
    }

    navigateToList() {
        this.router.navigate(['../list'], { relativeTo: this.route });
    }
}