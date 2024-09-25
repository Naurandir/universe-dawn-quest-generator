import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IQuest } from '../quest-ud.model';
import { CommonModule } from '@angular/common';

import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-quest-generator-npc',
  standalone: true,
  imports: [ CommonModule, PanelModule, TableModule ],
  templateUrl: './quest-generator-npc.component.html',
  styleUrl: './quest-generator-npc.component.css'
})
export class QuestGeneratorNpcComponent {

  @Input() selectedQuest!: IQuest;
  @Output("afterChangeFunction") afterChangeFunction: EventEmitter<VoidFunction> = new EventEmitter();


}
