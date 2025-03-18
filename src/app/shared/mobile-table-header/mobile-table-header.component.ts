import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { EuropeanNumberFormatPipe } from "../european-number-format.pipe";
import { TableHeaderModel } from '../table-header-element/table-header-model';
import { TableHeaderElementDefaultComponent } from "../table-header-element/table-header-element-default/table-header-element-default.component";
import { TableHeaderElementDropdownComponent } from "../table-header-element/table-header-element-dropdown/table-header-element-dropdown.component";
import { TableHeaderElementRangeComponent } from "../table-header-element/table-header-element-range/table-header-element-range.component";
import { TableHeaderElementArrowComponent } from "../table-header-element/table-header-element-arrow/table-header-element-arrow.component";

@Component({
    selector: 'app-mobile-table-header',
    templateUrl: './mobile-table-header.component.html',
    styleUrl: './mobile-table-header.component.css',
    imports: [CommonModule, FormsModule, PanelModule, TableModule, DropdownModule, TagModule, SliderModule, EuropeanNumberFormatPipe, TableHeaderElementDefaultComponent, TableHeaderElementDropdownComponent, TableHeaderElementRangeComponent, TableHeaderElementArrowComponent]
})
export class MobileTableHeaderComponent implements OnInit {

  @Input() headerModel!: TableHeaderModel;
  visible: boolean = false;

  ngOnInit(): void {
    this.updateVisibility();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateVisibility();
  }

  updateVisibility() {
    let width: number = this.headerModel.viewBreakpoint == null ? 960 : this.headerModel.viewBreakpoint;
    this.visible = window.innerWidth <= width;
  }

  getSeverity(value: string, options: Map<string, "success" | "secondary" | "info" | "warning" | "danger" | "contrast">):
  "success"|"secondary"|"info"|"warning"|"danger"|"contrast" {

    let severity = options.get(value);
    if (severity == null) {
      return "contrast";
    }
    return severity;
  }

  getDropdownOptions(dropdownTags: Map<string, "success" | "secondary" | "info" | "warning" | "danger" | "contrast">): string[] {
    let options: string[] = [];

    dropdownTags.forEach((value, key) => {
      options.push(key);
    });

    return options;
  }
}
