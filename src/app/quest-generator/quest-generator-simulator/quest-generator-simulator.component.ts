import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ELocalisation, IQuest, IQuestStep, IQuestTaskDialogue, IQuestTaskTransactCredits } from '../quest-ud.model';

import { MarkdownModule } from 'ngx-markdown';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
    selector: 'app-quest-generator-simulator',
    imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, MarkdownModule, DialogModule, SelectModule, DividerModule, InputNumberModule],
    templateUrl: './quest-generator-simulator.component.html',
    styleUrl: './quest-generator-simulator.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestGeneratorSimulatorComponent {

  visible: boolean = false;
  selectedLanguage: 'DE' | 'EN' = 'DE';

  currentQuest?: IQuest;
  currentSteps: IQuestStep[] = [];

  selectedStep?: IQuestStep;
  selectedStepType?: 'dialogue' | 'transactCredits';
  selectedStepTaskDialogue?: IQuestTaskDialogue;
  selectedStepTaskTransaction?: IQuestTaskTransactCredits;

  creditsCorrect: boolean | undefined;
  creditsAmountInput: number | undefined;

  messageCorrect: boolean = true;
  chatHistory: string[] = [];
  foundKeyWord: boolean = false;
  messageForm: FormGroup = new FormGroup({
    chatMessage: new FormControl("", [Validators.required])
  });

  constructor(private changeDedector: ChangeDetectorRef) {

  }

  setQuest(quest: IQuest): void {
    this.currentQuest = quest;
    this.currentSteps = Object.entries(quest.steps).map(([key, value]) => value);
    this.changeDedector.detectChanges();
  }

  showSimulator(): void {
    this.visible = true;
    this.changeDedector.detectChanges();
  }

  resetSimulator(): void {
    this.selectedStep = undefined;
    this.selectedStepType = undefined;
    this.selectedStepTaskDialogue = undefined;
    this.selectedStepTaskTransaction = undefined;
    this.creditsCorrect = undefined;
    this.messageCorrect = true;
    this.chatHistory = [];
    this.foundKeyWord = false;
    this.changeDedector.detectChanges();
  }

  switchLanguage(language: 'DE' | 'EN') {
    this.selectedLanguage = language;
    this.resetChatHistory();
    this.changeDedector.detectChanges();
  }

  selectedStepEvent(): void {
    if (this.selectedStep?.task.type.toString() == 'dialogue') {
      this.selectedStepType = 'dialogue';
      this.selectedStepTaskDialogue = this.selectedStep.task as IQuestTaskDialogue;
    } else {
      this.selectedStepType = 'transactCredits';
      this.selectedStepTaskTransaction = this.selectedStep!.task as IQuestTaskTransactCredits;
    }
    this.changeDedector.detectChanges();
  }

  getLastNotificationEn(): string {
    if (this.selectedStep?.id == '00') {
      return this.currentQuest?.notification.en!.customText!;
    }

    let stepBefore: IQuestStep = this.getQuestStepBeforeSelected();
    return stepBefore.notification.en!.customText!;
  }

  getLastNotificationDe(): string {
    if (this.selectedStep?.id == '00') {
      return this.currentQuest?.notification.de.customText!;
    }

    let stepBefore: IQuestStep = this.getQuestStepBeforeSelected();
    return stepBefore.notification.de.customText!;
  }

  private getQuestStepBeforeSelected(): IQuestStep {
    let index = this.currentSteps.indexOf(this.selectedStep!);

    return this.currentSteps[index - 1];
  }

  checkTransactCredits(): void {
    this.creditsCorrect = this.selectedStepTaskTransaction?.amount == (this.creditsAmountInput as number);
  }

  createMessageResponse(): void {
    // init
    this.foundKeyWord = false;
    this.messageCorrect = true;
    let currentLocalisation: ELocalisation = this.selectedLanguage == 'DE' ? ELocalisation.de : ELocalisation.en;

    // process
    let chatMessage: string = this.messageForm.value.chatMessage;
    this.messageForm.reset();

    // check on solution keyword
    if (chatMessage == this.selectedStepTaskDialogue?.correctDialogueWord[currentLocalisation]) {
      this.foundKeyWord = true;
      if (this.selectedLanguage == 'DE') {
        this.chatHistory.push(this.selectedStep!.notification.de.customText);
      } else {
        this.chatHistory.push(this.selectedStep!.notification.en!.customText);
      }
      this.changeDedector.detectChanges();
      return;
    }

    // if not solution keyword check on message answers and add to found answers
    let answer: string | undefined = this.selectedStepTaskDialogue!.dialogues[currentLocalisation][chatMessage.toLocaleLowerCase()];

    if (answer != undefined && answer != '') {
      this.messageCorrect = true;
      this.chatHistory.push(answer);
      this.changeDedector.detectChanges();
      return;
    }

    // nothing found, let user know it
    this.messageCorrect = false;
    this.changeDedector.detectChanges();
  }

  resetChatHistory() {
    this.chatHistory = [];
    this.messageCorrect = true;
    this.foundKeyWord = false;

    this.changeDedector.detectChanges();
  }
}
