import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';

import { EChassisId, EModuleId, IQuest, TQuestCondition } from '../quest-ud.model';

import { EuropeanNumberFormatPipe } from "../../shared//european-number-format.pipe";
import { QuestGeneratorConditionUpdateComponent } from './quest-generator-condition-update/quest-generator-condition-update.component';
import { QuestGeneratorService } from '../quest-generator.service';

@Component({
  selector: 'app-quest-generator-condition',
  standalone: true,
  imports: [CommonModule, PanelModule, TableModule, EuropeanNumberFormatPipe, QuestGeneratorConditionUpdateComponent],
  templateUrl: './quest-generator-condition.component.html',
  styleUrl: './quest-generator-condition.component.css'
})
export class QuestGeneratorConditionComponent {

  @Input() selectedQuest!: IQuest;
  @Output("afterChangeFunction") afterChangeFunction: EventEmitter<VoidFunction> = new EventEmitter();

  @ViewChild('questGeneratorConditionUpdateDialog') questGeneratorConditionUpdateDialog?: QuestGeneratorConditionUpdateComponent;

  chassis = EChassisId;
  modules = EModuleId;

  constructor(public questGeneratorService: QuestGeneratorService) {

  }

  updateCondition(quest: IQuest, condition: TQuestCondition | null) {
    this.questGeneratorConditionUpdateDialog!.setCondition(quest, condition);
    this.questGeneratorConditionUpdateDialog!.showUpdateDialog();
  }

  afterUpdateCondition(condition: TQuestCondition) {
    let isNewCondition = this.selectedQuest?.conditions.filter(c => c == condition).length == 0;

    if (isNewCondition) {
      this.selectedQuest?.conditions.push(condition);
    }

    this.afterChangeFunction.emit();
  }

  deleteCondition(condition: TQuestCondition) {
    this.selectedQuest!.conditions = this.selectedQuest!.conditions.filter(c => c != condition);

    this.afterChangeFunction.emit();
  }

}
