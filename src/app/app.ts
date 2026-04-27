import { Component, signal } from '@angular/core';
import { PrayerCard } from "./shared/prayer-card/prayer-card";

@Component({
  selector: 'app-root',
  imports: [PrayerCard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Salaty');

  toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  }
}
