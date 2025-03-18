import { LoadingActionService } from './shared/loading-action/loading-action.service';
import { ToasterService } from './shared/toaster/toaster.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToasterComponent } from "./shared/toaster/toaster.component";

import { CoordinatesNormalisedPipe } from './shared/coordinates-normalised.pipe';
import { LoadingActionComponent } from "./shared/loading-action/loading-action.component";
import { QuestGeneratorComponent } from "./quest-generator/quest-generator.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [CoordinatesNormalisedPipe],
    imports: [CommonModule, NgbModule, QuestGeneratorComponent, ToasterComponent, LoadingActionComponent]
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild(LoadingActionComponent) loadingAction!: LoadingActionComponent;
  @ViewChild('navbarTogglerButton') navbarToggler!: ElementRef;

  public isFinished: boolean = false;

  constructor(public toasterService: ToasterService, public loadingActionService: LoadingActionService) {

  }

  public async ngOnInit() {
    setTimeout(() => {
      this.isFinished = true;
    }, 1000);
  }

  ngAfterViewInit(): void {
    this.toasterService.setToaster(this.toaster);
    this.loadingActionService.setActionComponent(this.loadingAction);
  }
}
