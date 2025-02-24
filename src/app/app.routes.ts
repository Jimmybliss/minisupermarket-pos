// filepath: /d:/Zaidi Creative/Work System/MiniSupermarketPOS/minisupermarket-pos/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { SalesComponent } from './sales/sales.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ProductManagementComponent } from './product-management/product-management.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // default route
  { path: 'admin', component: AdminComponent, children: [
    {path: 'user-management', component: UserManagementComponent},
    {path: 'product-management', component: ProductManagementComponent},
    {path: 'sales', component: SalesComponent},
    {path: '', redirectTo: 'user-management', pathMatch: 'full'}
  ]},
  {path: '**', redirectTo: 'admin', pathMatch: 'full'},
  { path: 'supervisor', component: SupervisorComponent },
  // add additional routes as needed
];