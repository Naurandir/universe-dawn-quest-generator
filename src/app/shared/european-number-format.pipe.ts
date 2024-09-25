import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'europeanNumberFormat',
  standalone: true
})
export class EuropeanNumberFormatPipe implements PipeTransform {

  transform(value: string | null): string {
    if (value == null) {
      return "";
    }

    let formattedString = value.replaceAll(",", ";");
    formattedString = formattedString.replace(".",",");
    formattedString = formattedString.replaceAll(";", ".");
    return formattedString;
  }

}
