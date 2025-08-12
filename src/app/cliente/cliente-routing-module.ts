import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteLayoutComponent } from './components/cliente-layout/cliente-layout';
import { PerfilComponent } from './pages/perfil/perfil';
import { DocumentosComponent } from './pages/documentos/documentos';
import { ComprasComponent } from './pages/compras/compras';
import { ComentariosComponent } from './pages/comentarios/comentarios';
import { CotizacionesClienteComponent } from './pages/cotizaciones/cotizaciones-cliente.component';

const routes: Routes = [
  {
    path: '',
    component: ClienteLayoutComponent,
    children: [ 
      { path: 'perfil', component: PerfilComponent },
      { path: 'documentos', component: DocumentosComponent },
      { path: 'compras', component: ComprasComponent },
      { path: 'cotizaciones', component: CotizacionesClienteComponent },
      { path: 'comentarios', component: ComentariosComponent },
      { 
        path: 'carrito', 
        loadComponent: () => import('./pages/carrito-compras/carrito-compras.component').then(c => c.CarritoComprasComponent)
      },
      { 
        path: 'checkout', 
        loadComponent: () => import('./pages/checkout/checkout.component').then(c => c.CheckoutComponent)
      },
      { path: '', redirectTo: 'carrito', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule {}
