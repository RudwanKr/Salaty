import { Component } from '@angular/core';

@Component({
  selector: 'app-history-page',
  imports: [],
  templateUrl: './history-page.html',
  styleUrl: './history-page.scss',
})
export class HistoryPage {
  // 15 items — one per particle span; value used as CSS --i for staggered timing
  particles = Array.from({ length: 15 }, (_, i) => i);
}
