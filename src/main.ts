import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { serverRoutes } from './app/app.routes.server';

bootstrapApplication(AppComponent, {
  providers: [
  provideHttpClient(),
  importProvidersFrom(RouterModule.forRoot(serverRoutes)),
]})
  .catch((err) => console.error(err));
