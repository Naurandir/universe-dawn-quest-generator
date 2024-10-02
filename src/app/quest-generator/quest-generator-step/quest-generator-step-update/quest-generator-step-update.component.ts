import { TranslationService } from './../../../shared/translation/translation.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ELocalisation, IQuest, IQuestPrepareNpcs, IQuestStep, IQuestSteps, IQuestTaskDialogue, IQuestTaskTransactCredits } from '../../quest-ud.model';

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
import { forkJoin } from 'rxjs';
import { LoadingActionService } from '../../../shared/loading-action/loading-action.service';

@Component({
  selector: 'app-quest-generator-step-update',
  standalone: true,
  imports: [ CommonModule, NgbModule, MarkdownModule, FormsModule, ReactiveFormsModule, DialogModule, DropdownModule,
             InputNumberModule, DividerModule, PositionInputComponent ],
  templateUrl: './quest-generator-step-update.component.html',
  styleUrl: './quest-generator-step-update.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(private questGeneratorService: QuestGeneratorService, private toasterService: ToasterService,
    private loadingActionService: LoadingActionService, private translationService: TranslationService, private changeDedector: ChangeDetectorRef) {

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
    this.changeDedector.detectChanges();
  }

  showUpdateDialog() {
    this.visible = true;
    this.selectedLanguage = 'DE';
    this.changeDedector.detectChanges();
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
    let questType: string = this.stepForm.value.stepType;
    let normalizedStepId = this.getNormalizedStepId(this.currentQuestStep, this.currentQuest!.steps);

    if(this.currentQuestStep == null) {
      this.currentQuestStep = this.createStep(normalizedStepId, questType);
    } else {
      this.updateExistingStep(this.currentQuestStep!, questType);
    }

    this.visible = false;
    this.afterUpdateFunction.emit(this.currentQuestStep!);
    this.toasterService.success("Step Update","Step succesfully updated");
    this.resetForm();
    this.changeDedector.detectChanges();
  }

  private createStep(normalizedStepId: string, type: string): IQuestStep {
    let newStep: IQuestStep | null = null;
    if (type == "transactCredits") {
      newStep = this.questGeneratorService.createStep(
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
    } else {
      newStep = this.questGeneratorService.createStep(
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
    }

    return newStep!;
  }

  private updateExistingStep(questStep: IQuestStep, questType: string) {
    // general data
    questStep.notification = {
      de: {
        customText: this.stepForm.value.stepNotificationDe,
        variables: {}
      }
    };
    if (this.stepForm.value.stepNotificationEn != null) {
      questStep.notification.en = {
        customText: this.stepForm.value.stepNotificationEn,
        variables: {}
      };
    }

    // type switch
    if(questType == "transactCredits" && questStep.task.type != "transactCredits") {
      questStep.task = this.questGeneratorService.createQuestTaskTransactCredits(
        this.stepForm.value.stepTransactCreditsAmount,
        this.stepForm.value.stepChosendNpc.rulerName
      );
      return;
    } else if (questType == "dialogue" && questStep.task.type != "dialogue") {
      questStep.task = this.questGeneratorService.createQuestTaskDialog(
        this.stepForm.value.stepChosendNpc.planet.coordinates.x + "-" + this.stepForm.value.stepChosendNpc.planet.coordinates.y + "-" + this.stepForm.value.stepChosendNpc.planet.coordinates.z,
        this.stepForm.value.stepDialogCorrectWordDe.toLowerCase(),
        this.stepForm.value.stepDialogCorrectWordEn.toLowerCase()
      );
      return;
    }

    // type stayed, only update
    if(questType == "transactCredits" && questStep.task.type == "transactCredits") {
      let task: IQuestTaskTransactCredits = questStep.task;

      task.amount = this.stepForm.value.stepTransactCreditsAmount as number;
      task.rulerName = this.stepForm.value.stepChosendNpc.rulerName;
    } else if (questType == "dialogue" && questStep.task.type == "dialogue") {
      let task: IQuestTaskDialogue = questStep.task;

      task.correctDialogueWord = {
        [ELocalisation.de]: this.stepForm.value.stepDialogCorrectWordDe.toLowerCase(),
        [ELocalisation.en]: this.stepForm.value.stepDialogCorrectWordEn.toLowerCase()
      };
      task.coordinates = {
        x: this.stepForm.value.stepChosendNpc.planet.coordinates.x,
        y: this.stepForm.value.stepChosendNpc.planet.coordinates.y,
        z: this.stepForm.value.stepChosendNpc.planet.coordinates.z
      };
    }
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

  translateToCurrentLanguage() {
    let currentLanguage = this.selectedLanguage;
    let type = this.stepForm.value.stepType;
    let keywordText = currentLanguage == 'DE' ? this.stepForm.value.stepDialogCorrectWordEn : this.stepForm.value.stepDialogCorrectWordDe;
    let notificationText = currentLanguage == 'DE' ? this.stepForm.value.stepNotificationEn : this.stepForm.value.stepNotificationDe;
    let languageFrom: 'de' | 'en' = currentLanguage == 'DE' ? 'en' : 'de';
    let languageTo: 'de' | 'en' = currentLanguage == 'DE' ? 'de' : 'en'

    if (notificationText == null || notificationText == "" || type == "dialogue" && (keywordText == null || keywordText == "")) {
      this.toasterService.warn("Translation","Translation requires non empty input for title and notification.");
      return;
    }

    let calls = [
      this.translationService.translate(languageFrom, languageTo, notificationText)
    ];

    if (type == "dialogue") {
      calls.push(this.translationService.translate(languageFrom, languageTo, keywordText));
    }

    this.loadingActionService.showLoadingActionWithMessage("translation ongoing...");
    forkJoin(calls).subscribe({
      next: (response) => {
        if (currentLanguage == 'DE') {
          this.stepForm.patchValue({
            stepNotificationDe: response[0]
          });
        } else {
          this.stepForm.patchValue({
            stepNotificationEn: response[0]
          });
        }

        if (type == "dialogue" && currentLanguage == 'DE') {
          this.stepForm.patchValue({
            stepDialogCorrectWordDe: response[1]
          });
        } else if (type == "dialogue" && currentLanguage == 'EN') {
          this.stepForm.patchValue({
            stepDialogCorrectWordEn: response[1]
          });
        }
        this.toasterService.success("Translation",`Translation to ${languageTo.toUpperCase()} worked.`);
        this.loadingActionService.hideLoadingAction();
        this.changeDedector.detectChanges();
      },
      error: (error) => {
        this.toasterService.error("Translation",`Translation to ${languageTo.toUpperCase()} failed. Reason: ${error}`);
        this.loadingActionService.hideLoadingAction();
        this.changeDedector.detectChanges();
      }
    });
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
