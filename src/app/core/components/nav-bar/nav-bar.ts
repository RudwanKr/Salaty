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
    { path: 'Today', label: 'اليوم', icon: 'fa-duotone fa-solid fa-calendar-week' },
    { path: 'Prayers', label: 'الصلاوات', icon: 'fa-duotone fa-solid fa-calendar-week' },
    { path: 'History', label: 'التاريخ', icon: 'fa-duotone fa-solid fa-calendar-week' },
    { path: 'profile', label: 'الملف الشخصي', icon: 'fa-duotone fa-user' },
  ];

  go = inject(GoRoute);
}
