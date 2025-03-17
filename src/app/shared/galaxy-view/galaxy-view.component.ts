import { Component, EventEmitter, HostListener, Input, Output, OnInit } from '@angular/core';

import { PlotlyModule } from 'angular-plotly.js';

import { Clipboard } from '@angular/cdk/clipboard';
import { ToasterService } from '../toaster/toaster.service';
import { Datum } from 'plotly.js-dist-min';

@Component({
  selector: 'app-galaxy-view',
  standalone: true,
  imports: [
    PlotlyModule
  ],
  templateUrl: './galaxy-view.component.html',
  styleUrl: './galaxy-view.component.css'
})
export class GalaxyViewComponent implements OnInit {

  @Input() data: Partial<Plotly.PlotData>[] = [];
  @Output() dataChange: EventEmitter<any> = new EventEmitter<Partial<Plotly.PlotData>[]>();

  private lastCopy: string = ""; // to avoid multiple messages on mobile, as moving view while on a planet calls copyCoordiantes multiple times

  public config: Partial<Plotly.Config> = {
    responsive: true,
    autosizable: true
  };

  public layout: Partial<Plotly.Layout> = {
    showlegend: false,
    plot_bgcolor: '#1f3337',
    paper_bgcolor: "#1f3337",
    font: {
      family: 'var(--font-family)',
      color: 'white'
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    },
    scene: {
      xaxis: {
        color: 'white',
        gridcolor: 'gray',
        gridwidth: 1,
        range: [0, 1000],
        showgrid: true
      },
      yaxis: {
        color: 'white',
        gridcolor: 'gray',
        gridwidth: 1,
        range: [0, 1000],
        showgrid: true
      },
      zaxis: {
        color: 'white',
        gridcolor: 'gray',
        gridwidth: 1,
        range: [0, 1000],
        showgrid: true
      }
    }
  };

  constructor(private toasterService: ToasterService, private clipboard: Clipboard) {

  }

  ngOnInit(): void {
    this.updateMarkerSizeByWindowSize();
    this.updateAxisRanges();
  }

  @HostListener('window:resize', ['$event'])
  updateMarkerSizeByWindowSize() {
    let markerSize = 8;

    if (window.innerWidth < 690) {
      markerSize = 3;
    } else if (window.innerWidth < 990) {
      markerSize = 5;
    } else {
      markerSize = 8;
    }

    for (let currentData of this.data) {
      currentData.marker!.size = markerSize;
    }
  }

  updateAxisRanges() {
    let xAllData: number[] = [];
    let yAllData: number[] = [];
    let zAllData: number[] = [];
    for(let currentData of this.data) {
      currentData.x!.forEach(xCoordinate => xAllData.push(xCoordinate as number));
      currentData.y!.forEach(yCoordinate => yAllData.push(yCoordinate as number));
      currentData.z!.forEach(zCoordinate => zAllData.push(zCoordinate as number));
    }

    let xMin = xAllData.length > 0 ? Math.min.apply(Math, xAllData) - 10 : 0;
    let yMin = yAllData.length > 0 ? Math.min.apply(Math, yAllData) - 10 : 0;
    let zMin = zAllData.length > 0 ? Math.min.apply(Math, zAllData) - 10 : 0;

    let xMax = xAllData.length > 0 ? Math.max.apply(Math, xAllData) + 10 : 600;
    let yMax = yAllData.length > 0 ? Math.max.apply(Math, yAllData) + 10 : 600;
    let zMax = zAllData.length > 0 ? Math.max.apply(Math, zAllData) + 10 : 600;

    this.layout.scene!.xaxis!.range = [xMin, xMax];
    this.layout.scene!.yaxis!.range = [yMin, yMax];
    this.layout.scene!.zaxis!.range = [zMin, zMax];
  }

  copyCoordinates(event: any) {
    let coordinates = event.points[0].x + "-" + event.points[0].y + "-" + event.points[0].z;
    this.clipboard.copy(coordinates);

    if (this.lastCopy != coordinates) {
      this.toasterService.success("Copy Coordinates",`Copied Coordinates ${coordinates} to Clipboard.`);
    }

    this.lastCopy = coordinates;
  }
}
