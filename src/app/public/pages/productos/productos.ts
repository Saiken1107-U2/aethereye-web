import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService, ProductoPublico, ProductoDetalle } from '../../../core/services/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
  standalone: false
})
export class Productos implements OnInit {
  productos: ProductoPublico[] = [];
  loading = false;
  error = '';

  // Modal para ver detalles
  mostrarModal = false;
  productoDetalle: ProductoDetalle | null = null;
  cargandoDetalle = false;

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.error = '';

    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos';
        this.loading = false;
        console.error('Error:', err);
        // Fallback a datos de ejemplo si la API no está disponible
        this.cargarProductosEjemplo();
      }
    });
  }

  cargarProductosEjemplo(): void {
    this.productos = [
      {
        id: 1,
        nombre: 'Producto Químico A',
        descripcion: 'Producto especializado para procesos industriales',
        precioVenta: 150000,
        imagenUrl: 'assets/aethereye.png',
        fechaRegistro: new Date().toISOString()
      },
      {
        id: 2,
        nombre: 'Producto Químico B',
        descripcion: 'Solución avanzada para laboratorios',
        precioVenta: 280000,
        imagenUrl: 'assets/aethereye.png',
        fechaRegistro: new Date().toISOString()
      },
      {
        id: 3,
        nombre: 'Producto Químico C',
        descripcion: 'Compuesto de alta pureza para investigación',
        precioVenta: 420000,
        imagenUrl: 'assets/aethereye.png',
        fechaRegistro: new Date().toISOString()
      }
    ];
    this.loading = false;
  }

  verDetalle(productoId: number): void {
    this.cargandoDetalle = true;
    this.mostrarModal = true;
    
    this.productoService.obtenerProductoPorId(productoId).subscribe({
      next: (detalle) => {
        this.productoDetalle = detalle;
        this.cargandoDetalle = false;
      },
      error: (err) => {
        console.error('Error al cargar detalle:', err);
        // Crear detalle de ejemplo si la API no está disponible
        const producto = this.productos.find(p => p.id === productoId);
        if (producto) {
          this.productoDetalle = {
            ...producto,
            especificaciones: 'Especificaciones técnicas del producto',
            caracteristicas: [
              'Alta calidad y pureza',
              'Certificado ISO 9001',
              'Almacenamiento en condiciones especiales',
              'Uso seguro en laboratorios'
            ],
            disponible: true
          };
        }
        this.cargandoDetalle = false;
      }
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoDetalle = null;
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(valor);
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  solicitarCotizacion(productoId?: number): void {
    this.cerrarModal(); // Cerrar el modal primero
    if (productoId) {
      // Redirigir a cotización con producto preseleccionado
      this.router.navigate(['/public/cotizacion'], { 
        queryParams: { producto: productoId } 
      });
    } else {
      // Redirigir a cotización general
      this.router.navigate(['/public/cotizacion']);
    }
  }
}
