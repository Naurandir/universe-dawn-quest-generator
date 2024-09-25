import { Component, Input } from '@angular/core';
import { Position } from '../../backend/models';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { CoordinatesWithCopyService } from './coordinates-with-copy.service';
import { CoordinatesNormalisedPipe } from "../coordinates-normalised.pipe";

@Component({
    selector: 'app-coordinates-with-copy',
    standalone: true,
    providers: [Clipboard],
    templateUrl: './coordinates-with-copy.component.html',
    styleUrl: './coordinates-with-copy.component.css',
    imports: [CommonModule, CoordinatesNormalisedPipe]
})
export class CoordinatesWithCopyComponent {

  @Input() position!: Position;
  @Input() planetName: string | null = null;

  constructor(private coordinatesWithCopyService: CoordinatesWithCopyService, private clipboard: Clipboard) { }

  copyCoordinates() {
    this.coordinatesWithCopyService.copyCoordinates(this.position);
  }
}
