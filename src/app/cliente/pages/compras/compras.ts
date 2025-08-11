import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../../core/services/venta.service';
import { AuthService } from '../../../core/services/auth.service';
import { Venta, CompraDetallada } from '../../../core/models/venta.model';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.html',
  standalone: false
})
export class ComprasComponent implements OnInit {
  compras: Venta[] = [];
  cargando = true;
  error = '';

  // Modal para ver detalles
  mostrarModal = false;
  compraDetalle: CompraDetallada | null = null;
  cargandoDetalle = false;

  constructor(
    private ventaService: VentaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarCompras();
  }

  cargarCompras(): void {
    const usuarioActual = this.authService.obtenerUsuarioActual();
    
    if (!usuarioActual) {
      this.error = 'No se pudo obtener el usuario actual';
      this.cargando = false;
      return;
    }

    this.cargarComprasNormales(usuarioActual.id);
  }

  cargarComprasNormales(usuarioId: number): void {
    this.ventaService.obtenerComprasDelCliente(usuarioId).subscribe({
      next: (compras: Venta[]) => {
        this.compras = compras;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar compras:', err);
        this.error = `Error al cargar las compras: ${err.message || err.error || 'Error desconocido'}`;
        this.cargando = false;
      }
    });
  }

  verDetalle(compraId: number): void {
    const usuarioActual = this.authService.obtenerUsuarioActual();
    if (!usuarioActual) return;

    this.cargandoDetalle = true;
    this.mostrarModal = true;
    
    this.ventaService.obtenerDetalleCompra(usuarioActual.id, compraId).subscribe({
      next: (detalle: CompraDetallada) => {
        this.compraDetalle = detalle;
        this.cargandoDetalle = false;
      },
      error: (err: any) => {
        console.error('Error al cargar detalle:', err);
        this.cargandoDetalle = false;
        this.cerrarModal();
        alert('Error al cargar el detalle de la compra');
      }
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.compraDetalle = null;
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor);
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
}
