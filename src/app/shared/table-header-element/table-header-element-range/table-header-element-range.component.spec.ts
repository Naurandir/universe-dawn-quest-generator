import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeaderElementRangeComponent } from './table-header-element-range.component';

describe('TableHeaderElementRangeComponent', () => {
  let component: TableHeaderElementRangeComponent;
  let fixture: ComponentFixture<TableHeaderElementRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHeaderElementRangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableHeaderElementRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
