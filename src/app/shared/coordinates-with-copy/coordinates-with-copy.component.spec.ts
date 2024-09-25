import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatesWithCopyComponent } from './coordinates-with-copy.component';

describe('CoordinatesWithCopyComponent', () => {
  let component: CoordinatesWithCopyComponent;
  let fixture: ComponentFixture<CoordinatesWithCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatesWithCopyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoordinatesWithCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
