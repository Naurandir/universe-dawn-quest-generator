import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import translate from "translate";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor() {
    translate.engine = "libre";
  }

  translate(languageFrom: 'de' | 'en', languageTo: 'de' | 'en', text: string): Observable<string> {
    let options = {
      from: languageFrom,
      to: languageTo
    }

    return from(translate(text, options));
  }
}
