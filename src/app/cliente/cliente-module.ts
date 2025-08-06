import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ClienteLayoutComponent } from './components/cliente-layout/cliente-layout';
import { PerfilComponent } from './pages/perfil/perfil';
import { DocumentosComponent } from './pages/documentos/documentos';
import { ComprasComponent } from './pages/compras/compras';
import { ComentariosComponent } from './pages/comentarios/comentarios';
import { CotizacionesClienteComponent } from './pages/cotizaciones/cotizaciones-cliente.component';
import { ClienteRoutingModule } from './cliente-routing-module';

@NgModule({
  declarations: [
    ClienteLayoutComponent,
    PerfilComponent,
    DocumentosComponent,
    ComprasComponent,
    ComentariosComponent,
    CotizacionesClienteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ClienteRoutingModule
  ],
  providers: [
    DatePipe
  ]
})
export class ClienteModule {}
