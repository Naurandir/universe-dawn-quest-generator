import { TestBed } from '@angular/core/testing';

import { CoordinatesWithCopyService } from './coordinates-with-copy.service';

describe('CoordinatesWithCopyService', () => {
  let service: CoordinatesWithCopyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoordinatesWithCopyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
