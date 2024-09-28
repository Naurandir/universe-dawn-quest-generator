import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

import { DialogModule } from 'primeng/dialog';

import { GalaxyViewComponent } from "../../../shared/galaxy-view/galaxy-view.component";
import { LoadingActionComponent } from '../../../shared/loading-action/loading-action.component';

import { IQuestPrepareNpcs } from './../../quest-ud.model';
import { LoadingActionService } from '../../../shared/loading-action/loading-action.service';
import { ToasterService } from '../../../shared/toaster/toaster.service';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-quest-generator-npc-galaxy-view',
  standalone: true,
  imports: [CommonModule, DialogModule, PlotlyModule, LoadingActionComponent, GalaxyViewComponent],
  templateUrl: './quest-generator-npc-galaxy-view.component.html',
  styleUrl: './quest-generator-npc-galaxy-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestGeneratorNpcGalaxyViewComponent {

  currentNpcs: IQuestPrepareNpcs[] = [];

  visible: boolean = false;

  // https://www.npmjs.com/package/angular-plotly.js?activeTab=readme
  data: Partial<PlotlyJS.PlotData>[] = [
    {
      x: [0],
      y: [0],
      z: [0],
      text: [''],
      type: 'scatter3d',
      name: '',
      mode: 'text+markers',
      marker: {
        size: 8,
        color: 'rgba(22, 222, 145, 0.8)'
      }
    },
    {
      x: [441, 136, 251, 175, 428, 323],
      y: [160, 459, 175, 359, 385, 375],
      z: [410, 361, 298, 183, 182, 404],
      text: ['Kashou Doori', 'Nucleus Prime', 'Shin-Yamar', 'Sol Nigra', 'Un Queran Linh', 'Wega II'],
      type: 'scatter3d',
      name: '',
      mode: 'text+markers',
      marker: {
        size: 8,
        color: 'rgba(255, 215, 0, 0.8)'
      }
  }];

  constructor(private changeDedector: ChangeDetectorRef, private loadingActionService: LoadingActionService, private toasterService: ToasterService) {

  }

  showGalaxyView() {
    try {
      this.initGalaxyView();
      this.visible = true;
      this.changeDedector.detectChanges();
    } catch(error: any) {
      this.loadingActionService.hideLoadingAction();
      this.toasterService.error("Galaxy View Initialize", `Could not initialize galaxy view. Reason: ${error.message}`);
    } finally {
      this.loadingActionService.hideLoadingAction();
    }
  }

  private initGalaxyView() {
    let textNpc = new Array();
    let xNpc = new Array();
    let yNpc = new Array();
    let zNpc = new Array();

    for (var i = 0; i < this.currentNpcs.length; i++) {
      if (this.currentNpcs[i].planet != undefined && this.currentNpcs[i].planet != null) {
        textNpc[i] = this.currentNpcs[i].planet?.planetName + " (" + this.currentNpcs[i].rulerName + ")";
        xNpc[i] = this.currentNpcs[i].planet?.coordinates.x;
        yNpc[i] = this.currentNpcs[i].planet?.coordinates.y;
        zNpc[i] = this.currentNpcs[i].planet?.coordinates.z;
      }
    }

    this.data[0].text = textNpc;
    this.data[0].x = xNpc;
    this.data[0].y = yNpc;
    this.data[0].z = zNpc;
  }

  setCurrentNpcs(npcs: IQuestPrepareNpcs[]) {
    this.currentNpcs = npcs;
  }
}
