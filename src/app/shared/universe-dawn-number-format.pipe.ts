import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'universeDawnNumberFormat',
  standalone: true
})
export class UniverseDawnNumberFormatPipe implements PipeTransform {

  transform(value: number | null): string {
    if (value == null) {
      return "";
    }

    // M for million
    if (value > 1_000_000) {
      return ((value / 1_000_000).toFixed(2) + "M");
    }

    // k for thousands
    if (value > 1_000) {
      return ((value / 1_000).toFixed(2) + "k");
    }

    return String(Math.floor(value));
  }

}
