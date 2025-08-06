import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '../admin/components/admin-layout/admin-layout';
import { DashboardComponent } from '../admin/pages/dashboard/dashboard';
import { UsuariosComponent } from '../admin/pages/usuarios/usuarios';
import { ProductosComponent } from '../admin/pages/productos/productos';
import { VentasComponent } from '../admin/pages/ventas/ventas';
import { ComentariosComponent } from '../admin/pages/comentarios/comentarios';
import { CotizacionesAdminComponent } from '../admin/pages/cotizaciones/cotizaciones-admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'ventas', component: VentasComponent },
      { path: 'cotizaciones', component: CotizacionesAdminComponent },
      { path: 'comentarios', component: ComentariosComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
