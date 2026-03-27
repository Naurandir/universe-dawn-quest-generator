import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, model, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IQuestStep, IQuestTaskDialogue } from '../../quest-ud.model';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';

import { QuestGeneratorService } from '../../quest-generator.service';
import { ToasterService } from '../../../shared/toaster/toaster.service';
import { TranslationService } from '../../../shared/translation/translation.service';
import { LoadingActionService } from '../../../shared/loading-action/loading-action.service';
import { forkJoin } from 'rxjs';
import { QuestMarkdownEditorComponent } from "../../../shared/quest-markdown-editor/quest-markdown-editor.component";

@Component({
  selector: 'app-quest-generator-step-dialog-update',
  imports: [CommonModule, NgbModule, MarkdownModule, FormsModule, ReactiveFormsModule, DialogModule, DividerModule, QuestMarkdownEditorComponent],
  templateUrl: './quest-generator-step-dialog-update.component.html',
  styleUrl: './quest-generator-step-dialog-update.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestGeneratorStepDialogUpdateComponent {

  @Output("afterUpdateFunction") afterUpdateFunction: EventEmitter<IQuestStep> = new EventEmitter();

  currentQuestStep?: IQuestStep;
  currentQuestStepTask?: IQuestTaskDialogue;
  originalKeyDe: string | null = "";
  originalKeyEn: string | null = "";
  originalKeyFr: string | null = "";

  isAdd: boolean = false;
  visible: boolean = false;

  selectedLanguage: 'DE' | 'EN' | 'FR' = 'DE';

  stepDialogForm: FormGroup = new FormGroup({
    keyDe: new FormControl("", []),
    keyEn: new FormControl("", []),
    keyFr: new FormControl("", [])
  });

  answerDe = model<string>('');
  answerEn = model<string>('');
  answerFr = model<string>('');

  constructor(private questGeneratorService: QuestGeneratorService, private translationService: TranslationService,
    private toasterService: ToasterService, private loadingActionService: LoadingActionService, private changeDedector: ChangeDetectorRef) {

  }

  setStepDialog(key: string | null, answer: string | null, selectedLanguage: 'DE' | 'EN' | 'FR', task: IQuestTaskDialogue, step: IQuestStep) {
    this.currentQuestStep = step;
    this.currentQuestStepTask = task;
    this.originalKeyDe = selectedLanguage == 'DE' ? key : null;
    this.originalKeyEn = selectedLanguage == 'EN' ? key : null;
    this.originalKeyFr = selectedLanguage == 'FR' ? key : null;

    let answerNullSafe = answer == null ? "" : answer;

    this.stepDialogForm.patchValue({
      keyDe: this.originalKeyDe,
      keyEn: this.originalKeyEn,
      keyFr: this.originalKeyFr,
    });
    this.answerDe.set(selectedLanguage == 'DE' ? answerNullSafe : "");
    this.answerEn.set(selectedLanguage == 'EN' ? answerNullSafe : "");
    this.answerFr.set(selectedLanguage == 'FR' ? answerNullSafe : "");

    this.isAdd = key == null;
    this.selectedLanguage = selectedLanguage;
    this.changeDedector.detectChanges();
  }

  showUpdateStepDialog() {
    this.visible = true;
    this.changeDedector.detectChanges();
  }

  isFormValid() {
    // keyword not one word, button disabled
    if (this.stepDialogForm.value.keyDe != null && this.stepDialogForm.value.keyDe.includes(" ")) {
      return false;
    }

    if (this.stepDialogForm.value.keyEn != null && this.stepDialogForm.value.keyEn.includes(" ")) {
      return false;
    }

    if (this.stepDialogForm.value.keyFr != null && this.stepDialogForm.value.keyFr.includes(" ")) {
      return false;
    }

    // for add everything needs to be filled out
    if (this.isAdd) {
      return this.stepDialogForm.value.keyDe != null && this.stepDialogForm.value.keyDe != "" &&
        this.stepDialogForm.value.keyEn != null && this.stepDialogForm.value.keyEn != "" &&
        this.stepDialogForm.value.keyFr != null && this.stepDialogForm.value.keyFr != "" &&
        this.answerDe() != null && this.answerDe() != "" &&
        this.answerEn() != null && this.answerEn() != "" &&
        this.answerFr() != null && this.answerFr();
    }

    // for update of de only de needs to be filled out
    if (!this.isAdd && this.selectedLanguage == 'DE') {
      return this.stepDialogForm.value.keyDe != null && this.stepDialogForm.value.keyDe != "" &&
        this.answerDe() != null && this.answerDe() != "";
    } else if (!this.isAdd && this.selectedLanguage == 'EN') {
      return this.stepDialogForm.value.keyEn != null && this.stepDialogForm.value.keyEn != "" &&
        this.answerEn() != null && this.answerEn() != "";
    } else if (!this.isAdd && this.selectedLanguage == 'FR') {
      return this.stepDialogForm.value.keyFr != null && this.stepDialogForm.value.keyFr != "" &&
        this.answerFr() != null && this.answerFr() != "";
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
        this.stepDialogForm.value.keyFr.toLowerCase(),
        this.answerDe(),
        this.answerEn(),
        this.answerFr(),
        this.currentQuestStepTask!);
    } else if (!this.isAdd && this.selectedLanguage == 'DE') {
      this.questGeneratorService.updateQuestDialog(
        this.originalKeyDe!,
        this.stepDialogForm.value.keyDe.toLowerCase(),
        this.answerDe(),
        this.selectedLanguage,
        this.currentQuestStepTask!);
    } else if (!this.isAdd && this.selectedLanguage == 'EN') {
      this.questGeneratorService.updateQuestDialog(
        this.originalKeyEn!,
        this.stepDialogForm.value.keyEn.toLowerCase(),
        this.answerEn(),
        this.selectedLanguage,
        this.currentQuestStepTask!);
    } else if (!this.isAdd && this.selectedLanguage == 'FR') {
      this.questGeneratorService.updateQuestDialog(
        this.originalKeyFr!,
        this.stepDialogForm.value.keyFr.toLowerCase(),
        this.answerFr(),
        this.selectedLanguage,
        this.currentQuestStepTask!);
    }

    this.visible = false;
    this.toasterService.success("Update Dialog Option", "Dialog Option Succesfully Updated");

    this.afterUpdateFunction.emit(this.currentQuestStep!);

    this.stepDialogForm.reset();
    this.changeDedector.detectChanges();
  }

  private isKeyAlreadyInUse(): boolean {
    try {
      let keysDeInUse: string[] = Object.keys(this.currentQuestStepTask!.dialogues['de']);
      let currentKeyDeInList: boolean = keysDeInUse.includes(this.stepDialogForm.value.keyDe);

      let keysEnInUse: string[] = Object.keys(this.currentQuestStepTask!.dialogues['en']);
      let currentKeyEnInList: boolean = keysEnInUse.includes(this.stepDialogForm.value.keyEn);

      let keysFrInUse: string[] = Object.keys(this.currentQuestStepTask!.dialogues['fr']);
      let currentKeyFrInList: boolean = keysFrInUse.includes(this.stepDialogForm.value.keyFr);

      // for add all keys are not allowed to be in a list already
      if (this.isAdd && (currentKeyDeInList || currentKeyEnInList || currentKeyFrInList)) {
        return true;
      }

      // swichting to a new key that is already in use, not allowed
      if (currentKeyDeInList && this.originalKeyDe != this.stepDialogForm.value.keyDe && this.selectedLanguage == 'DE') {
        return true;
      }

      if (currentKeyEnInList && this.originalKeyEn != this.stepDialogForm.value.keyEn && this.selectedLanguage == 'EN') {
        return true;
      }

      if (currentKeyFrInList && this.originalKeyFr != this.stepDialogForm.value.keyFr && this.selectedLanguage == 'FR') {
        return true;
      }

      return false;
    } catch (e) {
      console.warn(e);
      console.warn("something went wrong on check, return false to fix it by update maybe");
      return false;
    }
  }

  get keywordDe() {
    return this.stepDialogForm.get('keyDe');
  }

  get keywordEn() {
    return this.stepDialogForm.get('keyEn');
  }

  get keywordFr() {
    return this.stepDialogForm.get('keyFr');
  }

  switchLanguage(language: 'DE' | 'EN' | 'FR') {
    this.selectedLanguage = language;
    this.changeDedector.detectChanges();
  }

  translateToCurrentLanguage() {
    let currentLanguage = this.selectedLanguage;
    let keywordText = currentLanguage == 'DE' ? this.stepDialogForm.value.keyEn : this.stepDialogForm.value.keyDe;
    let answerText = currentLanguage == 'DE' ? this.answerEn() : this.answerDe();
    let languageFrom: 'de' | 'en' = currentLanguage == 'DE' ? 'en' : 'de';
    let languageTo: 'de' | 'en' = currentLanguage == 'DE' ? 'de' : 'en'

    if (answerText == null || answerText == "" || keywordText == null || keywordText == "") {
      this.toasterService.warn("Translation", "Translation requires non empty input for keyword and answer.");
      return;
    }

    this.loadingActionService.showLoadingActionWithMessage("translation ongoing...");
    let calls = [
      this.translationService.translateServerCall(languageFrom, languageTo, keywordText),
      this.translationService.translateServerCall(languageFrom, languageTo, answerText)
    ];

    forkJoin(calls).subscribe({
      next: (response) => {
        if (currentLanguage == 'DE') {
          this.stepDialogForm.patchValue({
            keyDe: response[0]
          });
          this.answerDe.set(response[1]);
        } else if (currentLanguage == 'EN') {
          this.stepDialogForm.patchValue({
            keyEn: response[0]
          });
          this.answerEn.set(response[1]);
        } else if (currentLanguage == 'FR') {
          this.stepDialogForm.patchValue({
            keyFr: response[0]
          });
          this.answerFr.set(response[1]);
        }
        this.toasterService.success("Translation", `Translation to ${languageTo.toUpperCase()} worked.`);
        this.loadingActionService.hideLoadingAction();
        this.changeDedector.detectChanges();
      },
      error: (error) => {
        this.toasterService.error("Translation", `Translation to ${languageTo.toUpperCase()} failed. Reason: ${error}`);
        this.loadingActionService.hideLoadingAction();
        this.changeDedector.detectChanges();
      }
    });
  }
}
