import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChassisId, ELocalisation, EModuleId, IQuest, IQuestStep, IQuestSteps, IQuestTaskDialogue, TQuestCondition } from './quest-ud.model';
import { SelectEvent } from './quest-generator-select-file.model';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LocalStorageServiceService } from '../../shared/local-storage-service.service';
import { ConfirmationService } from 'primeng/api';
import { LoadingActionService } from '../../shared/loading-action/loading-action.service';
import { ToasterService } from '../../shared/toaster/toaster.service';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';

import { QuestGeneratorService } from './quest-generator.service';
import { QuestGeneratorGeneralUpdateComponent } from "./quest-generator-general-update/quest-generator-general-update.component";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MarkdownModule } from 'ngx-markdown';

import { EuropeanNumberFormatPipe } from "../../shared/european-number-format.pipe";
import { QuestGeneratorStepUpdateComponent } from './quest-generator-step/quest-generator-step-update/quest-generator-step-update.component';
import { QuestStepsArrayPipe } from "./quest-steps-array.pipe";
import { UniverseDawnNumberFormatPipe } from "../../shared/universe-dawn-number-format.pipe";
import { QuestGeneratorStepComponent } from "./quest-generator-step/quest-generator-step.component";
import { QuestGeneratorConditionComponent } from "./quest-generator-condition/quest-generator-condition.component";
import { QuestGeneratorNpcComponent } from "./quest-generator-npc/quest-generator-npc.component";

@Component({
  selector: 'app-quest-generator',
  standalone: true,
  imports: [
    CommonModule, TableModule, PanelModule, TabViewModule, ConfirmDialogModule, DropdownModule, DividerModule,
    FormsModule, ReactiveFormsModule, MarkdownModule, QuestGeneratorGeneralUpdateComponent, QuestGeneratorStepUpdateComponent,
    EuropeanNumberFormatPipe, QuestStepsArrayPipe, UniverseDawnNumberFormatPipe,
    QuestGeneratorStepComponent,
    QuestGeneratorConditionComponent,
    QuestGeneratorNpcComponent
],
  providers: [ ConfirmationService ],
  templateUrl: './quest-generator.component.html',
  styleUrl: './quest-generator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestGeneratorComponent implements OnInit {

  @ViewChild('selectedQuestDropdown') selectedQuestDropDown?: Dropdown;
  @ViewChild('downloadQuestLink') downloadQuestLink?: ElementRef;
  @ViewChild('questImportInput') questImportInput?: ElementRef;

  @ViewChild('questGeneratorGeneralUpdateDialog') questGeneratorgeneralUpdateDialog?: QuestGeneratorGeneralUpdateComponent;

  headerCollapsed: boolean = false;

  quests: IQuest[] = [];
  selectedQuest: IQuest | undefined;
  selectedLanguage: 'DE' | 'EN' = 'DE';

  jsonDownloadUrl: SafeUrl = "";
  jsonDownloadFilename: string = "";

  de = ELocalisation.de;
  en = ELocalisation.en;

  constructor(private questGeneratorService: QuestGeneratorService, private confirmationService: ConfirmationService, private localStorageServiceService: LocalStorageServiceService,
    private loadingActionService: LoadingActionService, private toasterService: ToasterService, private changeDedector: ChangeDetectorRef, private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    this.loadingActionService.showLoadingActionWithMessage("Loading Quests");
    this.loadQuests();
    this.loadingActionService.hideLoadingAction();
  }

  selectedQuestEvent() {
    this.headerCollapsed = true;
    this.changeDedector.detectChanges();
  }

  updateQuest(quest: IQuest | null) {
    if (quest != null) {
      this.questGeneratorgeneralUpdateDialog!.setQuest(quest, false);
    } else {
      let newQuest: IQuest = this.questGeneratorService.createNewQuest();
      this.questGeneratorgeneralUpdateDialog!.setQuest(newQuest, true);
    }

    this.questGeneratorgeneralUpdateDialog!.showUpdateDialog();
  }

  afterUpdateQuest(quest: IQuest) {
    let isAdd: boolean = this.quests.filter(q => q._id == quest._id).length == 0;

    let toSelectQuestIndex: number = -1;

    if (isAdd) {
      this.quests.push(quest);

      toSelectQuestIndex = this.quests.length - 1;
      this.selectedQuest = undefined;
    } else {
      toSelectQuestIndex = this.quests.indexOf(quest);
      this.selectedQuest = undefined;
    }

    this.saveQuests();
    this.changeDedector.detectChanges();

    // refresh required for selected quest to show correct naming, direct change does not effect the dropdown module
    setTimeout(() => {
      this.selectedQuest = this.quests[toSelectQuestIndex];
      this.headerCollapsed = true;
    }, 50);
  }

  deleteQuest(quest: IQuest) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete quest '${quest.name}' from your machine?`,
      header: 'Delete Quest',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteQuestConfirm(quest);
      },
      reject: () => {
        console.debug("rejected delete");
      }
    });
  }

  deleteQuestConfirm(quest: IQuest) {
    this.quests = this.quests.filter(q => q._id != quest._id);
    this.selectedQuest = undefined;

    this.saveQuests();
  }

  // Data Methods for loading and saving and clear
  saveQuests() {
    let questsString = JSON.stringify(this.quests);
    this.localStorageServiceService.setItem("quest-generator", "quests", questsString);
    this.changeDedector.detectChanges();
  }

  loadQuests() {
    try {
      let questsString: string | null = this.localStorageServiceService.getItem("quest-generator", "quests");

      if (questsString != null) {
        this.quests = JSON.parse(questsString);
        this.toasterService.info("Loading Quests", `Loaded ${this.quests.length} quests from your local machine.`);
      } else {
        this.quests = [];
      }
      this.changeDedector.detectChanges();
    } catch (error: any) {
      this.toasterService.error("Loading Quests", `Loading Quests from local machine failed, reason: ${error}`);
    }
  }

  clearQuests() {
    this.confirmationService.confirm({
      message: `Are you sure that you want to clear all quests from your machine?`,
      header: 'Clear Quests',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clearQuestsConfirmation();
      },
      reject: () => {
        console.debug("rejected clear");
      }
    });
  }

  clearQuestsConfirmation() {
    this.localStorageServiceService.removeItem("quest-generator", "quests");
    this.quests = [];
    this.selectedQuest = undefined;
    this.changeDedector.detectChanges();
  }

  downloadQuest(quest: IQuest) {
    let jsonQuest: string = JSON.stringify(quest, null, 2);
    let blobQuest: Blob = new Blob([jsonQuest], { type: 'application/json' });
    let currentDate = new Date();

    this.jsonDownloadUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blobQuest));
    this.jsonDownloadFilename = `${quest._id}-${currentDate.toISOString()}.json`;

    // give link short time to update
    setTimeout(() => {
      this.downloadQuestLink?.nativeElement.click();
    }, 50);
  }

  importQuest(event: any) {
    let selectedFile: File = event.target.files[0];
    console.log(selectedFile);
    this.confirmationService.confirm({
      message: `Are you sure that you want to import '${selectedFile.name}'?`,
      header: 'Import Quest',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.importQuestConfirmed(selectedFile);
      },
      reject: () => {
        console.debug("rejected import");
      }
    });
  }

  importQuestConfirmed(selectedFile: File) {
    console.log(selectedFile);
    let fileReader: FileReader = new FileReader();
    let fileText: string = 'unloaded';

    fileReader.addEventListener(
      'load',
      () => {
        console.log("inside load eventl istener");
        // this will then display a text file
        fileText = fileReader.result as string;
        this.importQuestFromFile(fileText);
        this.questImportInput!.nativeElement.value = null;
      },
      false
    );

    fileReader.readAsText(selectedFile);
  }

  importQuestFromFile(fileText: string) {
    let importQuest: IQuest = JSON.parse(fileText);
    importQuest._id = 'quest-' + (1000000 + Math.floor(Math.random() * 1000000));

    let titleExists: number = this.quests.filter(q => q.name.de.includes(importQuest.name.de)).length;
    if (titleExists > 0) {
      importQuest.name.de += ` (${titleExists})`;
      importQuest.name.en += ` (${titleExists})`;
    }

    this.quests.push(importQuest);
    this.saveQuests();

    this.selectedQuest = importQuest;
    this.headerCollapsed = true;
    this.changeDedector.detectChanges();

    this.toasterService.success("Import Quest", "Quest Imported");
  }

  switchLanguage(language: 'DE' | 'EN') {
    this.selectedLanguage = language;
    this.changeDedector.detectChanges();
  }
}
