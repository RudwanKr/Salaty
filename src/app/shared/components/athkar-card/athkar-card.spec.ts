import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthkarCard } from './athkar-card';

describe('AthkarCard', () => {
  let component: AthkarCard;
  let fixture: ComponentFixture<AthkarCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthkarCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthkarCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
