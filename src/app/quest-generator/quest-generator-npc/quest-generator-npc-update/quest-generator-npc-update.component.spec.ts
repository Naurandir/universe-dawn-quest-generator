import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestGeneratorNpcUpdateComponent } from './quest-generator-npc-update.component';

describe('QuestGeneratorNpcUpdateComponent', () => {
  let component: QuestGeneratorNpcUpdateComponent;
  let fixture: ComponentFixture<QuestGeneratorNpcUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestGeneratorNpcUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestGeneratorNpcUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
