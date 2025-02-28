// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { serverRoutes } from './app.routes.server';
import { routes } from './app.routes';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.service';

@NgModule({
  imports: [
    MatSlideToggle,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    
  ],
  providers: [provideHttpClient()],
})
export class AppModule { }
