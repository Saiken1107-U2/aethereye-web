import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InsumoService } from '../../../core/services/insumo.service';
import { ProveedorService } from '../../../core/services/proveedor.service';
import { Insumo, InsumoRequest, MovimientoStockRequest } from '../../../core/models/insumo.model';
import { Proveedor } from '../../../core/models/proveedor.model';

@Component({
  selector: 'app-insumos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './insumos.component.html',
  styleUrls: ['./insumos.component.css']
})
export class InsumosComponent implements OnInit {
  insumos: Insumo[] = [];
  proveedores: Proveedor[] = [];
  categorias: string[] = [];
  insumoForm: FormGroup;
  movimientoForm: FormGroup;
  
  isEditing = false;
  insumoSeleccionado: Insumo | null = null;
  loading = false;
  error = '';
  success = '';
  mostrarFormulario = false;
  mostrarMovimientos = false;
  mostrarAjusteStock = false;
  
  filtroCategoria = '';
  filtroStock = '';
  busqueda = '';

  constructor(
    private insumoService: InsumoService,
    private proveedorService: ProveedorService,
    private fb: FormBuilder
  ) {
    this.insumoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      unidadMedida: ['', [Validators.required, Validators.maxLength(20)]],
      costoUnitario: [0, [Validators.required, Validators.min(0)]],
      stockActual: [0, [Validators.required, Validators.min(0)]],
      stockMinimo: [0, [Validators.required, Validators.min(0)]],
      stockMaximo: [null, [Validators.min(0)]],
      proveedorId: [null],
      categoria: ['', [Validators.required, Validators.maxLength(50)]],
      codigoInterno: ['', [Validators.maxLength(50)]],
      fechaVencimiento: [null]
    });

    this.movimientoForm = this.fb.group({
      tipoMovimiento: ['ENTRADA', [Validators.required]],
      cantidad: [0, [Validators.required, Validators.min(0.01)]],
      costoUnitario: [0, [Validators.min(0)]],
      motivo: ['', [Validators.required, Validators.maxLength(200)]],
      documento: ['', [Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargarInsumos();
    this.cargarProveedores();
    this.cargarCategorias();
  }

  cargarInsumos(): void {
    this.loading = true;
    this.error = '';
    
    this.insumoService.obtenerInsumos().subscribe({
      next: (data: Insumo[]) => {
        this.insumos = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error al cargar insumos: ' + error.message;
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  cargarProveedores(): void {
    this.proveedorService.obtenerProveedores().subscribe({
      next: (data: Proveedor[]) => {
        this.proveedores = data.filter(p => p.estaActivo);
      },
      error: (error: any) => {
        console.error('Error al cargar proveedores:', error);
      }
    });
  }

  cargarCategorias(): void {
    this.insumoService.obtenerCategorias().subscribe({
      next: (data: string[]) => {
        this.categorias = data;
      },
      error: (error: any) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  get insumosFiltrados(): Insumo[] {
    let resultado = this.insumos;

    // Filtro por búsqueda
    if (this.busqueda.trim()) {
      const termino = this.busqueda.toLowerCase();
      resultado = resultado.filter(i => 
        i.nombre.toLowerCase().includes(termino) ||
        i.descripcion?.toLowerCase().includes(termino) ||
        i.codigoInterno?.toLowerCase().includes(termino)
      );
    }

    // Filtro por categoría
    if (this.filtroCategoria) {
      resultado = resultado.filter(i => i.categoria === this.filtroCategoria);
    }

    // Filtro por stock
    if (this.filtroStock === 'bajo') {
      resultado = resultado.filter(i => i.stockActual <= i.stockMinimo);
    } else if (this.filtroStock === 'agotado') {
      resultado = resultado.filter(i => i.stockActual === 0);
    }

    return resultado;
  }

  abrirFormulario(insumo?: Insumo): void {
    this.mostrarFormulario = true;
    this.error = '';
    this.success = '';

    if (insumo) {
      this.isEditing = true;
      this.insumoSeleccionado = insumo;
      this.insumoForm.patchValue({
        nombre: insumo.nombre,
        descripcion: insumo.descripcion,
        unidadMedida: insumo.unidadMedida,
        costoUnitario: insumo.costoUnitario,
        stockActual: insumo.stockActual,
        stockMinimo: insumo.stockMinimo,
        stockMaximo: insumo.stockMaximo,
        proveedorId: insumo.proveedorId,
        categoria: insumo.categoria,
        codigoInterno: insumo.codigoInterno,
        fechaVencimiento: insumo.fechaVencimiento ? insumo.fechaVencimiento.split('T')[0] : null
      });
    } else {
      this.isEditing = false;
      this.insumoSeleccionado = null;
      this.insumoForm.reset();
    }
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.isEditing = false;
    this.insumoSeleccionado = null;
    this.insumoForm.reset();
    this.error = '';
    this.success = '';
  }

  guardarInsumo(): void {
    if (this.insumoForm.valid) {
      this.loading = true;
      this.error = '';
      
      const insumoData: InsumoRequest = this.insumoForm.value;

      const operacion = this.isEditing && this.insumoSeleccionado
        ? this.insumoService.actualizarInsumo(this.insumoSeleccionado.id, insumoData)
        : this.insumoService.crearInsumo(insumoData);

      operacion.subscribe({
        next: () => {
          this.success = this.isEditing ? 'Insumo actualizado exitosamente' : 'Insumo creado exitosamente';
          this.loading = false;
          this.cargarInsumos();
          this.cerrarFormulario();
        },
        error: (error: any) => {
          this.error = 'Error al guardar insumo: ' + error.message;
          this.loading = false;
          console.error('Error:', error);
        }
      });
    } else {
      this.marcarCamposComoTocados();
    }
  }

  eliminarInsumo(insumo: Insumo): void {
    if (confirm(`¿Está seguro de eliminar el insumo "${insumo.nombre}"? Esta acción no se puede deshacer.`)) {
      this.loading = true;
      this.error = '';

      this.insumoService.eliminarInsumo(insumo.id).subscribe({
        next: () => {
          this.success = 'Insumo eliminado exitosamente';
          this.loading = false;
          this.cargarInsumos();
        },
        error: (error: any) => {
          this.error = 'Error al eliminar insumo: ' + error.message;
          this.loading = false;
          console.error('Error:', error);
        }
      });
    }
  }

  abrirAjusteStock(insumo: Insumo): void {
    this.insumoSeleccionado = insumo;
    this.mostrarAjusteStock = true;
    this.movimientoForm.reset({
      tipoMovimiento: 'ENTRADA',
      cantidad: 0,
      costoUnitario: insumo.costoUnitario,
      motivo: '',
      documento: ''
    });
  }

  cerrarAjusteStock(): void {
    this.mostrarAjusteStock = false;
    this.insumoSeleccionado = null;
    this.movimientoForm.reset();
  }

  aplicarAjusteStock(): void {
    if (this.movimientoForm.valid && this.insumoSeleccionado) {
      this.loading = true;
      this.error = '';
      
      const movimiento: MovimientoStockRequest = {
        insumoId: this.insumoSeleccionado.id,
        ...this.movimientoForm.value
      };

      this.insumoService.ajustarStock(this.insumoSeleccionado.id, movimiento).subscribe({
        next: () => {
          this.success = 'Stock ajustado exitosamente';
          this.loading = false;
          this.cargarInsumos();
          this.cerrarAjusteStock();
        },
        error: (error: any) => {
          this.error = 'Error al ajustar stock: ' + error.message;
          this.loading = false;
          console.error('Error:', error);
        }
      });
    }
  }

  obtenerEstadoStock(insumo: Insumo): string {
    if (insumo.stockActual === 0) return 'agotado';
    if (insumo.stockActual <= insumo.stockMinimo) return 'bajo';
    return 'normal';
  }

  obtenerClaseStock(estado: string): string {
    switch (estado) {
      case 'agotado': return 'bg-red-100 text-red-800';
      case 'bajo': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.insumoForm.controls).forEach(key => {
      this.insumoForm.get(key)?.markAsTouched();
    });
  }

  // Métodos auxiliares para las validaciones en el template
  campoTieneError(campo: string, formulario: FormGroup = this.insumoForm): boolean {
    const control = formulario.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  obtenerErrorCampo(campo: string, formulario: FormGroup = this.insumoForm): string {
    const control = formulario.get(campo);
    if (control && control.errors) {
      if (control.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (control.errors['min']) {
        return `Valor mínimo: ${control.errors['min'].min}`;
      }
      if (control.errors['minlength']) {
        return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['maxlength']) {
        return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }
}
