import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ELocalisation, IQuest, IQuestStep, IQuestSteps } from '../../quest-ud.model';

import { MarkdownModule } from 'ngx-markdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';

import { ToasterService } from '../../../../shared/toaster/toaster.service';
import { CoordinatesNormalisedPipe } from '../../../../shared/coordinates-normalised.pipe';
import { QuestGeneratorService } from '../../quest-generator.service';
import { PositionInputComponent } from "../../../../shared/position-input/position-input.component";
import { testCoordinates } from '../../../../shared/coordinates-validator.directive';

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

    stepTransactCreditsAmount: new FormControl(0),
    stepTransactCreditsRuler: new FormControl(""),

    stepDialogCoordinates: new FormControl(""),
    stepDialogCorrectWordDe: new FormControl(""),
    stepDialogCorrectWordEn: new FormControl(""),
  });

  constructor(private questGeneratorService: QuestGeneratorService, private toasterService: ToasterService,
    private coordinatesNormalisedPipe: CoordinatesNormalisedPipe) {

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
        stepTransactCreditsAmount: step.task.amount,
        stepTransactCreditsRuler: step.task.rulerName
      });
    } else if (step != null && step.task.type == "dialogue") {
      this.stepForm.patchValue({
        stepType: "dialogue",
        stepNotificationDe: step.notification.de.customText,
        stepNotificationEn: step.notification.en?.customText,
        stepDialogCoordinates: this.coordinatesNormalisedPipe.transform(
          step.task.coordinates.x + "-" + step.task.coordinates.y + "-" + step.task.coordinates.z),
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
            this.stepForm.value.stepTransactCreditsRuler != null &&
            this.stepForm.value.stepTransactCreditsAmount > 0)
           ||
           (this.stepForm.value.stepType == 'dialogue' &&
            testCoordinates(this.stepForm.value.stepDialogCoordinates) &&
            this.stepForm.value.stepDialogCorrectWordDe != "" &&
            this.stepForm.value.stepDialogCorrectWordEn != "");
  }

  updateStep() {
    console.log(this.stepForm.value.stepTransactCreditsAmount);

    let questType = this.stepForm.value.stepType;
    let normalizedStepId = this.getNormalizedStepId(this.currentQuestStep, this.currentQuest!.steps);

    if (this.currentQuestStep == null && questType == "transactCredits") {
      let newStep: IQuestStep = this.questGeneratorService.createStep(
        normalizedStepId,
        this.stepForm.value.stepType,
        this.stepForm.value.stepNotificationDe,
        this.stepForm.value.stepNotificationEn,
        this.stepForm.value.stepTransactCreditsAmount as number,
        this.stepForm.value.stepTransactCreditsRuler,
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
        this.stepForm.value.stepDialogCoordinates,
        this.stepForm.value.stepDialogCorrectWordDe,
        this.stepForm.value.stepDialogCorrectWordEn
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
        this.stepForm.value.stepTransactCreditsRuler
      );
    } else if (this.currentQuestStep != null && questType == "dialogue") {
      this.currentQuestStep.task = this.questGeneratorService.createQuestTaskDialog(
        this.stepForm.value.stepDialogCoordinates,
        this.stepForm.value.stepDialogCorrectWordDe,
        this.stepForm.value.stepDialogCorrectWordEn
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

  switchLanguage(language: 'DE' | 'EN') {
    this.selectedLanguage = language;
  }

  resetForm() {
    this.stepForm.patchValue({
      stepType: "",
      stepNotificationDe: "",
      stepNotificationEn: "",
      stepTransactCreditsAmount: 0,
      stepTransactCreditsRuler: null,
      stepDialogCoordinates: null,
      stepDialogCorrectWordDe: "",
      stepDialogCorrectWordEn: ""
    });
  }
}
