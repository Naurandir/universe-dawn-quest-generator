import { Injectable } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { Position } from '../../backend/models';
import { ToasterService } from '../toaster/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class CoordinatesWithCopyService {

  constructor(private clipboard: Clipboard, private readonly toasterService: ToasterService) { }

  copyCoordinates(position: Position): void {
    let coordinates = position.x + "-" + position.y + "-" + position.z;
    this.clipboard.copy(coordinates);

    this.toasterService.success("Copy Coordinates",`Copied Coordinates ${coordinates} to Clipboard.`);
  }

  copyCoordinatesWithCheck(position: Position, check: boolean): void {
    if (!check) {
      return;
    }

    this.copyCoordinates(position);
  }
}
