import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
     {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
        children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        loadComponent: () => import('./pages/dashboard/overview/overview.component').then(m => m.OverviewComponent)
      },
      {
        path: 'recipes',
        loadComponent: () => import('./pages/dashboard/recipes/recipes.component').then(m => m.RecipesComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/dashboard/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  }
];
