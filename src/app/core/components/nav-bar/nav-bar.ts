import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GoRoute } from '../../../shared/services/go-route';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarDay, faScroll, faPlaceOfWorship, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  showAllMenu = false;

  menuItems = [
    { path: 'today', label: 'اليوم', icon: faCalendarDay },
    { path: 'athkar', label: 'الأذكار', icon: faScroll },
    { path: 'history', label: 'التاريخ', icon: faPlaceOfWorship },
    { path: 'profile', label: 'الملف الشخصي', icon: faUser },
  ];

  go = inject(GoRoute);
}
