import { Pipe, PipeTransform } from '@angular/core';
import { ICoordinates } from '../quest-generator/quest-ud.model';

@Pipe({
  name: 'coordinatesNormalised',
  standalone: true
})
export class CoordinatesNormalisedPipe implements PipeTransform {

  transform(value: ICoordinates | string | null): string {
    if (value == null) {
      return "000-000-000";
    }

    if (value instanceof String) {
      return this.transformString(value as string);
    } else {
      return this.transformPosition(value as ICoordinates);
    }
  }

  private transformString(value: string) {
    let coordinates = value.split("-")
    if (coordinates.length != 3) {
      return "000-000-000";
    }

    let x: number = Number(coordinates[0]);
    let y: number = Number(coordinates[1]);
    let z: number = Number(coordinates[2]);

    return this.getNormalizedPosition(x) + "-" + this.getNormalizedPosition(y) + "-" + this.getNormalizedPosition(z);
  }

  private transformPosition(value: ICoordinates): string {
    return this.getNormalizedPosition(value.x!) + "-" + this.getNormalizedPosition(value.y!) + "-" + this.getNormalizedPosition(value.z!);
  }

  private getNormalizedPosition(pos: number): string {
    if (pos < 10) {
      return "00"+pos;
    } else if (pos < 100) {
      return "0"+pos;
    }
    return "" + pos;
  }

  transformToPosition(value: string | null): ICoordinates {
    let position: ICoordinates = {
      x: 0,
      y: 0,
      z: 0
    }

    if (value == null) {
      return position;
    }

    let split = value.split("-");

    if (split.length < 3) {
      return position;
    }

    position.x = Number(split[0]);
    position.y = Number(split[1]);
    position.z = Number(split[2]);

    return position;
  }
}
