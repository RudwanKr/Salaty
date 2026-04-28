import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'today',
    pathMatch: 'full'
  },
  {
    path: 'today',
    // Lazy load the standalone component
    loadComponent: () => import('./features/today-page/today-page')
      .then(m => m.TodayPage)
  },
  {
    path: 'history',
    loadComponent: () => import('./features/history-page/history-page')
      .then(m => m.HistoryPage)
  },
  {
    path: 'prayers',
    loadComponent: () => import('./features/prayers-page/prayers-page')
      .then(m => m.PrayersPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile-page/profile-page')
      .then(m => m.ProfilePage)
  },
  {
    path: '**', // Fallback for 404
    redirectTo: 'today'
  }
];