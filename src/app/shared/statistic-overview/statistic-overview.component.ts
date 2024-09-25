import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { Component, Input } from '@angular/core';

import { UniverseDawnNumberFormatPipe } from "../../shared/universe-dawn-number-format.pipe";

@Component({
  selector: 'app-statistic-overview',
  standalone: true,
  imports: [
    CommonModule, PanelModule, UniverseDawnNumberFormatPipe
  ],
  templateUrl: './statistic-overview.component.html',
  styleUrl: './statistic-overview.component.css'
})
export class StatisticOverviewComponent {
  @Input() title: string = "";
  @Input() titleIcon: string = "";
  @Input() headers: string[] = [];
  @Input() values: number[] = [];
}
