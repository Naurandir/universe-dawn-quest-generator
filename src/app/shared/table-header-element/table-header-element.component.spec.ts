import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeaderElementComponent } from './table-header-element.component';

describe('TableHeaderElementComponent', () => {
  let component: TableHeaderElementComponent;
  let fixture: ComponentFixture<TableHeaderElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHeaderElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableHeaderElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
