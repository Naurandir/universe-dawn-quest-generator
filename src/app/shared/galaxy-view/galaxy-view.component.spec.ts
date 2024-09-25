import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalaxyViewComponent } from './galaxy-view.component';

describe('GalaxyViewComponent', () => {
  let component: GalaxyViewComponent;
  let fixture: ComponentFixture<GalaxyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalaxyViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GalaxyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
