import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestGeneratorComponent } from './quest-generator.component';

describe('QuestGeneratorComponent', () => {
  let component: QuestGeneratorComponent;
  let fixture: ComponentFixture<QuestGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
