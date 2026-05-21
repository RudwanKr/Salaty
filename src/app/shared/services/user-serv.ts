import { inject, Injectable, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserServ {
  private router = inject(Router);
  
  // Reactively tracks whether the current route belongs to the admin panel
  isAdmin = signal<boolean>(false);

  constructor() {
    // Sync initially
    this.checkRoute(this.router.url);

    // Sync on every navigation end
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.checkRoute(e.urlAfterRedirects);
    });
  }

  private checkRoute(url: string) {
    this.isAdmin.set(url.startsWith('/admin'));
  }
}
