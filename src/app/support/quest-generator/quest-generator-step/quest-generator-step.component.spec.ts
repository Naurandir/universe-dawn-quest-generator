import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestGeneratorStepComponent } from './quest-generator-step.component';

describe('QuestGeneratorStepComponent', () => {
  let component: QuestGeneratorStepComponent;
  let fixture: ComponentFixture<QuestGeneratorStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestGeneratorStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestGeneratorStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
