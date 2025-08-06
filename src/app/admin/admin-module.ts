import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AdminRoutingModule } from '../admin/admin-routing-module';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { UsuariosComponent } from './pages/usuarios/usuarios';
import { ProductosComponent } from './pages/productos/productos';
import { VentasComponent } from './pages/ventas/ventas';
import { ComentariosComponent } from './pages/comentarios/comentarios';
import { CotizacionesAdminComponent } from './pages/cotizaciones/cotizaciones-admin.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    UsuariosComponent,
    ProductosComponent,
    VentasComponent,
    ComentariosComponent,
    CotizacionesAdminComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AdminRoutingModule
  ]
})
export class AdminModule {}