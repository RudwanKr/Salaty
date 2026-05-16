import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayerDetails } from './prayer-details';

describe('PrayerDetails', () => {
  let component: PrayerDetails;
  let fixture: ComponentFixture<PrayerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrayerDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrayerDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
