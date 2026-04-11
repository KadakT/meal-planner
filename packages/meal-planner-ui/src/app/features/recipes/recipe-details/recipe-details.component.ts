import { Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'app-recipe-details',
    standalone: true,
    imports: [ TranslateModule],
    template: `
        <h1>{{ isNew() ? ('PAGES.RECIPES_LIST.TITLE_NEW' | translate) : 'Name' }}</h1>
    `
})

export class RecipeDetailsComponent {
    id: string | null = null;
    isNew = signal(true);

    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private destroyRef = inject(DestroyRef);

    constructor() {
        this.handleRouteChanges();
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
        console.log(`Navigated to recipe with ID: ${this.id}`);
    }
}