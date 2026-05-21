import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  imports: [FormsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
  private router = inject(Router);

  // Profile state (excluding username as per user's requirement)
  userEmail = signal('admin@salaty.com');
  selectedAvatar = signal('av1.png');

  // Dialog state
  activeDialog = signal<'avatar' | 'password' | null>(null);

  // Password Reset Flow State
  passwordStep = signal<1 | 2 | 3>(1);
  otpInput = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  // Avatars
  avatars = ['av1.png', 'av2.png', 'av3.png', 'av4.png', 'av5.png', 'av6.png'];

  openDialog(dialog: 'avatar' | 'password') {
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
    // Simulated save action
    alert('تم حفظ تعديلات البريد الإلكتروني بنجاح!');
    console.log('Admin Profile Saved. Email:', this.userEmail());
  }

  // --- Password Reset Flow ---
  sendOtp() {
    // Simulate sending OTP
    alert('تم إرسال رمز التحقق إلى بريدك الإلكتروني المسجل.');
    this.passwordStep.set(2);
  }

  verifyOtp() {
    if (this.otpInput().length < 4) {
      alert('الرجاء إدخال رمز تحقق صحيح (مكون من 4 أرقام على الأقل)');
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

  logout() {
    // Navigates back to user login
    this.router.navigate(['/auth/login']);
  }
}

