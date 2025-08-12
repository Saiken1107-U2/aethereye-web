import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VentasService, VentaResponse, ActualizarEstadoVentaRequest } from '../../services/ventas.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.css']
})
export class DetalleVentaComponent implements OnInit {
  venta: VentaResponse | null = null;
  loading = false;
  error = '';
  success = '';
  
  // Para actualizar estado
  nuevoEstado = '';
  observaciones = '';
  actualizandoEstado = false;
  mostrarFormEstado = false;

  estadosDisponibles: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ventasService: VentasService
  ) {
    this.estadosDisponibles = this.ventasService.getEstadosValidos();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarVenta(parseInt(id));
    }
  }

  cargarVenta(id: number): void {
    this.loading = true;
    this.error = '';

    this.ventasService.obtenerVenta(id).subscribe({
      next: (venta) => {
        this.venta = venta;
        this.nuevoEstado = venta.estado;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar venta:', error);
        this.error = 'Error al cargar la información de la venta';
        this.loading = false;
      }
    });
  }

  actualizarEstado(): void {
    if (!this.venta || !this.nuevoEstado) return;

    this.actualizandoEstado = true;
    this.error = '';

    const request: ActualizarEstadoVentaRequest = {
      estado: this.nuevoEstado,
      observaciones: this.observaciones || undefined
    };

    this.ventasService.actualizarEstadoVenta(this.venta.id, request).subscribe({
      next: (response) => {
        this.success = 'Estado actualizado correctamente';
        this.venta!.estado = this.nuevoEstado;
        this.mostrarFormEstado = false;
        this.actualizandoEstado = false;
        this.observaciones = '';
      },
      error: (error) => {
        console.error('Error al actualizar estado:', error);
        this.error = 'Error al actualizar el estado';
        this.actualizandoEstado = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/ventas']);
  }

  imprimirFactura(): void {
    // Implementar lógica de impresión
    window.print();
  }

  getEstadoClase(estado: string): string {
    const clases: { [key: string]: string } = {
      'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Procesando': 'bg-blue-100 text-blue-800 border-blue-200',
      'Enviado': 'bg-purple-100 text-purple-800 border-purple-200',
      'Entregado': 'bg-green-100 text-green-800 border-green-200',
      'Cancelado': 'bg-red-100 text-red-800 border-red-200'
    };
    return clases[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(valor);
  }
}
