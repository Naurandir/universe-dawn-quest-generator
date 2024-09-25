import { Pipe, PipeTransform } from '@angular/core';
/*
 * Show only first n characters of a text followed by ...
 * TIf the string is shorter than the given number it shows the complete text
 * Usage:
 *   value | reduceTextPipe:length
 * Example:
 *   {{ textVariable | reduceTextPipe: 10 }}
 */
@Pipe({
  name: 'reduceTextPipe',
  standalone: true,
})
export class ReduceTextPipe implements PipeTransform {
  transform(val: string, length: number): string {
    if (val == null || val == undefined) {
      return "";
    }
    return val.length > length ? `${val.substring(0, length)}...` : val;
  }
}
