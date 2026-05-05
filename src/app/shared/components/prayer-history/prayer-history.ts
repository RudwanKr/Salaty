import { Component, input, signal, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrayerStatus, PrayerType } from '../prayer-card/prayer-card';

interface CalendarDay {
  date: Date;
  status: PrayerStatus;
  isCurrentMonth: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-prayer-history',
  imports: [],
  templateUrl: './prayer-history.html',
  styleUrl: './prayer-history.scss',
})
export class PrayerHistory implements OnInit {
  prayerId = input.required<string>();
  type = input<PrayerType>('main');

  private router = inject(Router);

  // ── Data ────────────────────────────────────────────────────────
  // A map of YYYY-MM-DD -> PrayerStatus
  private historyData = signal<Record<string, PrayerStatus>>({});

  // ── Calendar State ──────────────────────────────────────────────
  currentMonthDate = signal<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  currentMonthName = computed(() => {
    return new Intl.DateTimeFormat('ar-SA', { month: 'long', year: 'numeric' }).format(this.currentMonthDate());
  });

  weekDaysHeader = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س']; // Sun to Sat

  calendarDays = computed<CalendarDay[]>(() => {
    const year = this.currentMonthDate().getFullYear();
    const month = this.currentMonthDate().getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: CalendarDay[] = [];
    const todayStr = this.formatDate(new Date());

    // Padding before first day of month (Sun=0...Sat=6)
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({
        date: d,
        status: this.historyData()[this.formatDate(d)] || null,
        isCurrentMonth: false,
        isToday: this.formatDate(d) === todayStr
      });
    }

    // Days in month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        status: this.historyData()[this.formatDate(d)] || null,
        isCurrentMonth: true,
        isToday: this.formatDate(d) === todayStr
      });
    }

    // Padding after last day of month
    const endPadding = 42 - days.length; // Ensure 6 rows
    for (let i = 1; i <= endPadding; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        status: this.historyData()[this.formatDate(d)] || null,
        isCurrentMonth: false,
        isToday: this.formatDate(d) === todayStr
      });
    }

    return days;
  });

  // ── Statistics ──────────────────────────────────────────────────
  totalTrackedDays = computed(() => Object.keys(this.historyData()).length);

  statusCounts = computed(() => {
    const counts: Record<string, number> = {};
    Object.values(this.historyData()).forEach(s => {
      if (s) {
        counts[s] = (counts[s] || 0) + 1;
      }
    });
    return counts;
  });

  bestStreak = computed(() => {
    const targetStatus = this.type() === 'main' ? 'group' : 'prayed';
    const sortedDates = Object.keys(this.historyData()).sort(); // YYYY-MM-DD
    
    let maxStreak = 0;
    let currentStreak = 0;

    for (const dateStr of sortedDates) {
      if (this.historyData()[dateStr] === targetStatus) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  });

  ngOnInit() {
    this.loadMockData();
  }

  // ── Navigation ──────────────────────────────────────────────────
  prevMonth() {
    const d = new Date(this.currentMonthDate());
    d.setMonth(d.getMonth() - 1);
    this.currentMonthDate.set(d);
  }

  nextMonth() {
    const d = new Date(this.currentMonthDate());
    d.setMonth(d.getMonth() + 1);
    this.currentMonthDate.set(d);
  }

  goToToday(day: CalendarDay) {
    // Navigate to /today with ?date=YYYY-MM-DD
    this.router.navigate(['/today'], { queryParams: { date: this.formatDate(day.date) } });
  }

  // ── Helpers ─────────────────────────────────────────────────────
  private formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private loadMockData() {
    const storageKey = `salaty_history_${this.prayerId()}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      this.historyData.set(JSON.parse(stored));
      return;
    }

    // Generate mock data from Jan 1st of current year to today
    const data: Record<string, PrayerStatus> = {};
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 0, 1);
    
    let current = new Date(startDate);
    const mainStatuses: PrayerStatus[] = ['group', 'group', 'group', 'individual', 'late', 'missed']; // Weighted
    const volStatuses: PrayerStatus[] = ['prayed', 'prayed', 'not-prayed'];

    while (current <= today) {
      const dateStr = this.formatDate(current);
      // 80% chance of being tracked
      if (Math.random() < 0.8) {
        if (this.type() === 'main') {
          data[dateStr] = mainStatuses[Math.floor(Math.random() * mainStatuses.length)];
        } else {
          data[dateStr] = volStatuses[Math.floor(Math.random() * volStatuses.length)];
        }
      }
      current.setDate(current.getDate() + 1);
    }

    localStorage.setItem(storageKey, JSON.stringify(data));
    this.historyData.set(data);
  }

  getStatusIcon(status: PrayerStatus): string {
    if (!status) return '';
    const map: Record<string, string> = {
      'group': 'fa-solid fa-people-group',
      'individual': 'fa-solid fa-person-praying',
      'late': 'fa-solid fa-clock-rotate-left',
      'missed': 'fa-solid fa-circle-xmark',
      'prayed': 'fa-solid fa-circle-check',
      'not-prayed': 'fa-solid fa-circle-xmark'
    };
    return map[status] || '';
  }

  getStatusClass(status: PrayerStatus): string {
    if (!status) return 'empty';
    return status;
  }
}
