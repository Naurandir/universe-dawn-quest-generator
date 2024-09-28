import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestGeneratorNpcGalaxyViewComponent } from './quest-generator-npc-galaxy-view.component';

describe('QuestGeneratorNpcGalaxyViewComponent', () => {
  let component: QuestGeneratorNpcGalaxyViewComponent;
  let fixture: ComponentFixture<QuestGeneratorNpcGalaxyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestGeneratorNpcGalaxyViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestGeneratorNpcGalaxyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
