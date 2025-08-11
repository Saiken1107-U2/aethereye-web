import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AdminRoutingModule } from '../admin/admin-routing-module';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout';
import { UsuariosComponent } from './pages/usuarios/usuarios';
import { ProductosComponent } from './pages/productos/productos';
import { VentasComponent } from './pages/ventas/ventas';
import { ComentariosComponent } from './pages/comentarios/comentarios';
import { CotizacionesAdminComponent } from './pages/cotizaciones/cotizaciones-admin.component';
import { ProveedoresComponent } from '../features/admin/proveedores/proveedores.component';
import { InsumosComponent } from '../features/admin/insumos/insumos.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
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
    AdminRoutingModule,
    ProveedoresComponent,
    InsumosComponent
  ]
})
export class AdminModule {}