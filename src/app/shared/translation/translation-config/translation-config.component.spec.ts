import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationConfigComponent } from './translation-config.component';

describe('TranslationConfigComponent', () => {
  let component: TranslationConfigComponent;
  let fixture: ComponentFixture<TranslationConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
