import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ELocalisation, IQuest, IQuestNotification, IQuestNotificationAllLang } from '../quest-ud.model';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';

import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';

import { ToasterService } from '../../../shared/toaster/toaster.service';

@Component({
  selector: 'app-quest-generator-general-update',
  standalone: true,
  imports: [ CommonModule, NgbModule, MarkdownModule, FormsModule, ReactiveFormsModule, DialogModule, DropdownModule, InputTextareaModule, DividerModule ],
  templateUrl: './quest-generator-general-update.component.html',
  styleUrl: './quest-generator-general-update.component.css'
})
export class QuestGeneratorGeneralUpdateComponent {

  @Output("afterUpdateFunction") afterUpdateFunction: EventEmitter<IQuest> = new EventEmitter();

  visible: boolean = false;
  isAdd: boolean = false;
  selectedLanguage: 'DE' | 'EN' = 'DE';

  currentQuest?: IQuest;

  generalUpdateForm: FormGroup = new FormGroup({
    nameDe: new FormControl("", [Validators.required]),
    nameEn: new FormControl("", [Validators.required]),
    notificationDe: new FormControl("", [Validators.required]),
    notificationEn: new FormControl(null)
  });

  generalUpdateConditionForm: FormGroup = new FormGroup({
    questConditionType: new FormControl("", [Validators.required]),
    questConditionPoints: new FormControl(0),
    questConditionJob: new FormControl(null),
    questConditionModuleResearched: new FormControl(null),
    questConditionChassisResearched: new FormControl(null),
    questConditionBuildingType: new FormControl(null),
    questConditionBuildingLevel: new FormControl(0)
  });

  constructor(private toasterService: ToasterService) {

  }

  setQuest(quest: IQuest, isAdd: boolean): void {
    this.isAdd = isAdd;
    this.currentQuest = quest;

    this.generalUpdateForm.setValue({
      nameDe: quest.name[ELocalisation.de],
      nameEn: quest.name[ELocalisation.en],
      notificationDe: quest.notification.de.customText,
      notificationEn: quest.notification.en?.customText
    });
  }

  showUpdateDialog() {
    this.visible = true;
    this.selectedLanguage = 'DE';
  }

  switchLanguage(language: 'DE' | 'EN') {
    this.selectedLanguage = language;
  }

  updateQuest() {
    let notificationDe: IQuestNotification = {
      customText: this.generalUpdateForm.value.notificationDe,
      variables: {}
    };

    let notificationEn: IQuestNotification = {
      customText: this.generalUpdateForm.value.notificationEn,
      variables: {}
    };

    this.currentQuest!.name[ELocalisation.de] = this.generalUpdateForm.value.nameDe;
    this.currentQuest!.name[ELocalisation.en] = this.generalUpdateForm.value.nameEn;
    let notification: IQuestNotificationAllLang = {
      de: notificationDe,
      en: notificationEn
    };
    this.currentQuest!.notification = notification;

    this.visible = false;
    this.afterUpdateFunction.emit(this.currentQuest);
    this.toasterService.success("Update Quest", `General Information of Quest '${this.currentQuest?.name}' was successfully updated.`);

    this.generalUpdateForm.reset();
  }
}
