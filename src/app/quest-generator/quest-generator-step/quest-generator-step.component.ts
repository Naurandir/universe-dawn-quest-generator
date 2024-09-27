import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { EChassisId, EModuleId, IQuest, IQuestStep, IQuestTaskDialogue, IReturnRewardGiveLicense, IReturnRewardGiveResources, TReturnReward } from '../quest-ud.model';

import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';

import { scrollIntoView } from '../../shared/scroll-into-view.function';
import { ToasterService } from '../../shared/toaster/toaster.service';
import { QuestStepsArrayPipe } from "../quest-steps-array.pipe";
import { QuestGeneratorService } from '../quest-generator.service';
import { UniverseDawnNumberFormatPipe } from "../../shared/universe-dawn-number-format.pipe";
import { QuestGeneratorStepUpdateComponent } from './quest-generator-step-update/quest-generator-step-update.component';
import { QuestGeneratorStepDialogUpdateComponent } from './quest-generator-step-dialog-update/quest-generator-step-dialog-update.component';
import { MarkdownModule } from 'ngx-markdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { QuestGeneratorStepRewardUpdateComponent } from './quest-generator-step-reward-update/quest-generator-step-reward-update.component';
import { CoordinatesNormalisedPipe } from "../../shared/coordinates-normalised.pipe";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quest-generator-step',
  standalone: true,
  imports: [CommonModule, PanelModule, TableModule, DividerModule, ConfirmDialogModule,
    MarkdownModule, NgbModule,
    QuestStepsArrayPipe, UniverseDawnNumberFormatPipe, QuestGeneratorStepUpdateComponent, QuestGeneratorStepDialogUpdateComponent, QuestGeneratorStepRewardUpdateComponent, CoordinatesNormalisedPipe],
  templateUrl: './quest-generator-step.component.html',
  styleUrl: './quest-generator-step.component.css'
})
export class QuestGeneratorStepComponent {

  @Input() selectedQuest!: IQuest;

  @Input() selectedLanguage!: 'DE' | 'EN';
  @Output() selectedLanguageChange: EventEmitter<'DE' | 'EN'> = new EventEmitter<'DE' | 'EN'>();

  @Output("afterChangeFunction") afterChangeFunction: EventEmitter<VoidFunction> = new EventEmitter();

  @ViewChild('questGeneratorStepUpdateDialog') questGeneratorStepUpdateDialog?: QuestGeneratorStepUpdateComponent;
  @ViewChild('questGeneratorStepDialogUpdateDialog') questGeneratorStepDialogUpdateDialog?: QuestGeneratorStepDialogUpdateComponent;
  @ViewChild('questGeneratorStepRewardUpdateComponent') questGeneratorStepRewardUpdateComponent?: QuestGeneratorStepRewardUpdateComponent

  chassis = EChassisId;
  modules = EModuleId;

  constructor(private questGeneratorService: QuestGeneratorService, private confirmationService: ConfirmationService, private toasterService: ToasterService) {

  }

  updateStep(quest: IQuest, step: IQuestStep | null) {
    this.questGeneratorStepUpdateDialog!.setStep(quest, step);
    this.questGeneratorStepUpdateDialog!.showUpdateDialog();
  }

  afterUpdateStep(step: IQuestStep) {
    let steps: IQuestStep[] = Object.values(this.selectedQuest!.steps);
    let isNewStep = steps.filter(s => s == step).length == 0;

    if (isNewStep) {
      let isIdAlreadyExisting = steps.filter(s => s.id == step.id).length > 0;
      if (isIdAlreadyExisting) {
        this.toasterService.error("Step exists", `Step with id '${step.id} already exists, please update corresponding step instead of add.'`);
        throw new Error("Step already exists");
      }
    }

    if (isNewStep) {
      this.questGeneratorService.addStep(step, this.selectedQuest!);
    }

    this.afterChangeFunction.emit();
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

    this.afterChangeFunction.emit();
  }

  moveStepUp(step: IQuestStep) {
    this.questGeneratorService.moveStepUp(step, this.selectedQuest!);

    this.afterChangeFunction.emit();
  }

  moveStepDown(step: IQuestStep) {
    this.questGeneratorService.moveStepDown(step, this.selectedQuest!);

    this.afterChangeFunction.emit();
  }

  // Dialog
  updateStepDialog(key: string | null, answer: string | null, task: IQuestTaskDialogue) {
    this.questGeneratorStepDialogUpdateDialog!.setStepDialog(key, answer, this.selectedLanguage, task);
    this.questGeneratorStepDialogUpdateDialog!.showUpdateStepDialog();
  }

  deleteStepDialog(key: string, questTask: IQuestTaskDialogue) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete dialog option '${key}' from your quest?`,
      header: 'Delete Dialog Option',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteStepDialogConfirm(key, questTask);
      },
      reject: () => {
        console.debug("rejected delete");
      }
    });
  }

  deleteStepDialogConfirm(key: string, questTask: IQuestTaskDialogue) {
    this.questGeneratorService.deleteQuestDialog(key, this.selectedLanguage, questTask);
    this.afterChangeFunction.emit();
  }

  getStepDialogOptions(task: IQuestTaskDialogue): [string, string][] {
    let entries: [string, string][] = [];

    if (this.selectedLanguage == 'DE') {
      entries = Object.entries(task.dialogues.de);
    } else {
      entries = Object.entries(task.dialogues.en);
    }

    return entries;
  }

  // Reward
  updateStepReward(reward: TReturnReward | null, questStep: IQuestStep) {
    this.questGeneratorStepRewardUpdateComponent!.setReward(reward, questStep);
    this.questGeneratorStepRewardUpdateComponent!.showUpdateStepDialog();
  }

  deleteStepReward(reward: TReturnReward, questStep: IQuestStep) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete reward '${reward.rewardType}' from your quest?`,
      header: 'Delete Dialog Option',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteStepRewardConfirm(reward, questStep);
      },
      reject: () => {
        console.debug("rejected delete");
      }
    });
  }

  deleteStepRewardConfirm(reward: TReturnReward, questStep: IQuestStep) {
    this.questGeneratorService.deleteStepReward(reward, questStep);
    this.afterChangeFunction.emit();
  }

  scrollIntoRewardView(elementId: string, expanded: boolean) {
    scrollIntoView(elementId, expanded);
  }

  getTotalResources(reward: IReturnRewardGiveResources) {
    return reward.cost.resources.reduce((accumulator, current) => accumulator + current);
  }

  getCredits(reward: IReturnRewardGiveResources) {
    return reward.cost.currencies[0];
  }

  getComponentName(reward: IReturnRewardGiveLicense) {
    if (reward.componentType == 'chassis') {
      return this.chassis[Number(reward.licenseId)].toString();
    } else if (reward.componentType == 'module') {
      return this.modules[Number(reward.licenseId)].toString();
    } else {
      throw new Error("Unknown Component Type!")
    }
  }

  switchLanguage(language: 'DE' | 'EN') {
    this.selectedLanguage = language;
    this.selectedLanguageChange.emit(language);
  }
}
