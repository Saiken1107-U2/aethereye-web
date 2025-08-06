import { Component, OnInit } from '@angular/core';
import { VentaAdminService, VentaAdmin } from '../../../core/services/venta-admin.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.html',
  standalone: false
})
export class VentasComponent implements OnInit {
  ventas: VentaAdmin[] = [];

  constructor(private ventaService: VentaAdminService) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.ventaService.obtenerTodasLasVentas().subscribe(data => {
      this.ventas = data;
    });
  }
}
