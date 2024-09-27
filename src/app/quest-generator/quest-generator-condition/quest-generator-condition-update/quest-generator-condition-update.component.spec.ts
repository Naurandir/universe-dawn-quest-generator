import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestGeneratorConditionUpdateComponent } from './quest-generator-condition-update.component';

describe('QuestGeneratorConditionUpdateComponent', () => {
  let component: QuestGeneratorConditionUpdateComponent;
  let fixture: ComponentFixture<QuestGeneratorConditionUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestGeneratorConditionUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestGeneratorConditionUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
