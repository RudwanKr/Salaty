import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayerHistory } from './prayer-history';

describe('PrayerHistory', () => {
  let component: PrayerHistory;
  let fixture: ComponentFixture<PrayerHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrayerHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrayerHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
