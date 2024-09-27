import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ICoordinates, IQuest, IQuestPrepareNpcs } from '../quest-ud.model';
import { CommonModule } from '@angular/common';

import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';

import { CoordinatesWithCopyComponent } from '../../shared/coordinates-with-copy/coordinates-with-copy.component';
import { QuestGeneratorNpcUpdateComponent } from "./quest-generator-npc-update/quest-generator-npc-update.component";

@Component({
  selector: 'app-quest-generator-npc',
  standalone: true,
  imports: [CommonModule, PanelModule, TableModule, CoordinatesWithCopyComponent, QuestGeneratorNpcUpdateComponent],
  templateUrl: './quest-generator-npc.component.html',
  styleUrl: './quest-generator-npc.component.css'
})
export class QuestGeneratorNpcComponent {

  @Input() selectedQuest!: IQuest;
  @Output("afterChangeFunction") afterChangeFunction: EventEmitter<VoidFunction> = new EventEmitter();

  @ViewChild('questGeneratorNpcUpdateComponent') questGeneratorNpcUpdateComponent?: QuestGeneratorNpcUpdateComponent;

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
}
