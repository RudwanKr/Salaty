import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayersPage } from './prayers-page';

describe('PrayersPage', () => {
  let component: PrayersPage;
  let fixture: ComponentFixture<PrayersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrayersPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrayersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
