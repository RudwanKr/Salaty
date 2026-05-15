import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';

@Component({
  selector: 'app-reset-password-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.scss',
})
export class ResetPasswordPage {
  step            = signal<1 | 2 | 3>(1);
  email           = signal('');
  otp             = signal('');
  newPassword     = signal('');
  confirmPassword = signal('');
  showPass        = signal(false);
  showConfirmPass = signal(false);
  loading         = signal(false);
  error           = signal('');
  successMsg      = signal('');

  // Mock OTP that "gets sent"
  private mockOtp = '';

  private router = inject(Router);

  async sendOtp() {
    this.error.set('');
    if (!this.email()) { this.error.set('يرجى إدخال البريد الإلكتروني'); return; }

    this.loading.set(true);
    await new Promise(r => setTimeout(r, 1000));
    // Generate mock 6-digit OTP
    this.mockOtp = String(Math.floor(100000 + Math.random() * 900000));
    console.info(`[Mock OTP] ${this.mockOtp}`); // visible in browser console for testing
    this.loading.set(false);
    this.successMsg.set(`تم إرسال رمز التحقق إلى ${this.email()}`);
    this.step.set(2);
  }

  async verifyOtp() {
    this.error.set('');
    if (this.otp().length < 6) { this.error.set('يرجى إدخال رمز التحقق المكون من 6 أرقام'); return; }

    this.loading.set(true);
    await new Promise(r => setTimeout(r, 800));
    this.loading.set(false);

    if (this.otp() !== this.mockOtp) {
      this.error.set('رمز التحقق غير صحيح، يرجى المحاولة مرة أخرى');
      return;
    }
    this.successMsg.set('تم التحقق بنجاح');
    this.step.set(3);
  }

  async changePassword() {
    this.error.set('');
    if (!this.newPassword() || !this.confirmPassword()) {
      this.error.set('يرجى تعبئة جميع الحقول');
      return;
    }
    if (this.newPassword() !== this.confirmPassword()) {
      this.error.set('كلمتا المرور غير متطابقتين');
      return;
    }
    if (this.newPassword().length < 8) {
      this.error.set('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    this.loading.set(true);
    await new Promise(r => setTimeout(r, 1000));
    this.loading.set(false);
    this.successMsg.set('تم تغيير كلمة المرور بنجاح!');

    await new Promise(r => setTimeout(r, 1200));
    this.router.navigate(['/auth/login']);
  }

  goBack() {
    if (this.step() === 2) { this.step.set(1); this.otp.set(''); }
    else if (this.step() === 3) { this.step.set(2); }
    this.error.set('');
    this.successMsg.set('');
  }
}
