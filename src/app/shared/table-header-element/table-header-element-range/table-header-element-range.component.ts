import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TableHeaderElementModel } from '../table-header-element-model';

import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { EuropeanNumberFormatPipe } from "../../european-number-format.pipe";

@Component({
    selector: 'app-table-header-element-range',
    standalone: true,
    templateUrl: './table-header-element-range.component.html',
    styleUrl: './table-header-element-range.component.css',
    imports: [CommonModule, FormsModule, TableModule, SliderModule, EuropeanNumberFormatPipe]
})
export class TableHeaderElementRangeComponent {

  @Input() headerField!: TableHeaderElementModel;
  @Input() isMobileView?: boolean;
}
