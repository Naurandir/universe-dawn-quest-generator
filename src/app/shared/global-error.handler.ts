import { ToasterService } from './toaster/toaster.service';
import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  private chunkFailedMessage = 'Loading chunk ';
  private moduleFailedMessage = 'Failed to load module script';
  private dynamicModuleFailedMessage = 'Failed to fetch dynamically imported module';

  constructor(private readonly toasterService: ToasterService) {

  }

  handleError(error: any): void {
    if(error.message.includes(this.chunkFailedMessage) ||
       error.message.includes(this.moduleFailedMessage) ||
       error.message.includes(this.dynamicModuleFailedMessage)) {
      this.toasterService.warn("New Version", "It seems a new version is deployed, page reload will be enforced.");
      console.error(error.stack.toString());

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
    console.error(error.stack.toString());
  }
}
