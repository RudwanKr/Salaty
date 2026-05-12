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
    path: 'athkar',
    loadComponent: () => import('./features/athkar-page/athkar-page')
      .then(m => m.AthkarPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile-page/profile-page')
      .then(m => m.ProfilePage)
  },
  {
    path: 'prayer/:id',
    loadComponent: () => import('./shared/components/prayer-detail/prayer-detail')
      .then(m => m.PrayerDetail)
  },
  {
    path: '**', // Fallback for 404
    redirectTo: 'today'
  }
];