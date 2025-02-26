// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { serverRoutes } from './app.routes.server';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.service';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(serverRoutes),
    
  ],
  providers: [provideHttpClient()],
})
export class AppModule { }
