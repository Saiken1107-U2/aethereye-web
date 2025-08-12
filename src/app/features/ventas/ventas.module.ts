import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VentasComponent } from '../../components/ventas/ventas.component';
import { NuevaVentaComponent } from '../../components/nueva-venta/nueva-venta.component';

const routes: Routes = [
  {
    path: '',
    component: VentasComponent
  },
  {
    path: 'nueva',
    component: NuevaVentaComponent
  },
  {
    path: 'editar/:id',
    component: NuevaVentaComponent
  },
  {
    path: 'detalle/:id',
    loadComponent: () => import('../../components/detalle-venta/detalle-venta.component').then(c => c.DetalleVentaComponent)
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    VentasComponent,
    NuevaVentaComponent
  ]
})
export class VentasModule { }
