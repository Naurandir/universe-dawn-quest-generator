import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-refresh-button',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './refresh-button.component.html',
  styleUrl: './refresh-button.component.css'
})
export class RefreshButtonComponent {

  @Input() refreshText: string | null = null;
  @Output("refreshFunction") refreshFunction: EventEmitter<any> = new EventEmitter();

  executeRefreshFunction() {
    this.refreshFunction.emit();
  }
}
