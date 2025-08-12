import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '../admin/components/admin-layout/admin-layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { UsuariosComponent } from '../admin/pages/usuarios/usuarios';
import { ProductosComponent } from '../admin/pages/productos/productos';
import { VentasComponent } from '../admin/pages/ventas/ventas';
import { ComentariosComponent } from '../admin/pages/comentarios/comentarios';
import { CotizacionesAdminComponent } from '../admin/pages/cotizaciones/cotizaciones-admin.component';
import { ProveedoresComponent } from '../features/admin/proveedores/proveedores.component';
import { InsumosComponent } from '../features/admin/insumos/insumos.component';
import { ComprasComponent } from '../features/admin/compras/compras.component';
import { RecetasComponent } from '../features/admin/recetas/recetas.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'recetas', component: RecetasComponent },
      { path: 'ventas', component: VentasComponent },
      { path: 'cotizaciones', component: CotizacionesAdminComponent },
      { path: 'comentarios', component: ComentariosComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'insumos', component: InsumosComponent },
      { path: 'compras', component: ComprasComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
