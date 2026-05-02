import { Component, signal, computed } from '@angular/core';
import { PrayerCard } from '../../shared/components/prayer-card/prayer-card';

interface Prayer {
  id: string;
  name: string;
  time: string;
  type: 'main' | 'voluntary';
  color?: string;
}

interface PrayerCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  colorClass: string;
  prayers: Prayer[];
  open: ReturnType<typeof signal<boolean>>;
}

export interface WeekDay {
  date: Date;
  dayNum: number;   // 1–31 (day of month)
  dayName: string;  // e.g. «الجمعة» — from browser Intl, always accurate
  isToday: boolean;
  isSelected: boolean;
}

// Arabic short day names via the browser's Intl API — fully dynamic,
// handles any month/year boundary automatically (no hardcoded arrays needed).
const dayFmt = new Intl.DateTimeFormat('ar-SA', { weekday: 'short' });

@Component({
  selector: 'app-today-page',
  imports: [PrayerCard],
  templateUrl: './today-page.html',
  styleUrl: './today-page.scss',
})
export class TodayPage {
  particles = Array.from({ length: 15 }, (_, i) => i);

  // ── Week Days ──────────────────────────────────────────────────
  private readonly _today = new Date();
  selectedDate = signal<Date>(new Date());
  baseDate = signal<Date>(new Date()); // The week currently in view

  selectedDayName = computed(() => dayFmt.format(this.selectedDate()));
  selectedDayDate = computed(() =>
    new Intl.DateTimeFormat('ar-SA-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(this.selectedDate())
  );

  isNotToday = computed(() => this.selectedDate().toDateString() !== this._today.toDateString());

  goToToday() {
    this.selectedDate.set(new Date(this._today));
    this.baseDate.set(new Date(this._today));
  }

  nextWeek() {
    const next = new Date(this.baseDate());
    next.setDate(next.getDate() + 7);
    this.baseDate.set(next);
  }

  prevWeek() {
    const prev = new Date(this.baseDate());
    prev.setDate(prev.getDate() - 7);
    this.baseDate.set(prev);
  }

  /**
   * Computes the 7-day week (Sat → Fri, Arab convention) that contains the baseDate.
   */
  weekDays = computed<WeekDay[]>(() => {
    const base      = this.baseDate();
    const today     = this._today;
    const selected  = this.selectedDate();

    // Distance from Saturday: Sun=1, Mon=2, …, Sat=0
    const dow        = base.getDay();           // 0=Sun … 6=Sat
    const diffToSat  = (dow + 1) % 7;           // days since last Saturday
    const weekStart  = new Date(base);
    weekStart.setDate(base.getDate() - diffToSat);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);       // Date handles month rollover

      return {
        date:       d,
        dayNum:     d.getDate(),
        dayName:    dayFmt.format(d),
        isToday:    d.toDateString() === today.toDateString(),
        isSelected: d.toDateString() === selected.toDateString(),
      };
    });
  });

  selectDay(day: WeekDay) {
    this.selectedDate.set(new Date(day.date));
  }

  // ── Prayer Categories ──────────────────────────────────────────
  categories: PrayerCategory[] = [
    {
      id: 'main',
      title: 'صلوات الفرض',
      subtitle: '5 صلوات',
      icon: 'fa-solid fa-star-and-crescent',
      colorClass: 'cat-main',
      open: signal(true),
      prayers: [
        { id: 'fajr',    name: 'الفجر',  time: '04:30', type: 'main', color: 'fajr' },
        { id: 'dhuhr',   name: 'الظهر',  time: '12:15', type: 'main', color: 'dhuhr' },
        { id: 'asr',     name: 'العصر',  time: '15:45', type: 'main', color: 'asr' },
        { id: 'maghrib', name: 'المغرب', time: '18:30', type: 'main', color: 'maghrib' },
        { id: 'isha',    name: 'العشاء', time: '20:00', type: 'main', color: 'isha' },
      ],
    },
    {
      id: 'voluntary',
      title: 'النوافل',
      subtitle: '7 نوافل',
      icon: 'fa-solid fa-hands-praying',
      colorClass: 'cat-voluntary',
      open: signal(false),
      prayers: [
        { id: 'fajr-ratba', name: 'راتبة الفجر', time: 'قبل الفجر', type: 'voluntary', color: 'fajr' },
        { id: 'duha', name: 'الضحى', time: 'بعد الشروق', type: 'voluntary', color: 'dhuhr' },
        { id: 'dhuhr-ratba', name: 'راتبة الظهر', time: 'قبل وبعد الظهر', type: 'voluntary', color: 'dhuhr' },
        { id: 'maghrib-ratba', name: 'راتبة المغرب', time: 'بعد المغرب', type: 'voluntary', color: 'maghrib' },
        { id: 'isha-ratba', name: 'راتبة العشاء', time: 'بعد العشاء', type: 'voluntary', color: 'isha' },
        { id: 'qiyam', name: 'قيام الليل', time: 'بعد العشاء', type: 'voluntary', color: 'isha' },
        { id: 'shaf-witr', name: 'الشفع والوتر', time: 'آخر الليل',  type: 'voluntary', color: 'isha' },
      ],
    },
  ];

  toggle(cat: PrayerCategory) {
    cat.open.update(v => !v);
  }
}
