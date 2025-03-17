import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ICoordinates, IQuest, IQuestPrepareNpcs } from '../quest-ud.model';
import { CommonModule } from '@angular/common';

import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';

import { CoordinatesWithCopyComponent } from '../../shared/coordinates-with-copy/coordinates-with-copy.component';
import { QuestGeneratorNpcUpdateComponent } from "./quest-generator-npc-update/quest-generator-npc-update.component";
import { QuestGeneratorNpcGalaxyViewComponent } from './quest-generator-npc-galaxy-view/quest-generator-npc-galaxy-view.component';
import { LoadingActionService } from '../../shared/loading-action/loading-action.service';
import { QuestGeneratorService } from '../quest-generator.service';

@Component({
  selector: 'app-quest-generator-npc',
  standalone: true,
  imports: [ CommonModule, PanelModule, TableModule, DividerModule,
             CoordinatesWithCopyComponent, QuestGeneratorNpcUpdateComponent],
  templateUrl: './quest-generator-npc.component.html',
  styleUrl: './quest-generator-npc.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestGeneratorNpcComponent {

  @Input() selectedQuest!: IQuest;
  @Output("afterChangeFunction") afterChangeFunction: EventEmitter<VoidFunction> = new EventEmitter();

  @ViewChild('questGeneratorNpcUpdateComponent') questGeneratorNpcUpdateComponent?: QuestGeneratorNpcUpdateComponent;
  @ViewChild('questGeneratorNpcGalacyViewContainer', { read: ViewContainerRef }) questGeneratorNpcGalacyViewContainer!: ViewContainerRef;

  constructor(public questGeneratorService: QuestGeneratorService, private loadingActionService: LoadingActionService, private changeDedector: ChangeDetectorRef) {

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
    this.changeDedector.detectChanges();
  }

  afterUpdateNpc(npc: IQuestPrepareNpcs) {
    let isNewCondition = this.selectedQuest?.prepareNpcs.filter(n => n == npc).length == 0;

    if (isNewCondition) {
      this.selectedQuest?.prepareNpcs.push(npc);
    }

    this.changeDedector.detectChanges();
    this.afterChangeFunction.emit();
  }

  deleteNpc(npc: IQuestPrepareNpcs) {
    this.selectedQuest!.prepareNpcs = this.selectedQuest!.prepareNpcs.filter(n => n != npc);

    this.changeDedector.detectChanges();
    this.afterChangeFunction.emit();
  }

  async showGalaxy(quest: IQuest) {
    this.loadingActionService.showLoadingActionWithMessage("Init View");
    this.questGeneratorNpcGalacyViewContainer.clear();

    let { QuestGeneratorNpcGalaxyViewComponent } = await import('./quest-generator-npc-galaxy-view/quest-generator-npc-galaxy-view.component');
    let componentRef = this.questGeneratorNpcGalacyViewContainer.createComponent(QuestGeneratorNpcGalaxyViewComponent);

    componentRef.instance.setCurrentNpcs(quest.prepareNpcs);
    componentRef.instance.showGalaxyView()

    setTimeout(() => {
      componentRef.instance.showGalaxyView();
    }, 100); // to let the action spinner be shown
  }
}
