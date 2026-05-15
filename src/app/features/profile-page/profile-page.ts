import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  imports: [FormsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
  particles = Array.from({ length: 15 }, (_, i) => i);

  // Profile state
  userName = signal('مستخدم صلاتي');
  userEmail = signal('user@example.com');
  selectedAvatar = signal('av1.png');

  // Dialog state
  activeDialog = signal<'avatar' | 'support' | 'rate' | 'message' | 'password' | null>(null);

  // Password Reset Flow State
  passwordStep = signal<1 | 2 | 3>(1);
  otpInput = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  // PWA Video state
  pwaOS = signal<'android' | 'ios' | 'windows'>('android');

  // Stats (Mock data)
  averageRating = signal(4.8);
  totalRatings = signal(1254);

  // Rate state
  userRating = signal(5);

  // Message state
  adminMessage = signal('');

  // Avatars
  avatars = ['av1.png', 'av2.png', 'av3.png', 'av4.png', 'av5.png', 'av6.png'];


  openDialog(dialog: 'avatar' | 'support' | 'rate' | 'message' | 'password') {
    this.activeDialog.set(dialog);
    if (dialog === 'password') {
      this.passwordStep.set(1);
      this.otpInput.set('');
      this.newPassword.set('');
      this.confirmPassword.set('');
    }
  }

  closeDialog() {
    this.activeDialog.set(null);
  }

  setAvatar(av: string) {
    this.selectedAvatar.set(av);
    this.closeDialog();
  }

  saveProfile() {
    // In a real app, send to backend
    console.log('Profile saved');
  }

  // --- Password Reset Flow ---
  sendOtp() {
    // Simulate sending OTP
    alert('تم إرسال رمز التحقق إلى بريدك الإلكتروني.');
    this.passwordStep.set(2);
  }

  verifyOtp() {
    if (this.otpInput().length < 4) {
      alert('الرجاء إدخال رمز صحيح');
      return;
    }
    // Simulate verification
    this.passwordStep.set(3);
  }

  changePassword() {
    if (this.newPassword() !== this.confirmPassword()) {
      alert('كلمتا المرور غير متطابقتين');
      return;
    }
    if (this.newPassword().length < 6) {
      alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    alert('تم تغيير كلمة المرور بنجاح!');
    this.closeDialog();
  }

  shareApp() {
    if (navigator.share) {
      navigator.share({
        title: 'تطبيق صلاتي',
        text: 'حمل تطبيق صلاتي لمتابعة صلواتك وأذكارك',
        url: window.location.origin
      }).catch(err => console.error(err));
    } else {
      alert('ميزة المشاركة غير مدعومة في متصفحك');
    }
  }

  sendSupport() {
    alert('تم الانتقال لصفحة الدعم، شكراً لك!');
    this.closeDialog();
  }

  submitRating() {
    alert(`تم التقييم بـ ${this.userRating()} نجوم`);
    this.closeDialog();
  }

  sendMessage() {
    if(!this.adminMessage()) return;
    alert('تم إرسال رسالتك للإدارة بنجاح');
    this.adminMessage.set('');
    this.closeDialog();
  }

  setRate(r: number) {
    this.userRating.set(r);
  }
}
