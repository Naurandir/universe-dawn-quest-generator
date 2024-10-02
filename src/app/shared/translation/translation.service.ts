import { LoadingActionService } from './../loading-action/loading-action.service';
import { ToasterService } from './../toaster/toaster.service';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import { environment } from "../../../environments/environment";

import translate from "translate";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(private toasterService: ToasterService, private loadingActionService: LoadingActionService) {
    translate.engine = "deepl";
    translate.key = environment.apiKey;
  }

  translate(languageFrom: 'de' | 'en', languageTo: 'de' | 'en', text: string): Observable<string> {
    if (translate.key == undefined || translate.key == "dummy") {
      this.toasterService.warn("Translate",
        "Translation is currently not configured for usage. Please contact an administartor for help or use google translate. Thank you.");

      this.loadingActionService.hideLoadingAction();
      throw Error("Translation not possible");
    }

    let options = {
      from: languageFrom,
      to: languageTo
    }

    return from(translate(text, options));
  }
}
