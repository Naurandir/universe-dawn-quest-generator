import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ICoordinates, IQuest, IQuestPrepareNpcs, IQuestStep } from '../quest-ud.model';
import { QuestGeneratorService } from '../quest-generator.service';
import { ConfirmationService } from 'primeng/api';
import { ToasterService } from '../../shared/toaster/toaster.service';
import { CoordinatesNormalisedPipe } from '../../shared/coordinates-normalised.pipe';
import { QuestGeneratorStepUpdateComponent } from '../quest-generator-step/quest-generator-step-update/quest-generator-step-update.component';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { QuestStepsArrayPipe } from "../quest-steps-array.pipe";

@Component({
  selector: 'app-quest-generator-step-overview',
  standalone: true,
  imports: [CommonModule, PanelModule, TableModule, ConfirmDialogModule, QuestStepsArrayPipe],
  templateUrl: './quest-generator-step-overview.component.html',
  styleUrl: './quest-generator-step-overview.component.css'
})
export class QuestGeneratorStepOverviewComponent {

  @Input() selectedQuest!: IQuest;

  @Input() selectedLanguage!: 'DE' | 'EN';
  @Output() selectedLanguageChange: EventEmitter<'DE' | 'EN'> = new EventEmitter<'DE' | 'EN'>();

  @Output("afterChangeFunction") afterChangeFunction: EventEmitter<VoidFunction> = new EventEmitter();

  @Input() questGeneratorStepUpdateDialog?: QuestGeneratorStepUpdateComponent;

  constructor(private questGeneratorService: QuestGeneratorService, private confirmationService: ConfirmationService, private toasterService: ToasterService,
    public coordinatesNormalisedPipe: CoordinatesNormalisedPipe, private changeDedector: ChangeDetectorRef) {
  }

  updateStep(quest: IQuest, step: IQuestStep | null) {
    this.questGeneratorStepUpdateDialog!.setStep(quest, step);
    this.questGeneratorStepUpdateDialog!.showUpdateDialog();
    this.changeDedector.detectChanges();
  }

  deleteStep(step: IQuestStep) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete step '${step.id}' from your quest?`,
      header: 'Delete Step',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteStepConfirmed(step);
      },
      reject: () => {
        console.debug("rejected delete");
      }
    });
  }

  deleteStepConfirmed(step: IQuestStep) {
    this.questGeneratorService.deleteStep(step, this.selectedQuest!);
    this.changeDedector.detectChanges();

    this.afterChangeFunction.emit();
  }

  moveStepUp(step: IQuestStep) {
    this.questGeneratorService.moveStepUp(step, this.selectedQuest!);
    this.changeDedector.detectChanges();

    this.afterChangeFunction.emit();
  }

  moveStepDown(step: IQuestStep) {
    this.questGeneratorService.moveStepDown(step, this.selectedQuest!);
    this.changeDedector.detectChanges();

    this.afterChangeFunction.emit();
  }

  getNpcInfoByCoordinates(coordinates: ICoordinates) {
    let foundNpc: IQuestPrepareNpcs[] = this.selectedQuest!.prepareNpcs.filter(npc => npc.planet != undefined &&
      npc.planet.coordinates.x == coordinates.x && npc.planet.coordinates.y == coordinates.y && npc.planet.coordinates.z == coordinates.z);
    return this.getNpcInfo(foundNpc);
  }

  getNpcInfoByRulerName(rulerName: string): string {
    let foundNpc: IQuestPrepareNpcs[] = this.selectedQuest!.prepareNpcs.filter(npc => npc.rulerName == rulerName);
    return this.getNpcInfo(foundNpc);
  }

  private getNpcInfo(foundNpc: IQuestPrepareNpcs[]) {
    if (foundNpc.length == 0) {
      return "Unknown";
    }

    if (foundNpc[0].planet == undefined) {
      return `${foundNpc[0].rulerName} (No Planet)`;
    }

    return `${foundNpc[0].rulerName} - ${foundNpc[0].planet.planetName}`;
  }
}
