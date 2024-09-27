import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestGeneratorStepDialogUpdateComponent } from './quest-generator-step-dialog-update.component';

describe('QuestGeneratorStepDialogUpdateComponent', () => {
  let component: QuestGeneratorStepDialogUpdateComponent;
  let fixture: ComponentFixture<QuestGeneratorStepDialogUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestGeneratorStepDialogUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestGeneratorStepDialogUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
