import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ELocalisation, ICoordinates, IQuest, IQuestPrepareNpcs, IQuestStep, IQuestSteps } from '../../quest-ud.model';

import { MarkdownModule } from 'ngx-markdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';

import { ToasterService } from '../../../shared/toaster/toaster.service';
import { QuestGeneratorService } from '../../quest-generator.service';
import { PositionInputComponent } from "../../../shared/position-input/position-input.component";

@Component({
  selector: 'app-quest-generator-step-update',
  standalone: true,
  imports: [ CommonModule, NgbModule, MarkdownModule, FormsModule, ReactiveFormsModule, DialogModule, DropdownModule,
             InputNumberModule, DividerModule, PositionInputComponent ],
  templateUrl: './quest-generator-step-update.component.html',
  styleUrl: './quest-generator-step-update.component.css'
})
export class QuestGeneratorStepUpdateComponent {

  @Output("afterUpdateFunction") afterUpdateFunction: EventEmitter<IQuestStep> = new EventEmitter();

  currentQuest?: IQuest;
  currentQuestStep: IQuestStep | null = null;

  visible: boolean = false;
  isAdd: boolean = false;
  selectedLanguage: 'DE' | 'EN' = 'DE';
  stepTypes: string[] = ['transactCredits', 'dialogue'];

  stepForm: FormGroup = new FormGroup({
    stepType: new FormControl("", [Validators.required]),
    stepNextPossibleSteps: new FormControl([]),
    stepNotificationDe: new FormControl("", [Validators.required]),
    stepNotificationEn: new FormControl(""),

    stepChosendNpc: new FormControl("", [Validators.required]),

    stepTransactCreditsAmount: new FormControl(0),

    stepDialogCorrectWordDe: new FormControl(""),
    stepDialogCorrectWordEn: new FormControl(""),
  });

  constructor(private questGeneratorService: QuestGeneratorService, private toasterService: ToasterService) {

  }

  setStep(quest: IQuest, step: IQuestStep | null) {
    this.resetForm();

    this.currentQuest = quest;
    this.currentQuestStep = step;

    this.isAdd = step == null;

    if(step != null && step.task.type == "transactCredits") {
      this.stepForm.patchValue({
        stepType: "transactCredits",
        stepNotificationDe: step.notification.de.customText,
        stepNotificationEn: step.notification.en?.customText,
        stepChosendNpc: this.questGeneratorService.getNpcByRulerName(this.currentQuest.prepareNpcs, step.task.rulerName),
        stepTransactCreditsAmount: step.task.amount,
      });
    } else if (step != null && step.task.type == "dialogue") {
      this.stepForm.patchValue({
        stepType: "dialogue",
        stepNotificationDe: step.notification.de.customText,
        stepNotificationEn: step.notification.en?.customText,
        stepChosendNpc: this.questGeneratorService.getNpcByCoordinates(this.currentQuest.prepareNpcs, step.task.coordinates),
        stepDialogCorrectWordDe: step.task.correctDialogueWord[ELocalisation.de],
        stepDialogCorrectWordEn: step.task.correctDialogueWord[ELocalisation.en]
      });
    }
  }

  showUpdateDialog() {
    this.visible = true;
    this.selectedLanguage = 'DE';
  }

  isFormCombinationAllowed() {
    return (this.stepForm.value.stepType == 'transactCredits' &&
            this.stepForm.value.stepChosendNpc != null &&
            this.stepForm.value.stepTransactCreditsAmount > 0)
           ||
           (this.stepForm.value.stepType == 'dialogue' &&
            this.stepForm.value.stepChosendNpc != null &&
            this.stepForm.value.stepDialogCorrectWordDe != "" &&
            this.stepForm.value.stepDialogCorrectWordEn != "");
  }

  updateStep() {
    let questType = this.stepForm.value.stepType;
    let normalizedStepId = this.getNormalizedStepId(this.currentQuestStep, this.currentQuest!.steps);

    if (this.currentQuestStep == null && questType == "transactCredits") {
      let newStep: IQuestStep = this.questGeneratorService.createStep(
        normalizedStepId,
        this.stepForm.value.stepType,
        this.stepForm.value.stepNotificationDe,
        this.stepForm.value.stepNotificationEn,
        this.stepForm.value.stepTransactCreditsAmount as number,
        this.stepForm.value.stepChosendNpc.rulerName,
        null,
        null,
        null
      );
      this.currentQuestStep = newStep;
    } else if (this.currentQuestStep == null && questType == "dialogue") {
      let newStep: IQuestStep = this.questGeneratorService.createStep(
        normalizedStepId,
        this.stepForm.value.stepType,
        this.stepForm.value.stepNotificationDe,
        this.stepForm.value.stepNotificationEn,
        null,
        null,
        this.stepForm.value.stepChosendNpc.planet.coordinates.x + "-" + this.stepForm.value.stepChosendNpc.planet.coordinates.y + "-" + this.stepForm.value.stepChosendNpc.planet.coordinates.z,
        this.stepForm.value.stepDialogCorrectWordDe.toLowerCase(),
        this.stepForm.value.stepDialogCorrectWordEn.toLowerCase()
      );
      this.currentQuestStep = newStep;
    }

    if (this.currentQuestStep != null) {
      this.currentQuestStep.notification = {
        de: {
          customText: this.stepForm.value.stepNotificationDe,
          variables: {}
        }
      };
      if (this.stepForm.value.stepNotificationEn != null) {
        this.currentQuestStep.notification.en = {
          customText: this.stepForm.value.stepNotificationEn,
          variables: {}
        };
      }
    }

    if (this.currentQuestStep != null && questType == "transactCredits") {
      this.currentQuestStep.task = this.questGeneratorService.createQuestTaskTransactCredits(
        this.stepForm.value.stepTransactCreditsAmount,
        this.stepForm.value.stepChosendNpc.rulerName
      );
    } else if (this.currentQuestStep != null && questType == "dialogue") {
      this.currentQuestStep.task = this.questGeneratorService.createQuestTaskDialog(
        this.stepForm.value.stepChosendNpc.planet.coordinates.x + "-" + this.stepForm.value.stepChosendNpc.planet.coordinates.y + "-" + this.stepForm.value.stepChosendNpc.planet.coordinates.z,
        this.stepForm.value.stepDialogCorrectWordDe.toLowerCase(),
        this.stepForm.value.stepDialogCorrectWordEn.toLowerCase()
      );
    }

    this.visible = false;
    this.afterUpdateFunction.emit(this.currentQuestStep!);
    this.toasterService.success("Step Update","Step succesfully updated");
    this.resetForm();
  }

  private getNormalizedStepId(questStep: IQuestStep | null, steps: IQuestSteps): string {
    let stepsList: IQuestStep[] = Object.values(steps);

    let stepId = "";

    if (questStep == null) {
      stepId = this.questGeneratorService.getNormalizedStepId(stepsList.length);
    }
    return stepId;
  }

  getNpcList(npcs: IQuestPrepareNpcs[], stepType: string): IQuestPrepareNpcs[] {
    if (stepType == 'transactCredits') {
      return npcs;
    }

    return npcs.filter(n => n.planet != undefined && n.planet != null);
  }

  get keywordDe() {
    return this.stepForm.get('stepDialogCorrectWordDe');
  }

  get keywordEn() {
    return this.stepForm.get('stepDialogCorrectWordEn');
  }

  switchLanguage(language: 'DE' | 'EN') {
    this.selectedLanguage = language;
  }

  resetForm() {
    this.stepForm.patchValue({
      stepType: "",
      stepNotificationDe: "",
      stepNotificationEn: "",
      stepTransactCreditsAmount: 0,
      stepChosendNpc: null,
      stepDialogCorrectWordDe: "",
      stepDialogCorrectWordEn: ""
    });
  }
}
