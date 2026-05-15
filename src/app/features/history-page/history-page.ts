import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrayerStatus } from '../../shared/components/prayer-card/prayer-card';

// ── Prayer Definitions ────────────────────────────────────────────────────────

export interface PrayerDef {
  id: string;
  name: string;
  type: 'main' | 'voluntary';
  color: string; // CSS variable suffix e.g. 'fajr'
}

export const MAIN_PRAYERS: PrayerDef[] = [
  { id: 'fajr',    name: 'الفجر',  type: 'main', color: 'fajr' },
  { id: 'dhuhr',   name: 'الظهر',  type: 'main', color: 'dhuhr' },
  { id: 'asr',     name: 'العصر',  type: 'main', color: 'asr' },
  { id: 'maghrib', name: 'المغرب', type: 'main', color: 'maghrib' },
  { id: 'isha',    name: 'العشاء', type: 'main', color: 'isha' },
];

export const VOLUNTARY_PRAYERS: PrayerDef[] = [
  { id: 'fajr-ratba',    name: 'راتبة الفجر',  type: 'voluntary', color: 'fajr' },
  { id: 'duha',          name: 'الضحى',        type: 'voluntary', color: 'dhuhr' },
  { id: 'dhuhr-ratba',   name: 'راتبة الظهر',  type: 'voluntary', color: 'dhuhr' },
  { id: 'maghrib-ratba', name: 'راتبة المغرب', type: 'voluntary', color: 'maghrib' },
  { id: 'isha-ratba',    name: 'راتبة العشاء', type: 'voluntary', color: 'isha' },
  { id: 'qiyam',         name: 'قيام الليل',  type: 'voluntary', color: 'isha' },
  { id: 'shaf-witr',     name: 'الشفع والوتر', type: 'voluntary', color: 'isha' },
];

// ── Data Types ────────────────────────────────────────────────────────────────

// dateStr (YYYY-MM-DD) → { prayerId → PrayerStatus }
export type DayHistory = Record<string, PrayerStatus>;
export type GlobalHistory = Record<string, DayHistory>;

export interface DotInfo {
  prayerId: string;
  name: string;
  status: PrayerStatus;
  colorClass: string; // CSS class for the dot
}

export interface CalendarDay {
  date: Date;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  mainDots: DotInfo[];
  voluntaryDots: DotInfo[];
  hasAnyData: boolean;
}

// ── Status Helper ─────────────────────────────────────────────────────────────

function statusColorClass(status: PrayerStatus, type: 'main' | 'voluntary'): string {
  if (!status) return 'dot-empty';
  const map: Record<string, string> = {
    'group':      'dot-group',
    'individual': 'dot-individual',
    'late':       'dot-late',
    'missed':     'dot-missed',
    'prayed':     'dot-prayed',
    'not-prayed': 'dot-not-prayed',
  };
  return map[status] ?? 'dot-empty';
}

const STORAGE_KEY = 'salaty_global_history';

// ── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-history-page',
  imports: [],
  templateUrl: './history-page.html',
  styleUrl: './history-page.scss',
})
export class HistoryPage implements OnInit {
  particles = Array.from({ length: 15 }, (_, i) => i);

  private router = inject(Router);

  // ── Raw history data ───────────────────────────────────────────────────────
  private historyData = signal<GlobalHistory>({});

  // ── Calendar state ─────────────────────────────────────────────────────────
  currentMonthDate = signal<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  currentMonthName = computed(() =>
    new Intl.DateTimeFormat('ar-SA', { month: 'long', year: 'numeric' }).format(
      this.currentMonthDate()
    )
  );

  weekDaysHeader = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س']; // Sun → Sat

  // ── Calendar days ──────────────────────────────────────────────────────────
  calendarDays = computed<CalendarDay[]>(() => {
    const history = this.historyData();
    const year    = this.currentMonthDate().getFullYear();
    const month   = this.currentMonthDate().getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);
    const todayStr = this.formatDate(new Date());

    const days: CalendarDay[] = [];

    const buildDots = (date: Date): { mainDots: DotInfo[]; voluntaryDots: DotInfo[] } => {
      const dateStr  = this.formatDate(date);
      const dayData  = history[dateStr] || {};

      const mainDots: DotInfo[] = MAIN_PRAYERS.map(p => ({
        prayerId:   p.id,
        name:       p.name,
        status:     dayData[p.id] ?? null,
        colorClass: statusColorClass(dayData[p.id] ?? null, 'main'),
      }));

      const voluntaryDots: DotInfo[] = VOLUNTARY_PRAYERS.map(p => ({
        prayerId:   p.id,
        name:       p.name,
        status:     dayData[p.id] ?? null,
        colorClass: statusColorClass(dayData[p.id] ?? null, 'voluntary'),
      }));

      return { mainDots, voluntaryDots };
    };

    // Padding before first day (Sun=0 … Sat=6)
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      const dateStr = this.formatDate(d);
      const { mainDots, voluntaryDots } = buildDots(d);
      days.push({
        date: d, dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        mainDots, voluntaryDots,
        hasAnyData: !!history[dateStr],
      });
    }

    // Days in month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const dateStr = this.formatDate(d);
      const { mainDots, voluntaryDots } = buildDots(d);
      days.push({
        date: d, dateStr,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        mainDots, voluntaryDots,
        hasAnyData: !!history[dateStr],
      });
    }

    // Padding after last day → ensure 6 rows (42 cells)
    const endPadding = 42 - days.length;
    for (let i = 1; i <= endPadding; i++) {
      const d = new Date(year, month + 1, i);
      const dateStr = this.formatDate(d);
      const { mainDots, voluntaryDots } = buildDots(d);
      days.push({
        date: d, dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        mainDots, voluntaryDots,
        hasAnyData: !!history[dateStr],
      });
    }

    return days;
  });

  // ── Statistics ─────────────────────────────────────────────────────────────

  private allDates = computed(() => Object.keys(this.historyData()).sort());

  /** Days where at least one prayer is recorded */
  totalTrackedDays = computed(() => this.allDates().length);

  /** First recorded date → how long user has been using the app */
  daysActive = computed(() => {
    const dates = this.allDates();
    if (!dates.length) return 0;
    const first = new Date(dates[0]);
    const today = new Date();
    const diff  = Math.floor((today.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
  });

  firstRecordedDate = computed(() => {
    const dates = this.allDates();
    if (!dates.length) return null;
    return new Date(dates[0]);
  });

  firstRecordedDateLabel = computed(() => {
    const d = this.firstRecordedDate();
    if (!d) return '—';
    return new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(d);
  });

  /** Current streak: consecutive days ending today or yesterday that have data */
  currentStreak = computed(() => {
    const history = this.historyData();
    const today   = new Date();
    let streak    = 0;
    let cursor    = new Date(today);

    while (true) {
      const key = this.formatDate(cursor);
      if (history[key]) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  });

  // ── Main prayer counts ─────────────────────────────────────────────────────

  private mainStatusCounts = computed(() => {
    const counts: Record<string, number> = { group: 0, individual: 0, late: 0, missed: 0 };
    const history = this.historyData();
    for (const dateStr of Object.keys(history)) {
      for (const prayer of MAIN_PRAYERS) {
        const s = history[dateStr]?.[prayer.id];
        if (s && counts[s] !== undefined) counts[s]++;
      }
    }
    return counts;
  });

  mainGroupCount      = computed(() => this.mainStatusCounts()['group']      || 0);
  mainIndividualCount = computed(() => this.mainStatusCounts()['individual'] || 0);
  mainLateCount       = computed(() => this.mainStatusCounts()['late']       || 0);
  mainMissedCount     = computed(() => this.mainStatusCounts()['missed']     || 0);
  mainTotalPrayed     = computed(() =>
    this.mainGroupCount() + this.mainIndividualCount() + this.mainLateCount()
  );
  mainTotalPossible   = computed(() => this.totalTrackedDays() * 5);

  mainCompletionPct   = computed(() => {
    const possible = this.mainTotalPossible();
    if (!possible) return 0;
    return Math.round((this.mainTotalPrayed() / possible) * 100);
  });

  /** Best main-prayer streak: consecutive days where ALL 5 main prayers are prayed (not missed) */
  bestMainStreak = computed(() => {
    const history  = this.historyData();
    const dates    = this.allDates();
    let maxStreak  = 0;
    let streak     = 0;

    for (const dateStr of dates) {
      const dayData = history[dateStr] || {};
      const allPrayed = MAIN_PRAYERS.every(p => {
        const s = dayData[p.id];
        return s && s !== 'missed';
      });
      if (allPrayed) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
    }
    return maxStreak;
  });

  // ── Voluntary prayer counts ────────────────────────────────────────────────

  voluntaryPrayedCount    = computed(() => {
    let count = 0;
    const history = this.historyData();
    for (const dateStr of Object.keys(history)) {
      for (const prayer of VOLUNTARY_PRAYERS) {
        if (history[dateStr]?.[prayer.id] === 'prayed') count++;
      }
    }
    return count;
  });

  voluntaryNotPrayedCount = computed(() => {
    let count = 0;
    const history = this.historyData();
    for (const dateStr of Object.keys(history)) {
      for (const prayer of VOLUNTARY_PRAYERS) {
        if (history[dateStr]?.[prayer.id] === 'not-prayed') count++;
      }
    }
    return count;
  });

  voluntaryTotalPossible  = computed(() => this.totalTrackedDays() * 7);

  voluntaryCompletionPct  = computed(() => {
    const possible = this.voluntaryTotalPossible();
    if (!possible) return 0;
    return Math.round((this.voluntaryPrayedCount() / possible) * 100);
  });

  /** Best voluntary streak: consecutive days where ALL 7 voluntary prayers prayed */
  bestVoluntaryStreak = computed(() => {
    const history  = this.historyData();
    const dates    = this.allDates();
    let maxStreak  = 0;
    let streak     = 0;

    for (const dateStr of dates) {
      const dayData   = history[dateStr] || {};
      const allPrayed = VOLUNTARY_PRAYERS.every(p => dayData[p.id] === 'prayed');
      if (allPrayed) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
    }
    return maxStreak;
  });

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  ngOnInit() {
    this.loadData();
  }

  // ── Calendar navigation ────────────────────────────────────────────────────

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

  goToToday() {
    this.currentMonthDate.set(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );
  }

  // ── Day click → navigate to today page ────────────────────────────────────

  goToDay(day: CalendarDay) {
    this.router.navigate(['/today'], { queryParams: { date: day.dateStr } });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  formatDate(d: Date): string {
    const year  = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day   = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isCurrentMonth(): boolean {
    const now = new Date();
    const cur = this.currentMonthDate();
    return now.getFullYear() === cur.getFullYear() && now.getMonth() === cur.getMonth();
  }

  // ── Mock data generation ───────────────────────────────────────────────────

  private loadData() {
    // const stored = localStorage.getItem(STORAGE_KEY);
    // if (stored) {
    //   this.historyData.set(JSON.parse(stored));
    //   return;
    // }
    this.generateMockData();
  }

  private generateMockData() {
    const data: GlobalHistory = {};
    const today     = new Date();
    const startDate = new Date(today.getFullYear(), 0, 1); // Jan 1 of current year
    const mainStatusPool: PrayerStatus[]      = ['group', 'group', 'group', 'individual', 'late', 'missed'];
    const voluntaryStatusPool: PrayerStatus[] = ['prayed', 'prayed', 'not-prayed'];

    let cursor = new Date(startDate);
    while (cursor <= today) {
      // 90% chance the user tracked this day
      if (Math.random() < 0.9) {
        const dateStr: string = this.formatDate(cursor);
        data[dateStr] = {};
        for (const p of MAIN_PRAYERS) {
          data[dateStr][p.id] = mainStatusPool[Math.floor(Math.random() * mainStatusPool.length)];
        }
        for (const p of VOLUNTARY_PRAYERS) {
          data[dateStr][p.id] = voluntaryStatusPool[Math.floor(Math.random() * voluntaryStatusPool.length)];
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    this.historyData.set(data);
  }
}
