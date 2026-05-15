import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  fullName        = signal('');
  email           = signal('');
  password        = signal('');
  confirmPassword = signal('');
  showPass        = signal(false);
  showConfirmPass = signal(false);
  loading         = signal(false);
  error           = signal('');
  success         = signal(false);

  private router = inject(Router);

  async register() {
    this.error.set('');

    if (!this.fullName() || !this.email() || !this.password() || !this.confirmPassword()) {
      this.error.set('يرجى تعبئة جميع الحقول');
      return;
    }
    if (this.password() !== this.confirmPassword()) {
      this.error.set('كلمتا المرور غير متطابقتين');
      return;
    }
    if (this.password().length < 8) {
      this.error.set('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    this.loading.set(true);
    await new Promise(r => setTimeout(r, 1400));
    this.loading.set(false);
    this.success.set(true);

    // After brief success flash → redirect to today
    await new Promise(r => setTimeout(r, 1000));
    this.router.navigate(['/today']);
  }
}
