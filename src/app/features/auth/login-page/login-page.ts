import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  email    = signal('');
  password = signal('');
  showPass = signal(false);
  loading  = signal(false);
  error    = signal('');

  private router = inject(Router);

  async login() {
    this.error.set('');
    if (!this.email() || !this.password()) {
      this.error.set('يرجى تعبئة جميع الحقول');
      return;
    }
    this.loading.set(true);
    // Mock: simulate API call delay
    await new Promise(r => setTimeout(r, 1200));
    this.loading.set(false);
    // Mock: redirect admin emails to the admin panel home page, otherwise today page
    if (this.email().toLowerCase().includes('admin')) {
      this.router.navigate(['/admin/home']);
    } else {
      this.router.navigate(['/today']);
    }
  }
}
