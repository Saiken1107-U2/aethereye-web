import { Component, OnInit } from '@angular/core';
import { VentaAdminService, VentaAdmin } from '../../../core/services/venta-admin.service';

interface VentaDetalle {
  id: number;
  producto: string;
  clienteNombre: string;
  cantidad: number;
  total: number;
  estado: string;
  fecha: string;
  cliente: {
    nombre: string;
    correo: string;
  };
  productos: Array<{
    id: number;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
}

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.html',
  standalone: false
})
export class VentasComponent implements OnInit {
  ventas: VentaAdmin[] = [];
  mostrarModal: boolean = false;
  ventaDetalle: VentaDetalle | null = null;

  constructor(private ventaService: VentaAdminService) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.ventaService.obtenerTodasLasVentas().subscribe({
      next: (data) => {
        this.ventas = data;
      },
      error: (error) => {
        console.error('Error al cargar ventas:', error);
      }
    });
  }

  verDetalle(ventaId: number): void {
    // Buscar la venta en el array actual
    const venta = this.ventas.find(v => v.id === ventaId);
    if (venta) {
      // Simular datos detallados hasta que esté disponible el endpoint
      this.ventaDetalle = {
        id: venta.id,
        producto: venta.producto,
        clienteNombre: venta.cliente,
        cantidad: venta.cantidad,
        total: venta.total,
        estado: venta.estado,
        fecha: venta.fecha,
        cliente: {
          nombre: venta.cliente || 'Cliente no especificado',
          correo: 'cliente@ejemplo.com'
        },
        productos: [
          {
            id: 1,
            nombre: venta.producto,
            cantidad: venta.cantidad,
            precioUnitario: venta.total / venta.cantidad,
            subtotal: venta.total
          }
        ]
      };
      this.mostrarModal = true;
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.ventaDetalle = null;
  }
}
