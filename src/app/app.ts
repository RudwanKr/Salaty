import { Component, signal } from '@angular/core';
import { NavBar } from "./core/components/nav-bar/nav-bar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [NavBar, RouterOutlet],
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
