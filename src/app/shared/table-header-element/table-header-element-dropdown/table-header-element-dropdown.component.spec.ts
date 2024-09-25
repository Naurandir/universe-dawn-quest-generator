import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeaderElementDropdownComponent } from './table-header-element-dropdown.component';

describe('TableHeaderElementDropdownComponent', () => {
  let component: TableHeaderElementDropdownComponent;
  let fixture: ComponentFixture<TableHeaderElementDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHeaderElementDropdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableHeaderElementDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
