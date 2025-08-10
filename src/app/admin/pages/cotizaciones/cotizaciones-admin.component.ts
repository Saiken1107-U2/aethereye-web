import { Component, OnInit } from '@angular/core';
import { CotizacionService, Cotizacion, CotizacionDetalle } from '../../../core/services/cotizacion.service';

@Component({
  selector: 'app-cotizaciones-admin',
  templateUrl: './cotizaciones-admin.component.html',
  standalone: false
})
export class CotizacionesAdminComponent implements OnInit {
  cotizaciones: Cotizacion[] = [];
  cotizacionesFiltradas: Cotizacion[] = [];
  loading = false;
  error = '';
  filtroEstado = 'todas';
  
  // Modal para ver detalles
  mostrarModal = false;
  cotizacionDetalle: CotizacionDetalle | null = null;
  cargandoDetalle = false;

  constructor(private cotizacionService: CotizacionService) {}

  ngOnInit(): void {
    this.cargarCotizaciones();
  }

  cargarCotizaciones(): void {
    this.loading = true;
    this.error = '';

    this.cotizacionService.getTodasLasCotizaciones().subscribe({
      next: (cotizaciones) => {
        this.cotizaciones = cotizaciones;
        this.aplicarFiltro();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las cotizaciones';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  aplicarFiltro(): void {
    if (this.filtroEstado === 'todas') {
      this.cotizacionesFiltradas = [...this.cotizaciones];
    } else {
      this.cotizacionesFiltradas = this.cotizaciones.filter(
        c => c.estado.toLowerCase() === this.filtroEstado.toLowerCase()
      );
    }
  }

  cambiarEstado(cotizacionId: number, nuevoEstado: string): void {
    this.cotizacionService.cambiarEstado(cotizacionId, nuevoEstado).subscribe({
      next: () => {
        // Actualizar el estado local
        const cotizacion = this.cotizaciones.find(c => c.id === cotizacionId);
        if (cotizacion) {
          cotizacion.estado = nuevoEstado;
          this.aplicarFiltro();
        }
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        alert('Error al cambiar el estado de la cotización');
      }
    });
  }

  getEstadoColor(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprobada':
        return 'bg-green-100 text-green-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor);
  }

  getEstadisticas() {
    const total = this.cotizaciones.length;
    const pendientes = this.cotizaciones.filter(c => c.estado === 'Pendiente').length;
    const aprobadas = this.cotizaciones.filter(c => c.estado === 'Aprobada').length;
    const rechazadas = this.cotizaciones.filter(c => c.estado === 'Rechazada').length;

    return { total, pendientes, aprobadas, rechazadas };
  }

  verDetalle(cotizacionId: number): void {
    this.cargandoDetalle = true;
    this.mostrarModal = true;
    
    this.cotizacionService.getDetalleCotizacion(cotizacionId).subscribe({
      next: (detalle) => {
        this.cotizacionDetalle = detalle;
        this.cargandoDetalle = false;
      },
      error: (err) => {
        console.error('Error al cargar detalle:', err);
        this.cargandoDetalle = false;
        this.cerrarModal();
        alert('Error al cargar el detalle de la cotización');
      }
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.cotizacionDetalle = null;
  }
}
