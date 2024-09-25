import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTableHeaderComponent } from './mobile-table-header.component';

describe('MobileTableHeaderComponent', () => {
  let component: MobileTableHeaderComponent;
  let fixture: ComponentFixture<MobileTableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileTableHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileTableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
