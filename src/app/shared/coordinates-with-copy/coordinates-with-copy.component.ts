import { Component, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { CoordinatesWithCopyService } from './coordinates-with-copy.service';
import { CoordinatesNormalisedPipe } from "../coordinates-normalised.pipe";
import { ICoordinates } from '../../quest-generator/quest-ud.model';

@Component({
    selector: 'app-coordinates-with-copy',
    providers: [Clipboard],
    templateUrl: './coordinates-with-copy.component.html',
    styleUrl: './coordinates-with-copy.component.css',
    imports: [CommonModule, CoordinatesNormalisedPipe]
})
export class CoordinatesWithCopyComponent {

  @Input() position!: ICoordinates;
  @Input() planetName: string | null = null;

  constructor(private coordinatesWithCopyService: CoordinatesWithCopyService) { }

  copyCoordinates() {
    this.coordinatesWithCopyService.copyCoordinates(this.position);
  }
}
