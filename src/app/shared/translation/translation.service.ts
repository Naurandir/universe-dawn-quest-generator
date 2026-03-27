import { LoadingActionService } from './../loading-action/loading-action.service';
import { ToasterService } from './../toaster/toaster.service';
import { LocalStorageService } from '../local-storage-service.service';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import { environment } from "../../../environments/environment";

import translate from "translate";
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private apiUrl: string = 'https://quest-generator.naurandir.net/v2/translate';

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService, private toasterService: ToasterService, private loadingActionService: LoadingActionService) {

    let translationConfig: string | null = localStorageService.getItem("TranslationService", "config");
    if (translationConfig != null) {
      let config = JSON.parse(translationConfig) as { key: string; engine: "google" | "deepl" | "libre" | "yandex"; };
      translate.engine = config.engine;
      translate.key = config.key;
    } else {
      translate.engine = environment.translationType as ("google" | "deepl" | "libre" | "yandex");
      translate.key = environment.translationApiKey;
    }
  }

  updateTranslationConfig(key: string, engine: "google" | "deepl" | "libre" | "yandex") {
    translate.engine = engine;
    translate.key = key;

    let newConfig = {
      engine: engine,
      key: key
    };

    this.localStorageService.setItem("TranslationService", "config", JSON.stringify(newConfig));
  }

  getPersonalKey(): string {
    let translationConfig: string | null = this.localStorageService.getItem("TranslationService", "config");

    if (translationConfig != null) {
      let config = JSON.parse(translationConfig) as { key: string; engine: "google" | "deepl" | "libre" | "yandex"; };
      return config.key;
    }

    return "";
  }

  removePersonalKey() {
    this.localStorageService.removeItem("TranslationService", "config");
    translate.key = environment.translationApiKey;
  }

  translate(languageFrom: 'de' | 'en', languageTo: 'de' | 'en', text: string): Observable<string> {
    console.log(translate.key);
    console.log(translate.engine);
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

  translateServerCall(languageFrom: string, languageTo: string, text: string): Observable<string> {
    if (translate.key == undefined || translate.key == "dummy") {
      this.toasterService.warn("Translate",
        "Translation is currently not configured for usage. Please contact an administartor for help or use google translate. Thank you.");

      this.loadingActionService.hideLoadingAction();
      throw Error("Translation not possible");
    }

    let params = new HttpParams()
      .set('text', text)
      .set('source_lang', languageFrom)
      .set('target_lang', languageTo);

    let headers = {
      'Authorization': `DeepL-Auth-Key ${translate.key}`
    };

    return new Observable(observer => {
      this.httpClient.get<any>(this.apiUrl, { params, headers }).subscribe({
        next: (response) => {
          let translatedText = response?.translations?.[0]?.text || '';
          observer.next(translatedText);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
}
