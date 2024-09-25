import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

const coordinatesRegex: RegExp= /^\d{3}-\d{3}-\d{3}$/;
const coordinatesUniverseDawnRegex: RegExp= /^\d{1,3}-\d{1,3}-\d{1,3}$/;

export function coordinatesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let validCoordinates = testCoordinates(control.value);
    return validCoordinates ? null : { validCoordinates: { value: false } };
  };
}

export function testCoordinates(text: string): boolean {
    return coordinatesRegex.test(text);
}

export function testUniverseDawnCoordinates(text: string) {
  return coordinatesUniverseDawnRegex.test(text);
}
