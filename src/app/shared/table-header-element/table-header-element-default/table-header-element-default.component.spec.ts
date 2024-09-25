import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeaderElementDefaultComponent } from './table-header-element-default.component';

describe('TableHeaderElementDefaultComponent', () => {
  let component: TableHeaderElementDefaultComponent;
  let fixture: ComponentFixture<TableHeaderElementDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHeaderElementDefaultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableHeaderElementDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
