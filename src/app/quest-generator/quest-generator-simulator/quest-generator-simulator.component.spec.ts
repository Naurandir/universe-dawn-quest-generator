import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestGeneratorSimulatorComponent } from './quest-generator-simulator.component';

describe('QuestGeneratorSimulatorComponent', () => {
  let component: QuestGeneratorSimulatorComponent;
  let fixture: ComponentFixture<QuestGeneratorSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestGeneratorSimulatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestGeneratorSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
