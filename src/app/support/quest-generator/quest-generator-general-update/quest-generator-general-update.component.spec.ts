import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestGeneratorGeneralUpdateComponent } from './quest-generator-general-update.component';

describe('QuestGeneratorGeneralUpdateComponent', () => {
  let component: QuestGeneratorGeneralUpdateComponent;
  let fixture: ComponentFixture<QuestGeneratorGeneralUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestGeneratorGeneralUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestGeneratorGeneralUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
