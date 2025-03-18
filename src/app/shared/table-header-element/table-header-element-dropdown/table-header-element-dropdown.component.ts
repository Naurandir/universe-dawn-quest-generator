import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { TableHeaderElementModel } from '../table-header-element-model';

@Component({
    selector: 'app-table-header-element-dropdown',
    imports: [CommonModule, TableModule, DropdownModule, TagModule],
    templateUrl: './table-header-element-dropdown.component.html',
    styleUrl: './table-header-element-dropdown.component.css'
})
export class TableHeaderElementDropdownComponent {

  @Input() headerField!: TableHeaderElementModel;
  @Input() isMobileView?: boolean;

  getDropdownOptions(): string[] {
    let options: string[] = [];

    this.headerField.dropdownTags!.forEach((value, key) => {
      options.push(key);
    });

    return options;
  }
}
