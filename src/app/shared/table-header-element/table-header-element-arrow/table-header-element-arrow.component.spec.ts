import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeaderElementArrowComponent } from './table-header-element-arrow.component';

describe('TableHeaderElementArrowComponent', () => {
  let component: TableHeaderElementArrowComponent;
  let fixture: ComponentFixture<TableHeaderElementArrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHeaderElementArrowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableHeaderElementArrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
