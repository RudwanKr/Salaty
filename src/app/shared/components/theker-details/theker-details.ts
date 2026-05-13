import { Component, input, output, signal, computed, effect } from '@angular/core';
import { AthkarCategory, Theker } from '../../../features/athkar-page/athkar-page';

@Component({
  selector: 'app-theker-details',
  imports: [],
  templateUrl: './theker-details.html',
  styleUrl: './theker-details.scss',
})
export class ThekerDetails {
  // ── Inputs ────────────────────────────────────────────────────
  category = input.required<AthkarCategory>();
  close = output<void>();

  // ── State ─────────────────────────────────────────────────────
  currentIndex = signal(0);
  repeatsDone = signal(0);
  cardClicked = signal(false); // drives tap animation

  // ── Computed ──────────────────────────────────────────────────
  currentTheker = computed<Theker>(() => this.category().athkar[this.currentIndex()]);
  total = computed(() => this.category().athkar.length);
  isLast = computed(() => this.currentIndex() === this.total() - 1);
  progress = computed(() => ((this.currentIndex() + 1) / this.total()) * 100);
  isFirst = computed(() => this.currentIndex() === 0);
  repeatsLeft = computed(() =>
    Math.max(0, this.currentTheker().repeats - this.repeatsDone())
  );
  allRepeatsDone = computed(() => this.repeatsDone() >= this.currentTheker().repeats);

  // Reset repeatsDone whenever the theker changes
  constructor() {
    effect(() => {
      this.currentIndex(); // track
      this.repeatsDone.set(0);
    });
  }

  // ── Actions ───────────────────────────────────────────────────
  countRepeat() {
    if (!this.allRepeatsDone()) {
      this.repeatsDone.update(v => v + 1);
    }
    // Trigger tap animation
    this.cardClicked.set(true);
    setTimeout(() => this.cardClicked.set(false), 350);
  }

  next() {
    if (!this.isLast()) {
      this.currentIndex.update(i => i + 1);
    } else {
      this.onClose();
    }
  }
  previous() {
    if (!this.isFirst()) {
      this.currentIndex.update(i => i - 1);
    } else {
      // All done → close
      this.onClose();
    }
  }

  onClose() {
    this.currentIndex.set(0);
    this.repeatsDone.set(0);
    this.close.emit();
  }
}
