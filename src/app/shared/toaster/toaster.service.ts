import { Injectable } from '@angular/core';
import { ToasterComponent } from './toaster.component';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {

  toasterComponent: ToasterComponent | null = null;

  constructor() { }

  setToaster(toaster: ToasterComponent) {
    this.toasterComponent = toaster;
  }

  success(title: string, details: string) {
    this.toasterComponent!.success(title, details);
  }

  info(title: string, details: string) {
    this.toasterComponent!.info(title, details);
  }

  warn(title: string, details: string) {
    this.toasterComponent!.warn(title, details);
  }

  error(title: string, details: string) {
    this.toasterComponent!.error(title, details);
  }
}
