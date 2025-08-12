import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RecetaService, Receta, RecetaRequest, RecetaCompleta, ExplosionMateriales, ExplosionRequest, SolicitudCompraAutomatica } from '../../../core/services/receta.service';
import { ProductoAdminService } from '../../../core/services/producto-admin.service';
import { InsumoService } from '../../../core/services/insumo.service';
import { Producto } from '../../../core/models/producto.model';
import { Insumo } from '../../../core/models/insumo.model';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.css']
})
export class RecetasComponent implements OnInit {
  productos: Producto[] = [];
  insumos: Insumo[] = [];
  recetas: Receta[] = [];
  recetaCompleta: RecetaCompleta | null = null;
  explosionMateriales: ExplosionMateriales | null = null;
  solicitudCompra: SolicitudCompraAutomatica | null = null;
  
  recetaForm: FormGroup;
  explosionForm: FormGroup;
  
  productoSeleccionado: number | null = null;
  mostrarFormulario = false;
  mostrarRecetaCompleta = false;
  mostrarExplosion = false;
  mostrarSolicitudCompra = false;
  isEditing = false;
  recetaEditando: Receta | null = null;
  
  loading = false;
  error = '';
  success = '';

  constructor(
    private recetaService: RecetaService,
    private productoService: ProductoAdminService,
    private insumoService: InsumoService,
    private fb: FormBuilder
  ) {
    this.recetaForm = this.fb.group({
      productoId: [null, [Validators.required]],
      insumoId: [null, [Validators.required]],
      cantidadNecesaria: [1, [Validators.required, Validators.min(1)]],
      unidadMedida: ['', [Validators.required]]
    });

    this.explosionForm = this.fb.group({
      productoId: [null, [Validators.required]],
      cantidadProductos: [1, [Validators.required, Validators.min(1)]],
      incluirSubrecetas: [true],
      verificarStock: [true]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargarProductos();
    this.cargarInsumos();
    this.cargarRecetas();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
  }

  cargarInsumos(): void {
    this.insumoService.obtenerInsumos().subscribe({
      next: (data) => {
        this.insumos = data;
      },
      error: (error) => {
        console.error('Error al cargar insumos:', error);
      }
    });
  }

  cargarRecetas(): void {
    this.loading = true;
    this.error = '';
    
    this.recetaService.obtenerRecetas().subscribe({
      next: (data) => {
        this.recetas = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar recetas: ' + error.message;
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  seleccionarProducto(productoId: number): void {
    this.productoSeleccionado = productoId;
    this.cargarRecetasProducto(productoId);
  }

  cargarRecetasProducto(productoId: number): void {
    this.recetaService.obtenerRecetasPorProducto(productoId).subscribe({
      next: (data) => {
        this.recetas = data;
      },
      error: (error) => {
        this.error = 'Error al cargar recetas del producto';
        console.error('Error:', error);
      }
    });
  }

  abrirFormulario(productoId?: number): void {
    this.mostrarFormulario = true;
    this.isEditing = false;
    this.recetaEditando = null;
    
    if (productoId) {
      this.recetaForm.patchValue({ productoId });
    } else if (this.productoSeleccionado) {
      this.recetaForm.patchValue({ productoId: this.productoSeleccionado });
    }
  }

  editarReceta(receta: Receta): void {
    this.mostrarFormulario = true;
    this.isEditing = true;
    this.recetaEditando = receta;
    
    this.recetaForm.patchValue({
      productoId: receta.productoId,
      insumoId: receta.insumoId,
      cantidadNecesaria: receta.cantidadNecesaria,
      unidadMedida: receta.unidadMedida || 'pieza'
    });
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.isEditing = false;
    this.recetaEditando = null;
    this.recetaForm.reset();
    this.limpiarMensajes();
  }

  guardarReceta(): void {
    if (this.recetaForm.invalid) {
      this.markFormGroupTouched(this.recetaForm);
      return;
    }

    const recetaData: RecetaRequest = this.recetaForm.value;
    this.loading = true;
    this.limpiarMensajes();

    if (this.isEditing && this.recetaEditando) {
      this.recetaService.actualizarReceta(this.recetaEditando.id, recetaData).subscribe({
        next: () => {
          this.success = 'Receta actualizada exitosamente';
          this.loading = false;
          this.cerrarFormulario();
          this.cargarRecetas();
          if (this.productoSeleccionado) {
            this.cargarRecetasProducto(this.productoSeleccionado);
          }
        },
        error: (error) => {
          this.error = 'Error al actualizar receta: ' + error.message;
          this.loading = false;
        }
      });
    } else {
      this.recetaService.crearReceta(recetaData).subscribe({
        next: () => {
          this.success = 'Receta creada exitosamente';
          this.loading = false;
          this.cerrarFormulario();
          this.cargarRecetas();
          if (this.productoSeleccionado) {
            this.cargarRecetasProducto(this.productoSeleccionado);
          }
        },
        error: (error) => {
          this.error = 'Error al crear receta: ' + error.message;
          this.loading = false;
        }
      });
    }
  }

  eliminarReceta(receta: Receta): void {
    if (confirm(`¿Estás seguro de eliminar la receta: ${receta.insumo?.nombre}?`)) {
      this.loading = true;
      this.limpiarMensajes();

      this.recetaService.eliminarReceta(receta.id).subscribe({
        next: () => {
          this.success = 'Receta eliminada exitosamente';
          this.loading = false;
          this.cargarRecetas();
          if (this.productoSeleccionado) {
            this.cargarRecetasProducto(this.productoSeleccionado);
          }
        },
        error: (error) => {
          this.error = 'Error al eliminar receta: ' + error.message;
          this.loading = false;
        }
      });
    }
  }

  verRecetaCompleta(productoId: number): void {
    this.mostrarRecetaCompleta = true;
    this.loading = true;
    
    this.recetaService.obtenerRecetaCompleta(productoId).subscribe({
      next: (data) => {
        this.recetaCompleta = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar receta completa';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  cerrarRecetaCompleta(): void {
    this.mostrarRecetaCompleta = false;
    this.recetaCompleta = null;
  }

  // Nuevos métodos para explosión de materiales
  abrirExplosion(productoId?: number): void {
    this.mostrarExplosion = true;
    if (productoId) {
      this.explosionForm.patchValue({ productoId });
    } else if (this.productoSeleccionado) {
      this.explosionForm.patchValue({ productoId: this.productoSeleccionado });
    }
  }

  calcularExplosion(): void {
    if (this.explosionForm.invalid) {
      this.markFormGroupTouched(this.explosionForm);
      return;
    }

    const request: ExplosionRequest = this.explosionForm.value;
    this.loading = true;
    this.limpiarMensajes();

    this.recetaService.calcularExplosionMateriales(request).subscribe({
      next: (data) => {
        this.explosionMateriales = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al calcular explosión de materiales: ' + error.message;
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  cerrarExplosion(): void {
    this.mostrarExplosion = false;
    this.explosionMateriales = null;
    this.explosionForm.reset();
  }

  generarSolicitudCompra(): void {
    if (!this.explosionMateriales || !this.explosionMateriales.tieneFaltantes) {
      return;
    }

    this.loading = true;
    this.recetaService.generarSolicitudCompra(
      this.explosionMateriales.productoId,
      this.explosionMateriales.cantidadProductos
    ).subscribe({
      next: (data) => {
        this.solicitudCompra = data;
        this.mostrarSolicitudCompra = true;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al generar solicitud de compra: ' + error.message;
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  cerrarSolicitudCompra(): void {
    this.mostrarSolicitudCompra = false;
    this.solicitudCompra = null;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  private limpiarMensajes(): void {
    this.error = '';
    this.success = '';
  }

  // Helpers para template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.recetaForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.recetaForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['min']) return `${fieldName} debe ser mayor a 0`;
    }
    return '';
  }

  getNombreProducto(productoId: number): string {
    const producto = this.productos.find(p => p.id === productoId);
    return producto?.nombre || 'Producto no encontrado';
  }

  getNombreInsumo(insumoId: number | undefined): string {
    if (!insumoId) return 'N/A';
    const insumo = this.insumos.find(i => i.id === insumoId);
    return insumo?.nombre || 'Insumo no encontrado';
  }

  getUnidadMedida(insumoId: number | undefined): string {
    if (!insumoId) return '';
    const insumo = this.insumos.find(i => i.id === insumoId);
    return insumo?.unidadMedida || '';
  }

  calcularCostoLinea(receta: Receta): number {
    if (receta.insumo) {
      return receta.cantidadNecesaria * receta.insumo.costoUnitario;
    }
    return 0;
  }
}
