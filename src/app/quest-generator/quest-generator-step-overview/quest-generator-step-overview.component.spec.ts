import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestGeneratorStepOverviewComponent } from './quest-generator-step-overview.component';

describe('QuestGeneratorStepOverviewComponent', () => {
  let component: QuestGeneratorStepOverviewComponent;
  let fixture: ComponentFixture<QuestGeneratorStepOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestGeneratorStepOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestGeneratorStepOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
