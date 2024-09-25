import { Component, Input } from '@angular/core';
import { TableHeaderElementModel } from './table-header-element-model';
import { TableHeaderElementDefaultComponent } from "./table-header-element-default/table-header-element-default.component";
import { CommonModule } from '@angular/common';
import { TableHeaderElementDropdownComponent } from "./table-header-element-dropdown/table-header-element-dropdown.component";
import { TableHeaderElementArrowComponent } from "./table-header-element-arrow/table-header-element-arrow.component";
import { TableHeaderElementRangeComponent } from "./table-header-element-range/table-header-element-range.component";

@Component({
    selector: '[app-table-header-element]',
    standalone: true,
    templateUrl: './table-header-element.component.html',
    styleUrl: './table-header-element.component.css',
    imports: [CommonModule,
      TableHeaderElementDefaultComponent, TableHeaderElementDropdownComponent, TableHeaderElementArrowComponent, TableHeaderElementRangeComponent]
})
export class TableHeaderElementComponent {

  @Input() headerField!: TableHeaderElementModel;
}
