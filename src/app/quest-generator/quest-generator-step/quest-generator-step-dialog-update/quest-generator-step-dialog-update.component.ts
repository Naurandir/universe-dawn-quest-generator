import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IQuestTaskDialogue } from '../../quest-ud.model';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';

import { QuestGeneratorService } from '../../quest-generator.service';
import { ToasterService } from '../../../shared/toaster/toaster.service';

@Component({
  selector: 'app-quest-generator-step-dialog-update',
  standalone: true,
  imports: [CommonModule, NgbModule, MarkdownModule, FormsModule, ReactiveFormsModule, DialogModule, DividerModule ],
  templateUrl: './quest-generator-step-dialog-update.component.html',
  styleUrl: './quest-generator-step-dialog-update.component.css'
})
export class QuestGeneratorStepDialogUpdateComponent {

  @Output("afterUpdateFunction") afterUpdateFunction: EventEmitter<VoidFunction> = new EventEmitter();

  currentQuestStepTask?: IQuestTaskDialogue;
  originalKeyDe: string | null = "";
  originalKeyEn: string | null = "";

  isAdd: boolean = false;
  visible: boolean = false;

  selectedLanguage: 'DE' | 'EN' = 'DE';

  stepDialogForm: FormGroup = new FormGroup({
    keyDe: new FormControl("", []),
    keyEn: new FormControl("", []),
    answerDe: new FormControl("", []),
    answerEn: new FormControl("", [])
  });

  constructor(private questGeneratorService: QuestGeneratorService, private toasterService: ToasterService) {

  }

  setStepDialog(key: string | null, answer: string | null, selectedLanguage: 'DE' | 'EN', task: IQuestTaskDialogue) {
    this.currentQuestStepTask = task;
    this.originalKeyDe = selectedLanguage == 'DE' ? key : null;
    this.originalKeyEn = selectedLanguage == 'EN' ? key : null;

    let answerNullSafe = answer == null ? "" : answer;

    this.stepDialogForm.patchValue({
      keyDe: this.originalKeyDe,
      keyEn: this.originalKeyEn,
      answerDe: selectedLanguage == 'DE' ? answerNullSafe : "",
      answerEn: selectedLanguage == 'EN' ? answerNullSafe : ""
    });

    this.isAdd = key == null;
    this.selectedLanguage = selectedLanguage;
  }

  showUpdateStepDialog() {
    this.visible = true;
  }

  isFormValid() {
    // keyword not one word, button disabled
    if (this.stepDialogForm.value.keyDe != null && this.stepDialogForm.value.keyDe.includes(" ")) {
      return false;
    }

    if (this.stepDialogForm.value.keyEn != null && this.stepDialogForm.value.keyEn.includes(" ")) {
      return false;
    }

    // for add everything needs to be filled out
    if (this.isAdd) {
      return this.stepDialogForm.value.keyDe != null && this.stepDialogForm.value.keyDe != "" &&
        this.stepDialogForm.value.keyEn != null && this.stepDialogForm.value.keyEn != "" &&
        this.stepDialogForm.value.answerDe != null && this.stepDialogForm.value.answerDe != "" &&
        this.stepDialogForm.value.answerEn != null && this.stepDialogForm.value.answerEn != "";
    }

    // for update of de only de needs to be filled out
    if (!this.isAdd && this.selectedLanguage == 'DE') {
      return this.stepDialogForm.value.keyDe != null && this.stepDialogForm.value.keyDe != "" &&
        this.stepDialogForm.value.answerDe != null && this.stepDialogForm.value.answerDe != "";
    } else if(!this.isAdd && this.selectedLanguage == 'EN') {
      return this.stepDialogForm.value.keyEn != null && this.stepDialogForm.value.keyEn != "" &&
        this.stepDialogForm.value.answerEn != null && this.stepDialogForm.value.answerEn != "";
    }

    throw new Error("Form should always be add OR update with language. This combination here is not valid.");
  }

  updateStepDialog() {
    if (this.isKeyAlreadyInUse()) {
      this.toasterService.warn("Update Dialog Option",
        "Dialog Option cannot be created / updated, the given keyword is already in use, please consider another word");
      return;
    }
    if (this.isAdd) {
      this.questGeneratorService.addQuestDialog(
        this.stepDialogForm.value.keyDe.toLowerCase(),
        this.stepDialogForm.value.keyEn.toLowerCase(),
        this.stepDialogForm.value.answerDe,
        this.stepDialogForm.value.answerEn,
        this.currentQuestStepTask!);
    } else if (!this.isAdd && this.selectedLanguage == 'DE') {
      this.questGeneratorService.updateQuestDialog(
        this.originalKeyDe!,
        this.stepDialogForm.value.keyDe.toLowerCase(),
        this.stepDialogForm.value.answerDe,
        this.selectedLanguage,
        this.currentQuestStepTask!);
    } else if (!this.isAdd && this.selectedLanguage == 'EN') {
      this.questGeneratorService.updateQuestDialog(
        this.originalKeyEn!,
        this.stepDialogForm.value.keyEn.toLowerCase(),
        this.stepDialogForm.value.answerEn,
        this.selectedLanguage,
        this.currentQuestStepTask!);
    }

    this.visible = false;
    this.toasterService.success("Update Dialog Option","Dialog Option Succesfully Updated");

    this.afterUpdateFunction.emit();

    this.stepDialogForm.reset();
  }

  private isKeyAlreadyInUse(): boolean {
    let keysDeInUse: string[] = Object.keys(this.currentQuestStepTask!.dialogues['de']);
    let currentKeyDeInList: boolean = keysDeInUse.includes(this.stepDialogForm.value.keyDe);

    let keysEnInUse: string[] = Object.keys(this.currentQuestStepTask!.dialogues['en']);
    let currentKeyEnInList: boolean = keysEnInUse.includes(this.stepDialogForm.value.keyEn);

    // for add both keys are not allowed to be in a list already
    if (this.isAdd && (currentKeyDeInList || currentKeyEnInList)) {
      return true;
    }

    // swichting to a new key that is already in use, not allowed
    if(currentKeyDeInList && this.originalKeyDe != this.stepDialogForm.value.keyDe && this.selectedLanguage == 'DE') {
      return true;
    }

    if(currentKeyEnInList && this.originalKeyEn != this.stepDialogForm.value.keyEn && this.selectedLanguage == 'EN') {
      return true;
    }

    return false;
  }

  get keywordDe() {
    return this.stepDialogForm.get('keyDe');
  }

  get keywordEn() {
    return this.stepDialogForm.get('keyEn');
  }

  switchLanguage(language: 'DE' | 'EN') {
    this.selectedLanguage = language;
  }
}
