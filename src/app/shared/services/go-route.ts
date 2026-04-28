import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GoRoute {
  private router = inject(Router);

  to(url: string, data: any | null = null) {
    this.router.navigateByUrl(url, { state: data });
  }

  toOff(url: string) {
    this.router.navigateByUrl(url, { replaceUrl: true });
  }

  toOffByData(url: string, data: any) {
    this.router.navigateByUrl(url, { replaceUrl: true, state: data });
  }

  and(url: string, data: any | null = null) {
    const currentUrl = this.router.url.endsWith('/')
      ? this.router.url.slice(0, -1)
      : this.router.url;
    const newUrl = url.startsWith('/') ? url : `/${url}`;
    this.router.navigateByUrl(`${currentUrl}${newUrl}`, { state: data });
  }

  back() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigateByUrl('/'); // يمكنك تغيير المسار الافتراضي هنا
    }
  }

  getParams<T>(key: string): T | null {
    return this.router.getCurrentNavigation()?.extras.state?.[key] ?? null;
  }
}
