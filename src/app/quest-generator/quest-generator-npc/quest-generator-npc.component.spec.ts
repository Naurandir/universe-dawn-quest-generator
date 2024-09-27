import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestGeneratorNpcComponent } from './quest-generator-npc.component';

describe('QuestGeneratorNpcComponent', () => {
  let component: QuestGeneratorNpcComponent;
  let fixture: ComponentFixture<QuestGeneratorNpcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestGeneratorNpcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestGeneratorNpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
