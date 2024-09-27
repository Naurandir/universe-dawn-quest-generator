import { Injectable } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { ToasterService } from '../toaster/toaster.service';
import { ICoordinates } from '../../quest-generator/quest-ud.model';

@Injectable({
  providedIn: 'root'
})
export class CoordinatesWithCopyService {

  constructor(private clipboard: Clipboard, private readonly toasterService: ToasterService) { }

  copyCoordinates(position: ICoordinates): void {
    let coordinates = position.x + "-" + position.y + "-" + position.z;
    this.clipboard.copy(coordinates);

    this.toasterService.success("Copy Coordinates",`Copied Coordinates ${coordinates} to Clipboard.`);
  }

  copyCoordinatesWithCheck(position: ICoordinates, check: boolean): void {
    if (!check) {
      return;
    }

    this.copyCoordinates(position);
  }
}
