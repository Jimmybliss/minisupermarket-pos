import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { serverRoutes } from './app/app.routes.server';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
  provideHttpClient(),
  importProvidersFrom(RouterModule.forRoot(routes)), provideAnimationsAsync('noop'), provideAnimationsAsync('noop'),
]})
  .catch((err) => console.error(err));
