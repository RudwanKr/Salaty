import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThekerDetails } from './theker-details';

describe('ThekerDetails', () => {
  let component: ThekerDetails;
  let fixture: ComponentFixture<ThekerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThekerDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThekerDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
