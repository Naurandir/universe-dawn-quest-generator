import { TestBed } from '@angular/core/testing';

import { QuestGeneratorService } from './quest-generator.service';

describe('QuestGeneratorService', () => {
  let service: QuestGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
