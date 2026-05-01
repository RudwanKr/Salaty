import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GoRoute } from '../../../shared/services/go-route';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  showAllMenu = false;

  menuItems = [
    { path: 'today', label: 'اليوم', icon: 'fa-solid fa-calendar-week' },
    { path: 'prayers', label: 'الصلاوات', icon: 'fa-solid fa-mosque' },
    { path: 'history', label: 'التاريخ', icon: 'fa-solid fa-place-of-worship' },
    { path: 'profile', label: 'الملف الشخصي', icon: 'fa-solid fa-user' },
  ];

  go = inject(GoRoute);
}
