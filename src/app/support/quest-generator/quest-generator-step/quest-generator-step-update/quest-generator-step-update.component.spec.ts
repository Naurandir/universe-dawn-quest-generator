import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestGeneratorStepUpdateComponent } from './quest-generator-step-update.component';

describe('QuestGeneratorStepUpdateComponent', () => {
  let component: QuestGeneratorStepUpdateComponent;
  let fixture: ComponentFixture<QuestGeneratorStepUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestGeneratorStepUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestGeneratorStepUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
