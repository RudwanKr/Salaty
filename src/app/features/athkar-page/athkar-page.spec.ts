import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthkarPage } from './athkar-page';

describe('AthkarPage', () => {
  let component: AthkarPage;
  let fixture: ComponentFixture<AthkarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthkarPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthkarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
