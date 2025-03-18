import { QuestGeneratorService } from './../../quest-generator.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ERace, ETaskType, ICoordinates, IQuest, IQuestPrepareNpcs, IQuestStep, IQuestTaskDialogue, IQuestTaskTransactCredits } from '../../quest-ud.model';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

import { ToasterService } from '../../../shared//toaster/toaster.service';
import { EnumToArrayPipe } from '../../../shared//enum-to-array.pipe';
import { CoordinatesNormalisedPipe } from '../../../shared//coordinates-normalised.pipe';
import { PositionInputComponent } from '../../../shared//position-input/position-input.component';
import { testCoordinates } from '../../../shared//coordinates-validator.directive';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-quest-generator-npc-update',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, DialogModule, DropdownModule, DividerModule, PositionInputComponent, EnumToArrayPipe],
    templateUrl: './quest-generator-npc-update.component.html',
    styleUrl: './quest-generator-npc-update.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestGeneratorNpcUpdateComponent {

  @Output("afterUpdateFunction") afterUpdateFunction: EventEmitter<IQuestPrepareNpcs> = new EventEmitter();

  visible: boolean = false;
  isAdd: boolean = false;

  currentQuest?: IQuest;
  currentNpc?: IQuestPrepareNpcs | null;

  races = ERace;

  npcForm: FormGroup = new FormGroup({
    npcName: new FormControl("", [Validators.required]),
    npcRace: new FormControl("", [Validators.required]),
    npcPlanetName: new FormControl(""),
    npcPlanetCoordinates: new FormControl("")
  });

  constructor(public questGeneratorService: QuestGeneratorService, private toasterService: ToasterService, private coordinatesNormalisedPipe: CoordinatesNormalisedPipe, private changeDedector: ChangeDetectorRef) {

  }

  showUpdateDialog() {
    this.visible = true;
    this.changeDedector.detectChanges();
  }

  public setNpc(quest: IQuest, npc: IQuestPrepareNpcs | null) {
    this.currentQuest = quest;
    this.currentNpc = npc;

    this.isAdd = npc == null;

    this.npcForm.reset();

    if (npc != null) {
      this.npcForm.patchValue({
        npcName: npc.rulerName,
        npcRace: { "key": npc.race, "value": npc.race }
      });

      if (npc.planet != null && npc.planet != undefined) {
        this.npcForm.patchValue({
          npcPlanetName: npc.planet.planetName,
          npcPlanetCoordinates: this.coordinatesNormalisedPipe.transform(npc.planet.coordinates)
        });
      }
    }
    this.changeDedector.detectChanges();
  }

  updateNpc() {
    let oldRulerName = null;
    let oldNpcPlanetCoordinates = null;

    if(this.isAdd) {
      let newNpc: IQuestPrepareNpcs = {
        rulerName: this.npcForm.value.npcName,
        race: this.npcForm.value.npcRace.value
      };
      this.currentNpc = newNpc;
    } else {
      oldRulerName = this.currentNpc!.rulerName;
      oldNpcPlanetCoordinates = this.currentNpc!.planet != undefined ? this.currentNpc!.planet!.coordinates : null;

      this.currentNpc!.rulerName = this.npcForm.value.npcName;
      this.currentNpc!.race = this.npcForm.value.npcRace.value;
    }

    // Planet
    if (this.npcForm.value.npcPlanetName != "" && this.npcForm.value.npcPlanetName != null && testCoordinates(this.npcForm.value.npcPlanetCoordinates)) {
      let coordinatesSplit: string[] = this.npcForm.value.npcPlanetCoordinates.split("-");
      this.currentNpc!.planet = {
        planetName: this.npcForm.value.npcPlanetName,
        coordinates: {
          x: Number(coordinatesSplit[0]),
          y: Number(coordinatesSplit[1]),
          z: Number(coordinatesSplit[2]),
        }
      };
    } else {
      this.currentNpc!.planet = undefined;
    }

    if(!this.isAdd) {
      this.updateNpcRelations(oldRulerName, oldNpcPlanetCoordinates);
    }

    this.visible = false;
    this.afterUpdateFunction.emit(this.currentNpc!);
    this.toasterService.success("Update NPC", `NPC was successfully updated.`);
    this.npcForm.reset();
    this.changeDedector.detectChanges();
  }

  private updateNpcRelations(oldRulerName: string | null, oldNpcPlanetCoordinates: ICoordinates | null) {
    if(oldRulerName == null && oldNpcPlanetCoordinates == null) {
      console.warn("everything null, nothing to update");
      return;
    }

    let stepKeys: string[] = Object.keys(this.currentQuest!.steps);

    for(let i=0; i< stepKeys.length; i++) {
      let currentStep: IQuestStep = this.currentQuest!.steps[stepKeys[i]];

      if(currentStep.task.type == ETaskType.dialogue) {
        let currentTask: IQuestTaskDialogue = currentStep.task;
        let oldCoordinatesNormalized: string = this.coordinatesNormalisedPipe.transform(oldNpcPlanetCoordinates);
        let currentCoordiantesNormalized: string = this.coordinatesNormalisedPipe.transform(currentTask.coordinates);

        if(currentCoordiantesNormalized == oldCoordinatesNormalized) {
          let newCoordinatesPosition: ICoordinates = this.coordinatesNormalisedPipe.transformToPosition(this.npcForm.value.npcPlanetCoordinates);
          currentTask.coordinates = {
            x: newCoordinatesPosition.x,
            y: newCoordinatesPosition.y,
            z: newCoordinatesPosition.z,
          }
        }
      } else if (currentStep.task.type == ETaskType.transactCredits) {
        let currentTask: IQuestTaskTransactCredits = currentStep.task;

        if(currentTask.rulerName == oldRulerName) {
          currentTask.rulerName = this.npcForm.value.npcName;
        }
      }
    }
    this.changeDedector.detectChanges();
  }

  isFormValid(): boolean {
    let isMinimumDone: boolean = this.npcForm.value.npcName != null && this.npcForm.value.npcName != "" &&
      this.npcForm.value.npcRace != null && this.npcForm.value.npcRace != "";

    if (!isMinimumDone) {
      return false;
    }

    let isPlanetNameSet: boolean = this.npcForm.value.npcPlanetName != null && this.npcForm.value.npcPlanetName != "";
    let isCoordinatesStarted: boolean = this.npcForm.value.npcPlanetCoordinates != null && this.npcForm.value.npcPlanetCoordinates != ""

    // NPC without Planet is valid
    if(isMinimumDone && !isPlanetNameSet && !isCoordinatesStarted) {
      return true;
    }

    // NPC with Planet needs valid planet
    let isCoordinatesValid: boolean = testCoordinates(this.npcForm.value.npcPlanetCoordinates);

    return isMinimumDone && isPlanetNameSet && isCoordinatesValid;
  }
}
