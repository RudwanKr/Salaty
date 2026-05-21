import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GoRoute } from '../../../shared/services/go-route';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faCalendarDay, 
  faScroll, 
  faPlaceOfWorship, 
  faUser,
  faGauge,
  faUsers,
  faEnvelope,
  faUserShield
} from '@fortawesome/free-solid-svg-icons';
import { UserServ } from '../../../shared/services/user-serv';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  private userServ = inject(UserServ);
  go = inject(GoRoute);

  userMenuItems = [
    { path: '/today', label: 'اليوم', icon: faCalendarDay },
    { path: '/athkar', label: 'الأذكار', icon: faScroll },
    { path: '/history', label: 'التاريخ', icon: faPlaceOfWorship },
    { path: '/profile', label: 'الملف الشخصي', icon: faUser },
  ];

  adminMenuItems = [
    { path: '/admin/home', label: 'الرئيسية', icon: faGauge },
    { path: '/admin/users', label: 'المستخدمين', icon: faUsers },
    { path: '/admin/users-messages', label: 'الرسائل', icon: faEnvelope },
    { path: '/admin/profile-page', label: 'الملف الشخصي', icon: faUserShield },
  ];

  // Dynamic reactive menu items computed from the active route context
  menuItems = computed(() => {
    return this.userServ.isAdmin() ? this.adminMenuItems : this.userMenuItems;
  });
}
