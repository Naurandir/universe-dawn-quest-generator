import { Component, EventEmitter, Output } from '@angular/core';

import { ERace, IQuest, IQuestPrepareNpcs } from '../../quest-ud.model';

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
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, DialogModule, DropdownModule, DividerModule, PositionInputComponent, EnumToArrayPipe ],
  templateUrl: './quest-generator-npc-update.component.html',
  styleUrl: './quest-generator-npc-update.component.css'
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

  constructor(private toasterService: ToasterService, private coordinatesNormalisedPipe: CoordinatesNormalisedPipe) {

  }

  showUpdateDialog() {
    this.visible = true;
  }

  public setNpc(quest: IQuest, npc: IQuestPrepareNpcs | null) {
    this.currentQuest = quest;
    this.currentNpc = npc;

    this.isAdd = npc == null;

    this.npcForm.reset();

    if (npc != null) {
      this.npcForm.patchValue({
        npcName: npc.rulerName,
        npcRace: npc.race
      });

      if (npc.planet != null && npc.planet != undefined) {
        this.npcForm.patchValue({
          npcPlanetName: npc.planet.planetName,
          npcPlanetCoordinates: this.coordinatesNormalisedPipe.transform(npc.planet.coordinates)
        });
      }
    }
  }

  updateNpc() {
    if(this.currentNpc == null) {
      let newNpc: IQuestPrepareNpcs = {
        rulerName: this.npcForm.value.npcName,
        race: this.npcForm.value.npcRace
      };
      this.currentNpc = newNpc;
    } else {
      this.currentNpc.rulerName = this.npcForm.value.npcName;
      this.currentNpc.race = this.npcForm.value.npcRace.value;
    }

    // Planet
    if (this.npcForm.value.npcPlanetName != "" && this.npcForm.value.npcPlanetName != null && testCoordinates(this.npcForm.value.npcPlanetCoordinates)) {
      let coordinatesSplit: string[] = this.npcForm.value.npcPlanetCoordinates.split("-");
      this.currentNpc.planet = {
        planetName: this.npcForm.value.npcPlanetName,
        coordinates: {
          x: Number(coordinatesSplit[0]),
          y: Number(coordinatesSplit[1]),
          z: Number(coordinatesSplit[2]),
        }
      };
    } else {
      this.currentNpc.planet = undefined;
    }

    this.visible = false;
    this.afterUpdateFunction.emit(this.currentNpc!);
    this.toasterService.success("Update NPC", `NPC was successfully updated.`);
    this.npcForm.reset();
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
