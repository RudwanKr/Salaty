import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'today',
    pathMatch: 'full'
  },
  // ── Auth (no nav-bar layout) ───────────────────────────────────────────────
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth-layout/auth-layout')
      .then(m => m.AuthLayout),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login-page/login-page')
          .then(m => m.LoginPage)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register-page/register-page')
          .then(m => m.RegisterPage)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/reset-password-page/reset-password-page')
          .then(m => m.ResetPasswordPage)
      },
    ]
  },
   {
    path: 'admin',
    loadComponent: () => import('./features/admin-panel/admin-layout/admin-layout')
      .then(m => m.AdminLayout),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./features/admin-panel/home-page/home-page')
          .then(m => m.HomePage)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin-panel/users-page/users-page')
          .then(m => m.UsersPage)
      },
      {
        path: 'user-details/:id',
        loadComponent: () => import('./features/admin-panel/user-details/user-details')
          .then(m => m.UserDetails)
      },
      {
        path: 'prayer-details/:name',
        loadComponent: () => import('./features/admin-panel/prayer-details/prayer-details')
          .then(m => m.PrayerDetails)
      },
      {
        path: 'profile-page',
        loadComponent: () => import('./features/admin-panel/profile-page/profile-page')
          .then(m => m.ProfilePage)
      },
    ]
  },
  // ── Main app ──────────────────────────────────────────────────────────────
  {
    path: 'today',
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
    path: '**',
    redirectTo: 'today'
  }
];