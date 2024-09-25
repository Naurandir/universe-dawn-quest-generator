import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestGeneratorStepRewardUpdateComponent } from './quest-generator-step-reward-update.component';

describe('QuestGeneratorStepRewardUpdateComponent', () => {
  let component: QuestGeneratorStepRewardUpdateComponent;
  let fixture: ComponentFixture<QuestGeneratorStepRewardUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestGeneratorStepRewardUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestGeneratorStepRewardUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
