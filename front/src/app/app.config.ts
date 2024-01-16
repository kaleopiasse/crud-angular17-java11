import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import localePt from '@angular/common/locales/pt';

import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    provideRouter(routes),
  ]
};
