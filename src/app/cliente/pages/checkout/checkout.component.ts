import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VentasService, VentaRequest } from '../../../services/ventas.service';
import { AuthService } from '../../../core/services/auth.service';

export interface ItemCarrito {
  producto: any;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  carrito: ItemCarrito[] = [];
  totales: any = {};
  usuarioActual: any = null;
  
  loading = false;
  error = '';
  success = '';
  
  metodoPago: string[] = [];

  constructor(
    private fb: FormBuilder,
    private ventasService: VentasService,
    private authService: AuthService,
    private router: Router
  ) {
    this.metodoPago = this.ventasService.getMetodosPagoValidos();
    this.checkoutForm = this.createForm();
  }

  ngOnInit(): void {
    this.cargarDatosCheckout();
    this.cargarDatosUsuario();
  }

  createForm(): FormGroup {
    return this.fb.group({
      direccionEntrega: ['', [Validators.required, Validators.maxLength(200)]],
      metodoPago: ['', [Validators.required]],
      observaciones: ['', [Validators.maxLength(500)]],
      confirmacion: [false, [Validators.requiredTrue]]
    });
  }

  cargarDatosCheckout(): void {
    // Cargar carrito desde localStorage
    const carritoGuardado = localStorage.getItem('checkout_carrito');
    const totalesGuardados = localStorage.getItem('checkout_totales');
    
    if (!carritoGuardado || !totalesGuardados) {
      this.error = 'No hay productos en el carrito';
      setTimeout(() => {
        this.router.navigate(['/cliente/carrito']);
      }, 2000);
      return;
    }

    this.carrito = JSON.parse(carritoGuardado);
    this.totales = JSON.parse(totalesGuardados);
  }

  cargarDatosUsuario(): void {
    this.authService.currentUser$.subscribe(usuario => {
      this.usuarioActual = usuario;
      if (this.usuarioActual) {
        // Pre-llenar algunos campos si están disponibles
        this.checkoutForm.patchValue({
          direccionEntrega: this.usuarioActual.direccion || ''
        });
      }
    });
  }

  confirmarCompra(): void {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    if (this.carrito.length === 0) {
      this.error = 'El carrito está vacío';
      return;
    }

    this.loading = true;
    this.error = '';

    const formValue = this.checkoutForm.value;
    
    // Preparar los productos para la venta
    const productos = this.carrito.map(item => ({
      productoId: item.producto.id,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precioVenta
    }));

    const ventaRequest: VentaRequest = {
      nombreCliente: this.usuarioActual?.nombreCompleto || 'Cliente',
      correoCliente: this.usuarioActual?.correo,
      telefonoCliente: this.usuarioActual?.telefono,
      direccionCliente: formValue.direccionEntrega,
      metodoPago: formValue.metodoPago,
      observaciones: formValue.observaciones,
      descuento: 0, // Los clientes no pueden aplicar descuentos por defecto
      productos: productos
    };

    this.ventasService.registrarVenta(ventaRequest).subscribe({
      next: (response) => {
        this.success = `¡Compra realizada exitosamente! Número de factura: ${response.numeroFactura}`;
        this.loading = false;
        
        // Limpiar carrito
        localStorage.removeItem('carrito_compras');
        localStorage.removeItem('checkout_carrito');
        localStorage.removeItem('checkout_totales');
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/cliente/compras']);
        }, 3000);
      },
      error: (error) => {
        console.error('Error al procesar la compra:', error);
        this.error = 'Error al procesar la compra. Por favor, inténtelo nuevamente.';
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/cliente/carrito']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsTouched();
    });
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(valor);
  }

  // Getters para validaciones
  get direccionEntrega() { return this.checkoutForm.get('direccionEntrega'); }
  get metodoPagoControl() { return this.checkoutForm.get('metodoPago'); }
  get confirmacion() { return this.checkoutForm.get('confirmacion'); }
}
