import { ApplicationConfig, ErrorHandler, Provider } from '@angular/core';

import { provideAnimations } from '@angular/platform-browser/animations';
import { GlobalErrorHandler } from './shared/global-error.handler';

import { provideMarkdown } from 'ngx-markdown';

import { providePrimeNG } from 'primeng/config';
import { laraPreset } from './app.theme';

const GlobalErrorHandlerProvider: Provider = {
  provide: ErrorHandler,
  useClass: GlobalErrorHandler,
};

const MarkupProvider: Provider = provideMarkdown();

export const appConfig: ApplicationConfig = {
  providers: [
    GlobalErrorHandlerProvider, // custom global error handler
    MarkupProvider, // Markup Provider
    provideAnimations(), // bootstrap animations
    providePrimeNG({
      theme: {
         preset: laraPreset,
         options: {
          darkModeSelector: '.app-dark-mode'
         }
      }
    })
  ],
};
