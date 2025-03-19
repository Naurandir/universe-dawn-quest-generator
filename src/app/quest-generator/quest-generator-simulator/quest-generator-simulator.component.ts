import { Component } from '@angular/core';
import { IQuest } from '../quest-ud.model';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-quest-generator-simulator',
    imports: [CommonModule, NgbModule, MarkdownModule, DialogModule, SelectModule, DividerModule],
    templateUrl: './quest-generator-simulator.component.html',
    styleUrl: './quest-generator-simulator.component.css'
})
export class QuestGeneratorSimulatorComponent {

  visible: boolean = false;
  selectedLanguage: 'DE' | 'EN' = 'DE';

  currentQuest?: IQuest;

  constructor() {

  }

  setQuest(quest: IQuest) {
    this.currentQuest = quest;
  }

  showSimulator() {
    this.visible = true;
  }
}
