import { QuestGeneratorService } from './../../quest-generator.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EAllowedJobs, EBuildingType, EChassisId, EModuleId, EQuestCondition, IQuest, IQuestConditionBuilding, IQuestConditionChassisBuilt, IQuestConditionChassisResearched, IQuestConditionJob, IQuestConditionModuleResearched, IQuestConditionPoints, TQuestCondition } from '../../quest-ud.model';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToasterService } from '../../../shared/toaster/toaster.service';
import { EnumToArrayPipe } from '../../../shared/enum-to-array.pipe';

@Component({
    selector: 'app-quest-generator-condition-update',
    imports: [CommonModule, DialogModule, DropdownModule, InputNumberModule, FormsModule, ReactiveFormsModule, EnumToArrayPipe],
    templateUrl: './quest-generator-condition-update.component.html',
    styleUrl: './quest-generator-condition-update.component.css'
})
export class QuestGeneratorConditionUpdateComponent {
  @Output("afterUpdateFunction") afterUpdateFunction: EventEmitter<TQuestCondition> = new EventEmitter();

  currentCondition?: TQuestCondition | null;
  currentQuest?: IQuest;

  visible: boolean = false;
  isAdd: boolean = false;

  conditionTypes = EQuestCondition;
  allowedJobs = EAllowedJobs;
  modules = EModuleId;
  chassis = EChassisId;
  buildings = EBuildingType;

  conditionForm: FormGroup = new FormGroup({
    questConditionType: new FormControl("", [Validators.required]),
    questConditionPoints: new FormControl(0),
    questConditionJob: new FormControl(""),
    questConditionModuleResearched: new FormControl(""),
    questConditionChassisResearched: new FormControl(""),
    questConditionChassisBuilt: new FormControl(""),
    questConditionBuildingType: new FormControl(""),
    questConditionBuildingLevel: new FormControl(0)
  });

  constructor(public readonly questGeneratorService: QuestGeneratorService, private toasterService: ToasterService) {

  }

  showUpdateDialog() {
    this.visible = true;
  }

  public setCondition(quest: IQuest, condition: TQuestCondition | null) {
    this.resetForm();

    this.currentCondition = condition;
    this.currentQuest = quest;

    this.isAdd = condition == null;

    if (condition != null && (condition.type == "points")) {
      this.conditionForm.patchValue({
        questConditionType: {key: "points", value: "points"},
        questConditionPoints: condition.value as number
      });
    } else if (condition != null && (condition.type == "job")) {
      this.conditionForm.patchValue({
        questConditionType: {key: "job", value: "job"},
        questConditionJob: {key: condition.value, value: condition.value}
      });
    } else if (condition != null && (condition.type == "moduleResearched")) {
      this.conditionForm.patchValue({
        questConditionType: {key: "moduleResearched", value: "moduleResearched"},
        questConditionModuleResearched: {key: condition.value, value: this.modules[condition.value as number]}
      });
    } else if (condition != null && (condition.type == "chassisResearched")) {
      this.conditionForm.patchValue({
        questConditionType: {key: "chassisResearched", value: "chassisResearched"},
        questConditionChassisResearched: {key: condition.value, value: this.chassis[condition.value as number]}
      });
    } else if (condition != null && (condition.type == "chassisBuilt")) {
      this.conditionForm.patchValue({
        questConditionType: {key: "chassisBuilt", value: "chassisBuilt"},
        questConditionChassisBuilt: {key: condition.value, value: this.chassis[condition.value as number]}
      });
    } else if (condition != null && (condition.type == "building")) {
      this.conditionForm.patchValue({
        questConditionType: {key: "building", value: "building"},
        questConditionBuildingType: {key: condition.value, value: condition.value},
        questConditionBuildingLevel: condition.amount
      });
    }
  }

  public updateCondition() {
    switch(this.conditionForm.value.questConditionType.value) {
      case "points": this.updatePointsCondition(); break;
      case "job": this.updateJobCondition(); break;
      case "moduleResearched": this.updateModuleResearchedCondition(); break;
      case "chassisResearched": this.updateChassisResearchedCondition(); break;
      case "chassisBuilt": this.updateChassisBuiltCondition(); break;
      case "building": this.updateBuildingCondition(); break;
      default: this.toasterService.warn("Condition Type", "Condition Type yet not implemented.");
               console.error("Condition Type unknown"); throw new Error("Condition Type unknown");
    }

    this.visible = false;
    this.afterUpdateFunction.emit(this.currentCondition!);
    this.toasterService.success("Update Condition", `Condition was successfully updated.`);
    this.resetForm();
  }

  private updatePointsCondition() {
    if (this.currentCondition == undefined || this.currentCondition == null) {
      let newCondition: IQuestConditionPoints = {
        type: EQuestCondition.points,
        value: this.conditionForm.value.questConditionPoints
      };

      this.currentCondition = newCondition;
    } else {
      this.currentCondition.type = EQuestCondition.points;
      this.currentCondition.value = this.conditionForm.value.questConditionPoints;
    }
  }

  private updateJobCondition() {
    if (this.currentCondition == undefined || this.currentCondition == null) {
      let newCondition: IQuestConditionJob = {
        type: EQuestCondition.job,
        value: this.conditionForm.value.questConditionJob.key
      };

      this.currentCondition = newCondition;
    } else {
      this.currentCondition.type = EQuestCondition.job;
      this.currentCondition.value = this.conditionForm.value.questConditionJob.key;
    }
  }

  private updateModuleResearchedCondition() {
    if (this.currentCondition == undefined || this.currentCondition == null) {
      let newCondition: IQuestConditionModuleResearched = {
        type: EQuestCondition.moduleResearched,
        value: this.conditionForm.value.questConditionModuleResearched.key
      };

      this.currentCondition = newCondition;
    } else {
      this.currentCondition.type = EQuestCondition.moduleResearched;
      this.currentCondition.value = this.conditionForm.value.questConditionModuleResearched.key;
    }
  }

  private updateChassisResearchedCondition() {
    if (this.currentCondition == undefined || this.currentCondition == null) {
      let newCondition: IQuestConditionChassisResearched = {
        type: EQuestCondition.chassisResearched,
        value: this.conditionForm.value.questConditionChassisResearched.key
      };

      this.currentCondition = newCondition;
    } else {
      this.currentCondition.type = EQuestCondition.chassisResearched;
      this.currentCondition.value = this.conditionForm.value.questConditionChassisResearched.key;
    }
  }

  private updateChassisBuiltCondition() {
    if (this.currentCondition == undefined || this.currentCondition == null) {
      let newCondition: IQuestConditionChassisBuilt = {
        type: EQuestCondition.chassisBuilt,
        value: this.conditionForm.value.questConditionChassisBuilt.key
      };

      this.currentCondition = newCondition;
    } else {
      this.currentCondition.type = EQuestCondition.chassisBuilt;
      this.currentCondition.value = this.conditionForm.value.questConditionChassisBuilt.key;
    }
  }

  private updateBuildingCondition() {
    if (this.currentCondition == undefined || this.currentCondition == null) {
      let newCondition: IQuestConditionBuilding = {
        type: EQuestCondition.building,
        value: this.conditionForm.value.questConditionBuildingType.key,
        amount: this.conditionForm.value.questConditionBuildingLevel,
      };

      this.currentCondition = newCondition;
    } else {
      this.currentCondition.type = EQuestCondition.building;
      this.currentCondition.value = this.conditionForm.value.questConditionBuildingType.key;
      (this.currentCondition as IQuestConditionBuilding).amount = this.conditionForm.value.questConditionBuildingLevel;
    }
  }

  // required as dropdowns have problems with null values like the type
  private resetForm() {
    this.conditionForm.patchValue({
      questConditionType: "",
      questConditionPoints: 0,
      questConditionJob: "",
      questConditionModuleResearched: "",
      questConditionChassisResearched: "",
      questConditionChassisBuilt: "",
      questConditionBuildingType: "",
      questConditionBuildingLevel: 0
    });
  }
}
