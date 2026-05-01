import { Component, input, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

export type PrayerStatus =
  | 'group' | 'individual' | 'late' | 'missed'  // main
  | 'prayed' | 'not-prayed'                       // voluntary
  | null;

export type PrayerType = 'main' | 'voluntary';

export interface StatusOption {
  value: PrayerStatus;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-prayer-card',
  imports: [],
  templateUrl: './prayer-card.html',
  styleUrl: './prayer-card.scss',
})
export class PrayerCard {
  name      = input.required<string>();
  time      = input<string>('');
  prayerId  = input.required<string>();
  type      = input<PrayerType>('main');

  status     = signal<PrayerStatus>(null);
  dialogOpen = signal(false);

  private router = inject(Router);

  readonly mainOptions: StatusOption[] = [
    { value: 'group',      label: 'في المسجد (جماعة)', icon: 'fa-solid fa-people-group' },
    { value: 'individual', label: 'منفرد',              icon: 'fa-solid fa-person-praying' },
    { value: 'late',       label: 'قضاء (متأخر)',       icon: 'fa-solid fa-clock-rotate-left' },
    { value: 'missed',     label: 'لم أصلِ',            icon: 'fa-solid fa-circle-xmark' },
  ];

  readonly voluntaryOptions: StatusOption[] = [
    { value: 'prayed',     label: 'صليت',   icon: 'fa-solid fa-circle-check' },
    { value: 'not-prayed', label: 'لم أصلِ', icon: 'fa-solid fa-circle-xmark' },
  ];

  get options(): StatusOption[] {
    return this.type() === 'voluntary' ? this.voluntaryOptions : this.mainOptions;
  }

  get statusLabel(): string {
    const s = this.status();
    if (!s) return 'اختر الحالة';
    const all = [...this.mainOptions, ...this.voluntaryOptions];
    return all.find(o => o.value === s)?.label ?? '';
  }

  get statusIcon(): string {
    const s = this.status();
    if (!s) return 'fa-solid fa-circle-dot';
    const all = [...this.mainOptions, ...this.voluntaryOptions];
    return all.find(o => o.value === s)?.icon ?? '';
  }

  openDialog()              { this.dialogOpen.set(true); }
  closeDialog()             { this.dialogOpen.set(false); }
  setStatus(v: PrayerStatus) { this.status.set(v); this.closeDialog(); }

  goToDetail(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/prayer', this.prayerId()]);
  }
}
