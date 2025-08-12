import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VentasService, VentaRequest, DetalleVentaRequest } from '../../services/ventas.service';
import { ProductosService, Producto } from '../../services/productos.service';

@Component({
  selector: 'app-nueva-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './nueva-venta.component.html',
  styleUrls: ['./nueva-venta.component.css']
})
export class NuevaVentaComponent implements OnInit {
  ventaForm: FormGroup;
  productos: Producto[] = [];
  productosSeleccionados: any[] = [];
  metodoPago: string[] = [];
  loading = false;
  error = '';
  success = '';

  // Cálculos
  subtotal = 0;
  descuento = 0;
  impuestos = 0;
  total = 0;
  tasaImpuesto = 0.18; // 18% IVA

  constructor(
    private fb: FormBuilder,
    private ventasService: VentasService,
    private productosService: ProductosService,
    private router: Router
  ) {
    this.metodoPago = this.ventasService.getMetodosPagoValidos();
    this.ventaForm = this.createForm();
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  createForm(): FormGroup {
    return this.fb.group({
      nombreCliente: ['', [Validators.required, Validators.maxLength(100)]],
      correoCliente: ['', [Validators.email, Validators.maxLength(100)]],
      telefonoCliente: ['', [Validators.maxLength(20)]],
      direccionCliente: ['', [Validators.maxLength(200)]],
      metodoPago: ['', [Validators.required]],
      observaciones: ['', [Validators.maxLength(500)]],
      descuento: [0, [Validators.min(0)]],
      productos: this.fb.array([])
    });
  }

  get productosFormArray(): FormArray {
    return this.ventaForm.get('productos') as FormArray;
  }

  cargarProductos(): void {
    this.loading = true;
    this.productosService.obtenerProductos().subscribe({
      next: (productos) => {
        this.productos = productos.filter(p => p.stock > 0);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.error = 'Error al cargar los productos';
        this.loading = false;
      }
    });
  }

  agregarProducto(): void {
    const productoForm = this.fb.group({
      productoId: ['', [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.min(0.01)]]
    });

    this.productosFormArray.push(productoForm);
  }

  eliminarProducto(index: number): void {
    this.productosFormArray.removeAt(index);
    this.calcularTotales();
  }

  onProductoSeleccionado(index: number): void {
    const productoForm = this.productosFormArray.at(index);
    const productoId = productoForm.get('productoId')?.value;
    
    if (productoId) {
      const producto = this.productos.find(p => p.id === parseInt(productoId));
      if (producto) {
        productoForm.patchValue({
          precioUnitario: producto.precioVenta
        });
        this.calcularTotales();
      }
    }
  }

  onCantidadChange(): void {
    this.calcularTotales();
  }

  onPrecioChange(): void {
    this.calcularTotales();
  }

  onDescuentoChange(): void {
    this.calcularTotales();
  }

  calcularTotales(): void {
    this.subtotal = 0;
    
    // Calcular subtotal de productos
    this.productosFormArray.controls.forEach(control => {
      const cantidad = control.get('cantidad')?.value || 0;
      const precio = control.get('precioUnitario')?.value || 0;
      this.subtotal += cantidad * precio;
    });

    // Aplicar descuento
    this.descuento = this.ventaForm.get('descuento')?.value || 0;
    const subtotalConDescuento = this.subtotal - this.descuento;

    // Calcular impuestos
    this.impuestos = subtotalConDescuento * this.tasaImpuesto;

    // Calcular total
    this.total = subtotalConDescuento + this.impuestos;

    // Asegurar que no sean negativos
    this.total = Math.max(0, this.total);
    this.impuestos = Math.max(0, this.impuestos);
  }

  obtenerNombreProducto(productoId: number): string {
    const producto = this.productos.find(p => p.id === productoId);
    return producto ? producto.nombre : '';
  }

  obtenerStockProducto(productoId: number): number {
    const producto = this.productos.find(p => p.id === productoId);
    return producto ? producto.stock : 0;
  }

  validarStock(): boolean {
    return this.productosFormArray.controls.every(control => {
      const productoId = control.get('productoId')?.value;
      const cantidad = control.get('cantidad')?.value;
      const stock = this.obtenerStockProducto(parseInt(productoId));
      return cantidad <= stock;
    });
  }

  onSubmit(): void {
    if (this.ventaForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    if (this.productosFormArray.length === 0) {
      this.error = 'Debe agregar al menos un producto';
      return;
    }

    if (!this.validarStock()) {
      this.error = 'Algunos productos exceden el stock disponible';
      return;
    }

    this.loading = true;
    this.error = '';

    const formValue = this.ventaForm.value;
    const ventaRequest: VentaRequest = {
      nombreCliente: formValue.nombreCliente,
      correoCliente: formValue.correoCliente || undefined,
      telefonoCliente: formValue.telefonoCliente || undefined,
      direccionCliente: formValue.direccionCliente || undefined,
      metodoPago: formValue.metodoPago,
      observaciones: formValue.observaciones || undefined,
      descuento: formValue.descuento || 0,
      productos: formValue.productos.map((p: any) => ({
        productoId: parseInt(p.productoId),
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario
      }))
    };

    this.ventasService.registrarVenta(ventaRequest).subscribe({
      next: (response) => {
        this.success = `Venta registrada exitosamente. Factura: ${response.numeroFactura}`;
        this.loading = false;
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/ventas']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al registrar venta:', error);
        this.error = 'Error al registrar la venta. Por favor, inténtelo nuevamente.';
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.ventaForm.controls).forEach(key => {
      const control = this.ventaForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          Object.keys(arrayControl.value).forEach(arrayKey => {
            arrayControl.get(arrayKey)?.markAsTouched();
          });
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/ventas']);
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(valor);
  }

  // Getters para validaciones
  get nombreCliente() { return this.ventaForm.get('nombreCliente'); }
  get correoCliente() { return this.ventaForm.get('correoCliente'); }
  get metodoPagoControl() { return this.ventaForm.get('metodoPago'); }
}
