import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-page',
  imports: [],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
    particles = Array.from({ length: 15 }, (_, i) => i);
}
