import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-prayer-card',
  imports: [],
  templateUrl: './prayer-card.html',
  styleUrl: './prayer-card.scss',
})
export class PrayerCard {
  // Inputs using the new Angular 17.x/18 signal inputs
  name = input.required<string>(); // e.g., 'Fajr' or 'الفجر'
  time = input<string>('00:00');

  // Internal state for the status (0: Not Prayed, 1: Late, 2: Alone, 3: Group)
  status = signal<number>(0);

  cycleStatus() {
    // Cycles 0 -> 3 -> 2 -> 1 -> 0
    this.status.update(current => (current + 1) % 4);
  }
}
