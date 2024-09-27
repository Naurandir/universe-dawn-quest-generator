import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestGeneratorConditionComponent } from './quest-generator-condition.component';

describe('QuestGeneratorConditionComponent', () => {
  let component: QuestGeneratorConditionComponent;
  let fixture: ComponentFixture<QuestGeneratorConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestGeneratorConditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestGeneratorConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
