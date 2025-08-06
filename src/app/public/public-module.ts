import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PublicRoutingModule } from './public-routing.module';
import { Home } from './pages/home/home';
import { Productos } from './pages/productos/productos';
import { CotizacionComponent } from './pages/cotizacion/cotizacion.component';
import { Contacto } from './pages/contacto/contacto';
import { PublicLayout } from './components/public-layout/public-layout';
import { CotizacionModule } from './pages/cotizacion/cotizacion.module';
import { FaqComponent } from './pages/faq/faq.component';


@NgModule({
  declarations: [
    Home,
    Productos,
    Contacto,
    PublicLayout,
    FaqComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PublicRoutingModule,
    CotizacionModule
  ],
  providers: [
    DatePipe
  ]
})

export class PublicModule { }