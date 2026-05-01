import { Component } from '@angular/core';

@Component({
  selector: 'app-today-page',
  imports: [],
  templateUrl: './today-page.html',
  styleUrl: './today-page.scss',
})
export class TodayPage {
  particles = Array.from({ length: 15 }, (_, i) => i);
}
