import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EChassisId, EComponentType, EModuleId, EReturnReward, IQuestStep, TResources, TReturnReward } from '../../quest-ud.model';

import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnumToArrayPipe } from "../../../shared/enum-to-array.pipe";
import { QuestGeneratorService } from '../../quest-generator.service';
import { ToasterService } from '../../../shared/toaster/toaster.service';

@Component({
    selector: 'app-quest-generator-step-reward-update',
    imports: [CommonModule, DialogModule, SelectModule, InputNumberModule, FormsModule, ReactiveFormsModule, EnumToArrayPipe],
    providers: [EnumToArrayPipe],
    templateUrl: './quest-generator-step-reward-update.component.html',
    styleUrl: './quest-generator-step-reward-update.component.css'
})
export class QuestGeneratorStepRewardUpdateComponent {

  @Output("afterUpdateFunction") afterUpdateFunction: EventEmitter<IQuestStep> = new EventEmitter();

  currentReward?: TReturnReward | null;
  currentQuestStep!: IQuestStep;

  visible: boolean = false;
  isAdd: boolean = false;

  chassis = EChassisId;
  modules = EModuleId;

  rewardForm: FormGroup = new FormGroup({
    rewardType: new FormControl("", [Validators.required]),

    componentType: new FormControl(""),
    chassis: new FormControl(""),
    module: new FormControl(""),
    numberOfLicenses: new FormControl(""),

    titan: new FormControl(""),
    silicium: new FormControl(""),
    helium: new FormControl(""),
    food: new FormControl(""),
    water: new FormControl(""),
    bauxit: new FormControl(""),
    aluminium: new FormControl(""),
    uranium: new FormControl(""),
    plutonium: new FormControl(""),
    hydrogen: new FormControl(""),
    credits: new FormControl("")
  });

  constructor(private toasterService: ToasterService, public questGeneratorService: QuestGeneratorService, private enumToArrayPipe: EnumToArrayPipe) {

  }

  setReward(reward: TReturnReward | null, questStep: IQuestStep) {
    this.rewardForm.reset();

    this.currentQuestStep = questStep;
    this.currentReward = reward;

    this.isAdd = reward == null;

    if (reward != null && reward.rewardType == EReturnReward.giveResources) {
      this.rewardForm.patchValue({
        rewardType: 'resources',
        titan: reward.cost.resources[0],
        silicium: reward.cost.resources[1],
        helium: reward.cost.resources[2],
        food: reward.cost.resources[3],
        water: reward.cost.resources[4],
        bauxit: reward.cost.resources[5],
        aluminium: reward.cost.resources[6],
        uranium: reward.cost.resources[7],
        plutonium: reward.cost.resources[8],
        hydrogen: reward.cost.resources[9],
        credits: reward.cost.currencies[0]
      });
    } else if (reward != null && reward.rewardType == EReturnReward.giveLicense) {
      console.log(reward);
      this.rewardForm.patchValue({
        rewardType: 'license',

        componentType: reward.componentType,
        chassis: reward.componentType == EComponentType.chassis ? this.enumToArrayPipe.transform(this.chassis).filter(entry => entry.key == reward.licenseId)[0] : "",
        module: reward.componentType == EComponentType.module ? this.enumToArrayPipe.transform(this.modules).filter(entry => entry.key == reward.licenseId)[0] : "",
        numberOfLicenses: reward.licenses
      });
    }
  }

  showUpdateStepDialog() {
    this.visible = true;
  }

  updateReward() {
    this.visible = false;

    if (this.rewardForm.value.rewardType == "resources") {
      this.updateRewardResrouces();
    } else if (this.rewardForm.value.rewardType = "license") {
      this.updateRewardLicense();
    } else {
      throw new Error("Unknown rewardType!");
    }

    this.rewardForm.reset();
    this.toasterService.success("Reward Update","Reward succesfully updated");
    this.afterUpdateFunction.emit(this.currentQuestStep);
  }

  private updateRewardResrouces() {
    let credits: number = Number(this.rewardForm.value.credits == null ? 0 : this.rewardForm.value.credits);
    let resources: TResources = [
      Number(this.rewardForm.value.titan == null ? 0 : this.rewardForm.value.titan),
      Number(this.rewardForm.value.silicium == null ? 0 : this.rewardForm.value.silicium),
      Number(this.rewardForm.value.helium == null ? 0 : this.rewardForm.value.helium),
      Number(this.rewardForm.value.food == null ? 0 : this.rewardForm.value.food),
      Number(this.rewardForm.value.water == null ? 0 : this.rewardForm.value.water),
      Number(this.rewardForm.value.bauxit == null ? 0 : this.rewardForm.value.bauxit),
      Number(this.rewardForm.value.aluminium == null ? 0 : this.rewardForm.value.aluminium),
      Number(this.rewardForm.value.uranium == null ? 0 : this.rewardForm.value.uranium),
      Number(this.rewardForm.value.plutonium == null ? 0 : this.rewardForm.value.plutonium),
      Number(this.rewardForm.value.hydrogen == null ? 0 : this.rewardForm.value.hydrogen)
    ];
    let rewardResources = this.questGeneratorService.createQuestStepRewardResources(resources, credits);

    if (this.currentReward == null) {
      this.currentQuestStep.rewards!.push(rewardResources);
    } else {
      let position: number = this.currentQuestStep.rewards!.indexOf(this.currentReward);
      this.currentQuestStep.rewards![position] = rewardResources;
    }
  }

  private updateRewardLicense() {
    let componentType = this.rewardForm.value.componentType;
    let numberOfLicenses = Number(this.rewardForm.value.numberOfLicenses);

    let componentId: string = "";
    if (componentType == "chassis") {
      componentId = this.rewardForm.value.chassis.key;
    } else if (componentType == "module") {
      componentId = this.rewardForm.value.module.key;
    } else {
      throw new Error("Unknown componentType!");
    }

    let rewardLicense = this.questGeneratorService.createQuestStepRewardLicense(componentType, componentId, numberOfLicenses);

    if (this.currentReward == null) {
      this.currentQuestStep.rewards!.push(rewardLicense);
    } else {
      let position: number = this.currentQuestStep.rewards!.indexOf(this.currentReward);
      this.currentQuestStep.rewards![position] = rewardLicense;
    }
  }
}
