import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CotizacionService } from '../../../core/services/cotizacion.service';
import { AuthService, Usuario } from '../../../core/services/auth.service';
import { ProductoService, ProductoPublico } from '../../../core/services/producto.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.html',
  styleUrls: ['./cotizacion.css'],
  standalone: false
})
export class CotizacionComponent implements OnInit {
  form: FormGroup;
  enviado = false;
  exito = false;
  error = false;
  errorMessage = '';
  usuario: Usuario | null = null;
  productos: ProductoPublico[] = [];
  cargandoProductos = false;

  constructor(
    private fb: FormBuilder,
    private cotizacionService: CotizacionService,
    private authService: AuthService,
    private productoService: ProductoService,
    private router: Router
  ) {
    this.form = this.fb.group({
      productoId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuarioActual();
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargandoProductos = true;
    this.productoService.obtenerProductos().subscribe({
      next: (productos: ProductoPublico[]) => {
        this.productos = productos;
        this.cargandoProductos = false;
      },
      error: (err: any) => {
        console.error('Error al cargar productos:', err);
        this.cargandoProductos = false;
      }
    });
  }

  enviar(): void {
    if (this.form.invalid) return;
    
    if (!this.usuario) {
      this.errorMessage = 'Debes iniciar sesión para solicitar una cotización.';
      this.error = true;
      return;
    }

    this.enviado = true;
    this.error = false;
    this.exito = false;

    const cotizacionData = {
      usuarioId: this.usuario.id,
      productoId: parseInt(this.form.value.productoId),
      cantidad: this.form.value.cantidad
    };

    this.cotizacionService.crearCotizacion(cotizacionData).subscribe({
      next: (response: any) => {
        console.log('Cotización creada:', response);
        this.exito = true;
        this.error = false;
        this.form.reset({ cantidad: 1 });
        
        // Esperar 2 segundos y redirigir al módulo de cotizaciones del cliente
        setTimeout(() => {
          this.router.navigate(['/cliente/cotizaciones'], { 
            queryParams: { refresh: 'true' } 
          });
        }, 2000);
      },
      error: (err: any) => {
        console.error('Error al crear cotización:', err);
        this.error = true;
        this.exito = false;
        this.errorMessage = err.error?.message || 'Error al enviar la cotización. Intenta de nuevo.';
        this.enviado = false;
      }
    });
  }
}