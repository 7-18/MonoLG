import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './home/login/login.component';
import { ListInvoiceComponent } from './invoice/list-invoice/list-invoice.component';
import { SaveInvoiceComponent } from './invoice/save-invoice/save-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'list-invoices',
    component: ListInvoiceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'save-invoice',
    component: SaveInvoiceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
