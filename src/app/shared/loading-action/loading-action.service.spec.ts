import { TestBed } from '@angular/core/testing';

import { LoadingActionService } from './loading-action.service';

describe('LoadingActionService', () => {
  let service: LoadingActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
