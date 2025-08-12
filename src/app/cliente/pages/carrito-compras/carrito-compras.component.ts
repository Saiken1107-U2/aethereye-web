import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductosService, Producto } from '../../../services/productos.service';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-carrito-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css']
})
export class CarritoComprasComponent implements OnInit {
  productos: Producto[] = [];
  carrito: ItemCarrito[] = [];
  productosDisponibles: Producto[] = [];
  
  loading = false;
  error = '';
  success = '';
  
  // Cálculos del carrito
  subtotal = 0;
  impuestos = 0;
  total = 0;
  tasaImpuesto = 0.18; // 18% IVA
  
  // Filtros
  filtroCategoria = '';
  terminoBusqueda = '';
  categorias: string[] = [];

  constructor(
    private productosService: ProductosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCarritoDesdeStorage();
  }

  cargarProductos(): void {
    this.loading = true;
    this.productosService.obtenerProductosActivos().subscribe({
      next: (productos) => {
        this.productos = productos.filter(p => p.stock > 0);
        this.productosDisponibles = [...this.productos];
        this.extraerCategorias();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.error = 'Error al cargar los productos disponibles';
        this.loading = false;
      }
    });
  }

  extraerCategorias(): void {
    this.categorias = [...new Set(this.productos.map(p => p.categoria).filter((c): c is string => !!c))];
  }

  aplicarFiltros(): void {
    this.productosDisponibles = this.productos.filter(producto => {
      // Filtro por categoría
      if (this.filtroCategoria && producto.categoria !== this.filtroCategoria) {
        return false;
      }
      
      // Filtro por búsqueda
      if (this.terminoBusqueda) {
        const termino = this.terminoBusqueda.toLowerCase();
        return producto.nombre.toLowerCase().includes(termino) ||
               (producto.descripcion && producto.descripcion.toLowerCase().includes(termino));
      }
      
      return true;
    });
  }

  agregarAlCarrito(producto: Producto, cantidad: number = 1): void {
    if (cantidad <= 0 || cantidad > producto.stock) {
      this.error = 'Cantidad no válida o excede el stock disponible';
      return;
    }

    const itemExistente = this.carrito.find(item => item.producto.id === producto.id);
    
    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      if (nuevaCantidad > producto.stock) {
        this.error = `No hay suficiente stock. Disponible: ${producto.stock}`;
        return;
      }
      itemExistente.cantidad = nuevaCantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.producto.precioVenta;
    } else {
      this.carrito.push({
        producto: producto,
        cantidad: cantidad,
        subtotal: cantidad * producto.precioVenta
      });
    }

    this.calcularTotales();
    this.guardarCarritoEnStorage();
    this.success = `${producto.nombre} agregado al carrito`;
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => this.success = '', 3000);
  }

  actualizarCantidad(item: ItemCarrito, nuevaCantidad: number): void {
    if (nuevaCantidad <= 0) {
      this.eliminarDelCarrito(item);
      return;
    }

    if (nuevaCantidad > item.producto.stock) {
      this.error = `No hay suficiente stock. Disponible: ${item.producto.stock}`;
      return;
    }

    item.cantidad = nuevaCantidad;
    item.subtotal = item.cantidad * item.producto.precioVenta;
    this.calcularTotales();
    this.guardarCarritoEnStorage();
  }

  eliminarDelCarrito(item: ItemCarrito): void {
    const index = this.carrito.findIndex(i => i.producto.id === item.producto.id);
    if (index > -1) {
      this.carrito.splice(index, 1);
      this.calcularTotales();
      this.guardarCarritoEnStorage();
    }
  }

  vaciarCarrito(): void {
    this.carrito = [];
    this.calcularTotales();
    this.guardarCarritoEnStorage();
  }

  calcularTotales(): void {
    this.subtotal = this.carrito.reduce((sum, item) => sum + item.subtotal, 0);
    this.impuestos = this.subtotal * this.tasaImpuesto;
    this.total = this.subtotal + this.impuestos;
  }

  procederAlPago(): void {
    if (this.carrito.length === 0) {
      this.error = 'El carrito está vacío';
      return;
    }

    // Guardar datos para el checkout
    localStorage.setItem('checkout_carrito', JSON.stringify(this.carrito));
    localStorage.setItem('checkout_totales', JSON.stringify({
      subtotal: this.subtotal,
      impuestos: this.impuestos,
      total: this.total
    }));

    this.router.navigate(['/cliente/checkout']);
  }

  private guardarCarritoEnStorage(): void {
    localStorage.setItem('carrito_compras', JSON.stringify(this.carrito));
  }

  private cargarCarritoDesdeStorage(): void {
    const carritoGuardado = localStorage.getItem('carrito_compras');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
      this.calcularTotales();
    }
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(valor);
  }

  obtenerStockDisponible(productoId: number): number {
    const itemEnCarrito = this.carrito.find(item => item.producto.id === productoId);
    const producto = this.productos.find(p => p.id === productoId);
    
    if (!producto) return 0;
    
    return itemEnCarrito 
      ? producto.stock - itemEnCarrito.cantidad 
      : producto.stock;
  }

  estaEnCarrito(productoId: number): boolean {
    return this.carrito.some(item => item.producto.id === productoId);
  }

  getCantidadEnCarrito(productoId: number): number {
    const item = this.carrito.find(item => item.producto.id === productoId);
    return item ? item.cantidad : 0;
  }

  // Métodos auxiliares para el template
  disminuirCantidadProducto(productoId: number): void {
    const item = this.carrito.find(item => item.producto.id === productoId);
    if (item) {
      const nuevaCantidad = item.cantidad - 1;
      if (nuevaCantidad > 0) {
        this.actualizarCantidad(item, nuevaCantidad);
      } else {
        this.eliminarDelCarrito(item);
      }
    }
  }

  aumentarCantidadProducto(productoId: number): void {
    const item = this.carrito.find(item => item.producto.id === productoId);
    if (item) {
      const nuevaCantidad = item.cantidad + 1;
      const stockDisponible = this.obtenerStockDisponible(productoId) + item.cantidad;
      if (nuevaCantidad <= stockDisponible) {
        this.actualizarCantidad(item, nuevaCantidad);
      }
    }
  }

  eliminarProductoDelCarrito(productoId: number): void {
    const item = this.carrito.find(item => item.producto.id === productoId);
    if (item) {
      this.eliminarDelCarrito(item);
    }
  }
}
