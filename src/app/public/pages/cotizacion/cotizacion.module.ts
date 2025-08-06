import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CotizacionComponent } from './cotizacion.component';

@NgModule({
  declarations: [
    CotizacionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [CotizacionComponent]
})
export class CotizacionModule { }