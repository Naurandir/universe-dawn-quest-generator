import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-action.component.html',
  styleUrl: './loading-action.component.css'
})
export class LoadingActionComponent {

  @Input() width: string = "150px";
  @Input() height: string = "150px";

  visbility: boolean = false;
  message: string | null = null;

  constructor() {}

  getVisibility() {
    return this.visbility;
  }

  setVisibility(visible: boolean) {
    this.visbility = visible;
  }

  setMessage(message: string | null) {
    this.message = message;
  }
}
