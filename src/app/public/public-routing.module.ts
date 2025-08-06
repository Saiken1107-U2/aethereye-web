import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayout } from './components/public-layout/public-layout';
import { Home } from './pages/home/home';
import { Productos } from './pages/productos/productos';
import { CotizacionComponent } from './pages/cotizacion/cotizacion.component';
import { Contacto } from './pages/contacto/contacto';
import { FaqComponent } from './pages/faq/faq.component'


const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home },
      { path: 'productos', component: Productos },
      { path: 'cotizacion', component: CotizacionComponent },
      { path: 'contacto', component: Contacto },
      { path: 'faq', component: FaqComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
