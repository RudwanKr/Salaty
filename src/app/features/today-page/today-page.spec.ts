import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayPage } from './today-page';

describe('TodayPage', () => {
  let component: TodayPage;
  let fixture: ComponentFixture<TodayPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
