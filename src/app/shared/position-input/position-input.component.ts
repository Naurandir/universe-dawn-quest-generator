import { Component, EventEmitter, Input, Output } from '@angular/core';

import { InputMask, InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoordinatesNormalisedPipe } from '../coordinates-normalised.pipe';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-position-input',
    imports: [CommonModule, InputNumberModule, InputMaskModule, FormsModule, ReactiveFormsModule],
    templateUrl: './position-input.component.html',
    styleUrl: './position-input.component.css'
})
export class PositionInputComponent {

  @Input() inputForm?: FormGroup;
  @Input() inputControlName?: string;

  @Input() value: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() style: {
    [klass: string]: any;
  } | null | undefined;

  constructor(private coordinatesNormalisedPipe: CoordinatesNormalisedPipe) {

  }

  getFormControl(): FormControl {
    return this.inputForm!.controls[this.inputControlName!] as FormControl;
  }

  onPasteCoordinates(event: ClipboardEvent) {
    let clipboardData = event.clipboardData!.getData('text');
    let normalisedCoordinates: string = this.coordinatesNormalisedPipe.transform(clipboardData);
    if (this.inputForm != undefined && this.inputForm != null) {
      this.inputForm!.controls[this.inputControlName!].patchValue(normalisedCoordinates);
      console.log("updated controls: ", normalisedCoordinates);
    } else {
      this.value = normalisedCoordinates;
      console.log("updated value: ", this.value);
    }
  }
}
