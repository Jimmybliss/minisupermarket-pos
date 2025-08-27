// filepath: /d:/Zaidi Creative/Work System/MiniSupermarketPOS/minisupermarket-pos/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { SalesComponent } from './sales/sales.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LogsComponent } from './logs/logs.component';
import { SettingsComponent } from './settings/settings.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { InventoryManagementComponent } from './inventory-management/inventory-management.component';
import { SalespersonComponent } from './salesperson/salesperson.component';


export const routes: Routes = [
  { path: '', component: LoginComponent }, // default route
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, children: [
    {path: 'user-management', component: UserManagementComponent},
    {path: 'product-management', component: ProductManagementComponent},
    {path: 'category-management', component: CategoryManagementComponent},
    {path: 'transactions', component: TransactionsComponent},
    {path: 'logs', component: LogsComponent},
    {path: 'settings', component: SettingsComponent},
    {path: 'inventory-management', component: InventoryManagementComponent},
    {path: '', redirectTo: 'user-management', pathMatch: 'full'}
  ]},
  //{ path: '**', redirectTo: 'admin', pathMatch: 'full'},

  { path: 'salesperson', component: SalespersonComponent, children: [
    { path: 'sales', component: SalesComponent},
    { path: '', redirectTo: 'sales', pathMatch: 'full'}
  ]},
  { path: 'supervisor', component: SupervisorComponent },
  
  // add additional routes as needed
];