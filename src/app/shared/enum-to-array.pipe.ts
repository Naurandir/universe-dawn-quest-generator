import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToArray',
  standalone: true
})
export class EnumToArrayPipe implements PipeTransform {

  /**
   * Object.entries contain for string and numer enums both key and value on both sides, so we take it and half it.
   * @param data
   */
  transform(data: Object) {
    let allEntries = Object.entries(data).map(([key, value]) => ({key, value}));
    return allEntries.slice(0, allEntries.length / 2);
  }
}
