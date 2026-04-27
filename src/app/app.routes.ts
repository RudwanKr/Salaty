import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/daily-tracker/daily-tracker').then(m => m.DailyTracker)
  }
];