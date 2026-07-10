import { Component, inject } from "@angular/core";
import { RecipeCardComponent } from "./recipe-card/recipe-card.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { RecipeStore } from "../data-access/recipe.store";
import { ButtonsComponent } from "@components/index";
import { ActivatedRoute, Router } from "@angular/router";
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ButtonVariant } from "app/shared/constants/ui/button.constants";

@Component({
    selector: 'app-recipes-list',
    standalone: true,
    imports: [RecipeCardComponent,
        TranslateModule,
        ButtonsComponent,
        ButtonsComponent,
        MatPaginatorModule],
    template: `
    <div class="recipes">
        <h1>{{ 'PAGES.RECIPES_LIST.TITLE' | translate }}</h1>
    </div>
    <app-button
        (click)="addNewRecipe()"
        [btnVariant]="ButtonVariant.Secondary"
    >{{ 'PAGES.RECIPES_LIST.ADD_NEW' | translate }}</app-button>
    <div class="recipes__list">
        @for(recipe of recipeStore.listVM().recipes; track recipe.id) {
            <app-recipe-card [title]="recipe.name">
                <img [src]="recipe.imageUrl" width="340px" alt="{{ recipe.name }}">
                <p>{{ recipe.description }}</p>
                <app-button [btnVariant]="ButtonVariant.Secondary"
                            (click)="existingRecipe(recipe.id)"
                            [btnClass]="'w-full'">
                    {{ 'PAGES.RECIPES_LIST.VIEW_DETAILS' | translate }}
                </app-button>
            </app-recipe-card>
        }
    </div>
        <mat-paginator
            [length]="recipeStore.pagination()?.total ?? 0"
            [pageSize]="recipeStore.pagination()?.limit ?? 10"
            [pageIndex]="(recipeStore.pagination()?.page ?? 1) - 1"
            [pageSizeOptions]="[5, 10, 25, 50]"
            (page)="onPageChange($event)">
        </mat-paginator>

    `
})

export class RecipesListComponent {
    readonly recipeStore = inject(RecipeStore);
    readonly translate = inject(TranslateService);
    protected readonly ButtonVariant = ButtonVariant;

    private router = inject(Router);
    private route = inject(ActivatedRoute);

    constructor() {
        console.log('RecipesListComponent created');
        this.recipeStore.load(1, 10).subscribe(() => {
            console.log('Recipes loaded:', this.recipeStore.items());
        });
    }

    addNewRecipe() {
        this.recipeStore.setCreateMode();
        this.recipeStore.clearCurrentItem();
        this.router.navigate(['../new'], { relativeTo: this.route });
    }

    existingRecipe(id: string) {
        console.log('Navigating to recipe with id:', id);
        this.recipeStore.setViewMode();
        this.router.navigate(['../', id], { relativeTo: this.route });
    }

    onPageChange(event: PageEvent): void {
        this.recipeStore.load(event.pageIndex + 1, event.pageSize).subscribe();
    }
}