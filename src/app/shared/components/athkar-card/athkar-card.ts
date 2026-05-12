import { Component, input, output } from '@angular/core';
import { AthkarCategory } from '../../../features/athkar-page/athkar-page';

@Component({
  selector: 'app-athkar-card',
  imports: [],
  templateUrl: './athkar-card.html',
  styleUrl: './athkar-card.scss',
})
export class AthkarCard {
  category = input.required<AthkarCategory>();
  cardClick = output<AthkarCategory>();

  onClick() {
    this.cardClick.emit(this.category());
  }
}
