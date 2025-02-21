// filepath: /d:/Zaidi Creative/Work System/MiniSupermarketPOS/minisupermarket-pos/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // default route
  { path: 'admin', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent) },
  { path: 'supervisor', loadComponent: () => import('./sales/sales.component').then(m => m.SalesComponent) },
  // add additional routes as needed
];