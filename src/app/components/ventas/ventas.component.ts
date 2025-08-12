import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VentasService, VentaResponse, EstadisticasVentas } from '../../services/ventas.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  ventas: VentaResponse[] = [];
  ventasFiltradas: VentaResponse[] = [];
  estadisticas: EstadisticasVentas | null = null;
  loading = false;
  error = '';
  
  // Filtros
  filtroEstado = '';
  filtroFecha = '';
  filtroCliente = '';
  terminoBusqueda = '';

  // Estados disponibles
  estadosDisponibles: string[] = [];

  constructor(
    private ventasService: VentasService,
    private router: Router
  ) {
    this.estadosDisponibles = this.ventasService.getEstadosValidos();
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    this.error = '';

    // Cargar ventas y estadísticas en paralelo
    Promise.all([
      this.ventasService.obtenerVentas().toPromise(),
      this.ventasService.obtenerEstadisticas().toPromise()
    ]).then(([ventas, estadisticas]) => {
      this.ventas = ventas || [];
      this.ventasFiltradas = [...this.ventas];
      this.estadisticas = estadisticas || null;
      this.loading = false;
    }).catch(error => {
      console.error('Error al cargar datos:', error);
      this.error = 'Error al cargar los datos de ventas';
      this.loading = false;
    });
  }

  aplicarFiltros(): void {
    this.ventasFiltradas = this.ventas.filter(venta => {
      // Filtro por estado
      if (this.filtroEstado && venta.estado !== this.filtroEstado) {
        return false;
      }

      // Filtro por fecha
      if (this.filtroFecha) {
        const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0];
        if (fechaVenta !== this.filtroFecha) {
          return false;
        }
      }

      // Filtro por cliente
      if (this.filtroCliente) {
        const nombreCliente = venta.nombreCliente?.toLowerCase() || '';
        if (!nombreCliente.includes(this.filtroCliente.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }

  buscarVentas(): void {
    if (!this.terminoBusqueda.trim()) {
      this.aplicarFiltros();
      return;
    }

    this.loading = true;
    this.ventasService.buscarVentas(this.terminoBusqueda).subscribe({
      next: (ventas) => {
        this.ventasFiltradas = ventas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en búsqueda:', error);
        this.error = 'Error al buscar ventas';
        this.loading = false;
      }
    });
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.filtroFecha = '';
    this.filtroCliente = '';
    this.terminoBusqueda = '';
    this.ventasFiltradas = [...this.ventas];
  }

  verDetalleVenta(id: number): void {
    this.router.navigate(['/ventas/detalle', id]);
  }

  crearNuevaVenta(): void {
    this.router.navigate(['/ventas/nueva']);
  }

  editarVenta(id: number): void {
    this.router.navigate(['/ventas/editar', id]);
  }

  getEstadoClase(estado: string): string {
    const clases: { [key: string]: string } = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Procesando': 'bg-blue-100 text-blue-800',
      'Enviado': 'bg-purple-100 text-purple-800',
      'Entregado': 'bg-green-100 text-green-800',
      'Cancelado': 'bg-red-100 text-red-800'
    };
    return clases[estado] || 'bg-gray-100 text-gray-800';
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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

  trackByVentaId(index: number, venta: VentaResponse): number {
    return venta.id;
  }
}
