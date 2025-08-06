import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, Usuario } from '../../../core/services/auth.service';
import { CotizacionService, CotizacionDetalle } from '../../../core/services/cotizacion.service';

export interface Cotizacion {
  id: number;
  cantidad: number;
  precioUnitario: number;
  total: number;
  fecha: string;
  estado: string;
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
  };
}

@Component({
  selector: 'app-cotizaciones-cliente',
  templateUrl: './cotizaciones-cliente.component.html',
  standalone: false
})
export class CotizacionesClienteComponent implements OnInit {
  cotizaciones: Cotizacion[] = [];
  loading = false;
  error = '';
  usuario: Usuario | null = null;
  
  // Modal para ver detalles
  mostrarModal = false;
  cotizacionDetalle: CotizacionDetalle | null = null;
  cargandoDetalle = false;

  constructor(
    private authService: AuthService,
    private cotizacionService: CotizacionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuarioActual();
    if (this.usuario) {
      this.cargarCotizaciones();
    }
    
    // Escuchar cambios en la ruta para recargar cotizaciones
    this.route.queryParams.subscribe(params => {
      if (params['refresh'] === 'true') {
        this.cargarCotizaciones();
      }
    });
  }

  cargarCotizaciones(): void {
    if (!this.usuario) return;

    this.loading = true;
    this.error = '';

    this.cotizacionService.getCotizacionesPorUsuario(this.usuario.id).subscribe({
      next: (cotizaciones) => {
        this.cotizaciones = cotizaciones;
        this.loading = false;
        console.log('Cotizaciones cargadas:', cotizaciones);
      },
      error: (err) => {
        this.error = 'Error al cargar las cotizaciones';
        this.loading = false;
        console.error('Error:', err);
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
      day: 'numeric'
    });
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(valor);
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
