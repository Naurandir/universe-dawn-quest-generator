import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, model, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ELocalisation, IQuest, IQuestNotification, IQuestNotificationAllLang } from '../quest-ud.model';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';

import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';

import { ToasterService } from '../../shared//toaster/toaster.service';
import { TranslationService } from '../../shared/translation/translation.service';
import { LoadingActionService } from '../../shared/loading-action/loading-action.service';
import { forkJoin } from 'rxjs';
import { QuestMarkdownEditorComponent } from "../../shared/quest-markdown-editor/quest-markdown-editor.component";
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
    selector: 'app-quest-generator-general-update',
    imports: [CommonModule, NgbModule, MarkdownModule, FormsModule, ReactiveFormsModule, DialogModule, SelectModule, TextareaModule, DividerModule, QuestMarkdownEditorComponent],
    providers: [Clipboard],
    templateUrl: './quest-generator-general-update.component.html',
    styleUrl: './quest-generator-general-update.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestGeneratorGeneralUpdateComponent {

  @Output("afterUpdateFunction") afterUpdateFunction: EventEmitter<IQuest> = new EventEmitter();

  visible: boolean = false;
  isAdd: boolean = false;

  currentQuest?: IQuest;

  selectedLanguage = model<'DE' | 'EN' | 'FR'>('DE');
  notificationDe = model<string>('');
  notificationEn = model<string>('');
  notificationFr = model<string>('');

  nameDe: string = '';
  nameEn: string = '';
  nameFr: string = '';

  generalUpdateConditionForm: FormGroup = new FormGroup({
    questConditionType: new FormControl("", [Validators.required]),
    questConditionPoints: new FormControl(0),
    questConditionJob: new FormControl(null),
    questConditionModuleResearched: new FormControl(null),
    questConditionChassisResearched: new FormControl(null),
    questConditionBuildingType: new FormControl(null),
    questConditionBuildingLevel: new FormControl(0)
  });

  constructor(private translationService: TranslationService,
    private toasterService: ToasterService, private loadingActionService: LoadingActionService, private changeDedector: ChangeDetectorRef) {

  }

  setQuest(quest: IQuest, isAdd: boolean): void {
    this.isAdd = isAdd;
    this.currentQuest = quest;

    this.nameDe = quest.name[ELocalisation.de];
    this.nameEn = quest.name[ELocalisation.en];
    this.nameFr = quest.name[ELocalisation.fr];
    this.notificationDe.set(quest.notification.de.customText);
    this.notificationEn.set(quest.notification.en == undefined ? '' : quest.notification.en.customText);
    this.notificationFr.set(quest.notification.fr == undefined ? '' : quest.notification.fr.customText);

    this.changeDedector.detectChanges();
  }

  showUpdateDialog() {
    this.visible = true;
    this.selectedLanguage.set('DE');
    this.changeDedector.detectChanges();
  }

  switchLanguage(language: 'DE' | 'EN' | 'FR') {
    this.selectedLanguage.set(language);
    this.changeDedector.detectChanges();
  }

  updateQuest() {
    let notificationDe: IQuestNotification = {
      customText: this.notificationDe(),
      variables: {}
    };

    let notificationEn: IQuestNotification = {
      customText: this.notificationEn(),
      variables: {}
    };

    let notificationFr: IQuestNotification = {
      customText: this.notificationFr(),
      variables: {}
    };

    this.currentQuest!.name[ELocalisation.de] = this.nameDe;
    this.currentQuest!.name[ELocalisation.en] = this.nameEn;
    this.currentQuest!.name[ELocalisation.fr] = this.nameFr;
    let notification: IQuestNotificationAllLang = {
      de: notificationDe,
      en: notificationEn,
      fr: notificationFr
    };
    this.currentQuest!.notification = notification;

    this.visible = false;
    this.afterUpdateFunction.emit(this.currentQuest);
    this.toasterService.success("Update Quest", `General Information of Quest '${this.currentQuest?.name}' was successfully updated.`);

    this.changeDedector.detectChanges();
  }

  translateToCurrentLanguage() {
    let currentLanguage = this.selectedLanguage();
    let titleText = (currentLanguage == 'DE' ? this.nameEn : this.nameDe);
    let notificationText = (currentLanguage == 'DE' ? this.notificationEn() : this.notificationDe());
    let languageFrom: 'de' | 'en' = (currentLanguage == 'DE' ? 'en' : 'de');
    let languageTo: string = this.selectedLanguage().toLocaleLowerCase()

    if (notificationText == null || notificationText == "" || titleText == null || titleText == "") {
      this.toasterService.warn("Translation","Translation requires non empty input for title and notification.");
      return;
    }

    this.loadingActionService.showLoadingActionWithMessage("translation ongoing...");
    let calls = [
      this.translationService.translateServerCall(languageFrom, languageTo, titleText),
      this.translationService.translateServerCall(languageFrom, languageTo, notificationText)
    ];

    forkJoin(calls).subscribe({
      next: (response) => {
        if (currentLanguage == 'DE') {
          this.nameDe = response[0];
          this.notificationDe.set(response[1]);
        } else if (currentLanguage == 'EN') {
          this.nameEn = response[0];
          this.notificationEn.set(response[1]);
        } else if (currentLanguage == 'FR') {
          this.nameFr = response[0];
          this.notificationFr.set(response[1]);
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

  prepareAiPrompt() {
    // only german will be translated by english, en + fr from german
    let sourceLanguage = this.selectedLanguage() == 'DE' ?  "EN" : "DE";
    let sourceTitle = this.selectedLanguage() == 'DE' ?  this.nameEn : this.nameDe;
    let sourceText = this.selectedLanguage() == 'DE' ?  this.notificationEn() : this.notificationDe();

    this.translationService.copyAiPrompt(sourceLanguage, this.selectedLanguage(), sourceTitle, sourceText);
  }

  isGeneralQuestDataFilledOut(): boolean {
    if (this.nameDe == '' || this.nameEn == '') {
      return false;
    }

    if (this.notificationDe() == '' || this.notificationEn() == '') {
      return false;
    }

    return true;
  }
}
