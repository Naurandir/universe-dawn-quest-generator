import { Component, Input } from '@angular/core';
import { TableHeaderElementModel } from '../table-header-element-model';

import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-table-header-element-default',
    imports: [CommonModule, TableModule],
    templateUrl: './table-header-element-default.component.html',
    styleUrl: './table-header-element-default.component.css'
})
export class TableHeaderElementDefaultComponent {

  @Input() headerField!: TableHeaderElementModel;
  @Input() isMobileView?: boolean;
}
