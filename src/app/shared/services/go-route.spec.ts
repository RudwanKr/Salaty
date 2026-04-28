import { TestBed } from '@angular/core/testing';

import { GoRoute } from './go-route';

describe('GoRoute', () => {
  let service: GoRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoRoute);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
