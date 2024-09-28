import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ICoordinates, IQuest, IQuestPrepareNpcs } from '../quest-ud.model';
import { CommonModule } from '@angular/common';

import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';

import { CoordinatesWithCopyComponent } from '../../shared/coordinates-with-copy/coordinates-with-copy.component';
import { QuestGeneratorNpcUpdateComponent } from "./quest-generator-npc-update/quest-generator-npc-update.component";
import { QuestGeneratorNpcGalaxyViewComponent } from './quest-generator-npc-galaxy-view/quest-generator-npc-galaxy-view.component';
import { LoadingActionService } from '../../shared/loading-action/loading-action.service';

@Component({
  selector: 'app-quest-generator-npc',
  standalone: true,
  imports: [ CommonModule, PanelModule, TableModule, DividerModule,
             CoordinatesWithCopyComponent, QuestGeneratorNpcUpdateComponent, QuestGeneratorNpcGalaxyViewComponent],
  templateUrl: './quest-generator-npc.component.html',
  styleUrl: './quest-generator-npc.component.css'
})
export class QuestGeneratorNpcComponent {

  @Input() selectedQuest!: IQuest;
  @Output("afterChangeFunction") afterChangeFunction: EventEmitter<VoidFunction> = new EventEmitter();

  @ViewChild('questGeneratorNpcUpdateComponent') questGeneratorNpcUpdateComponent?: QuestGeneratorNpcUpdateComponent;
  @ViewChild('questGeneratorNpcGalaxyViewComponent') questGeneratorNpcGalaxyViewComponent?: QuestGeneratorNpcGalaxyViewComponent;

  constructor(private loadingActionService: LoadingActionService) {

  }

  getPosition(coordinates: ICoordinates): ICoordinates {
    let pos: ICoordinates = {
      x: coordinates.x,
      y: coordinates.y,
      z: coordinates.z
    };

    return pos;
  }

  updateNpc(quest: IQuest, npc: IQuestPrepareNpcs | null) {
    this.questGeneratorNpcUpdateComponent!.setNpc(quest, npc);
    this.questGeneratorNpcUpdateComponent!.showUpdateDialog();
  }

  afterUpdateNpc(npc: IQuestPrepareNpcs) {
    let isNewCondition = this.selectedQuest?.prepareNpcs.filter(n => n == npc).length == 0;

    if (isNewCondition) {
      this.selectedQuest?.prepareNpcs.push(npc);
    }

    this.afterChangeFunction.emit();
  }

  deleteNpc(npc: IQuestPrepareNpcs) {
    this.selectedQuest!.prepareNpcs = this.selectedQuest!.prepareNpcs.filter(n => n != npc);

    this.afterChangeFunction.emit();
  }

  showGalaxy(quest: IQuest) {
    this.questGeneratorNpcGalaxyViewComponent?.setCurrentNpcs(quest.prepareNpcs);
    this.loadingActionService.showLoadingActionWithMessage("Init View");
    setTimeout(() => {
      this.questGeneratorNpcGalaxyViewComponent?.showGalaxyView();
    }, 100); // to let the action spinner be shown
  }
}
