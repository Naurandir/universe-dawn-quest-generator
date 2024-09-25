import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingActionComponent } from './loading-action.component';

describe('LoadingActionComponent', () => {
  let component: LoadingActionComponent;
  let fixture: ComponentFixture<LoadingActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingActionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadingActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
