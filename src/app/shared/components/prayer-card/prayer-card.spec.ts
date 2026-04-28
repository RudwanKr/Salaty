import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayerCard } from './prayer-card';

describe('PrayerCard', () => {
  let component: PrayerCard;
  let fixture: ComponentFixture<PrayerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrayerCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrayerCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
