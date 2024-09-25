import { LoadingActionComponent } from './loading-action.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingActionService {

  private loadingActionComponent: LoadingActionComponent | null = null;

  constructor() { }

  setActionComponent(component: LoadingActionComponent) {
    this.loadingActionComponent = component;
  }

  showLoadingAction(): void {
    this.loadingActionComponent?.setMessage(null);
    this.loadingActionComponent?.setVisibility(true);
  }

  showLoadingActionWithMessage(message: string): void {
    this.loadingActionComponent?.setMessage(message);
    this.loadingActionComponent?.setVisibility(true);
  }

  hideLoadingAction(): void {
    setTimeout(() => {
      this.loadingActionComponent?.setVisibility(false);
      this.loadingActionComponent?.setMessage(null);
    }, 150);
  }

  isShowingLoadingAction(): boolean | undefined {
    return this.loadingActionComponent?.getVisibility();
  }
}
