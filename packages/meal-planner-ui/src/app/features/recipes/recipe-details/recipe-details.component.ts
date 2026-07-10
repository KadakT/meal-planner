import { Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { RecipeFormComponent } from "./recipe-form/recipe-form.component";
import { RecipeStore } from "../data-access/recipe.store";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { ButtonsComponent } from "@components/index";
import { ButtonSize, ButtonVariant } from "app/shared/constants/ui/button.constants";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'app-recipe-details',
    standalone: true,
    imports: [TranslateModule, 
                RecipeFormComponent, 
                RecipeDetailComponent, 
                ButtonsComponent,
                MatIcon],
    template: `
    <div class="title">
        <app-button (click)="backToList()" 
                    [btnLabel]="'BUTTONS.BACK_TO_LIST' | translate" 
                    [btnVariant]="ButtonVariant.Tertiary"
                    [btnSize]="ButtonSize.Small">
            <mat-icon>arrow_back</mat-icon>
        </app-button>
        <h1>{{ recipeStore.currentItem()?.name ? recipeStore.currentItem()?.name : ('PAGES.RECIPES_LIST.TITLE_NEW' | translate) }}</h1>
    </div>

        @if(recipeStore.isEditMode() || recipeStore.isCreateMode()) {
            <app-recipe-form></app-recipe-form>
        }@else {
            <app-recipe-detail></app-recipe-detail>
        }
    `
})

export class RecipeDetailsComponent {
    id: string | null = null;
    isNew = signal(true);

    readonly recipeStore = inject(RecipeStore);
    protected readonly ButtonVariant = ButtonVariant;
    protected readonly ButtonSize = ButtonSize;

    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private destroyRef = inject(DestroyRef);

    constructor() {
        this.handleRouteChanges();
        console.log('RecipeDetailsComponent created');
    }

    backToList() {
        this.router.navigate(['../list'], { relativeTo: this.route });
    }

    private navigateToNew(): void {
        this.router.navigate(['../new'], { relativeTo: this.route });
    }

    private handleRouteChanges(): void {
        this.route.paramMap
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(params => {
                this.id = params.get('id');

                if (this.id) {
                    this.loadExistingRecipe(this.id);                    
                    return;
                }

        });
    }

    private loadExistingRecipe(id: string): void {
        this.isNew.set(false);
        this.recipeStore.loadById(id).subscribe(() =>{
            console.log('Recipe loaded:', this.recipeStore.currentItem());
        });
        console.log(`Navigated to recipe with ID: ${this.id}`);
    }
}