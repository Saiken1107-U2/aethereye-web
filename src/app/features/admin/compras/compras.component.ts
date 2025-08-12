import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ComprasService } from '../../../core/services/compras.service';

export interface Compra {
  id: number;
  fecha: string;
  total: number;
  proveedor: {
    id: number;
    nombre: string;
    nombreContacto: string;
  };
  detallesCompra: Array<{
    id: number;
    cantidad: number;
    costoUnitario: number;
    subtotal: number;
    insumo: {
      id: number;
      nombre: string;
      unidadMedida: string;
    };
  }>;
  totalItems: number;
  estado: string;
  numeroFactura?: string;
  observaciones?: string;
  proveedorId?: number;
}

export interface Proveedor {
  id: number;
  nombre: string;
}

export interface Insumo {
  id: number;
  nombre: string;
  unidadMedida: string;
  stockActual: number;
  costoUnitario: number;
}

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  compras: Compra[] = [];
  proveedores: Proveedor[] = [];
  insumos: Insumo[] = [];
  loading = false;
  error: string | null = null;
  
  // Estados de la vista
  vistaActual: 'lista' | 'nueva' = 'lista';
  
  // Formulario
  compraForm: FormGroup;
  
  // Estadísticas
  estadisticas: any = null;
  
  // Modal de detalles
  mostrarModal = false;
  compraDetalle: Compra | null = null;

  constructor(
    private comprasService: ComprasService,
    private fb: FormBuilder
  ) {
    this.compraForm = this.fb.group({
      proveedorId: ['', Validators.required],
      numeroFactura: [''],
      observaciones: [''],
      insumos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    this.error = null;

    // Cargar compras
    this.comprasService.getCompras().subscribe({
      next: (data) => {
        this.compras = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las compras';
        this.loading = false;
        console.error('Error:', err);
      }
    });

    // Cargar proveedores
    this.comprasService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
      },
      error: (err) => {
        console.error('Error al cargar proveedores:', err);
      }
    });

    // Cargar insumos
    this.comprasService.getInsumos().subscribe({
      next: (data) => {
        this.insumos = data;
      },
      error: (err) => {
        console.error('Error al cargar insumos:', err);
      }
    });

    // Cargar estadísticas
    this.comprasService.getEstadisticas().subscribe({
      next: (data) => {
        this.estadisticas = data;
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
      }
    });
  }

  get insumosFormArray(): FormArray {
    return this.compraForm.get('insumos') as FormArray;
  }

  agregarInsumo(): void {
    const insumoGroup = this.fb.group({
      insumoId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(0.01)]],
      costoUnitario: [0, [Validators.required, Validators.min(0.01)]]
    });

    this.insumosFormArray.push(insumoGroup);
  }

  removerInsumo(index: number): void {
    this.insumosFormArray.removeAt(index);
  }

  onInsumoChange(index: number): void {
    const insumoControl = this.insumosFormArray.at(index);
    const insumoId = insumoControl.get('insumoId')?.value;
    
    if (insumoId) {
      const insumo = this.insumos.find(i => i.id === parseInt(insumoId));
      if (insumo) {
        insumoControl.patchValue({
          costoUnitario: insumo.costoUnitario
        });
      }
    }
  }

  calcularSubtotal(index: number): number {
    const insumoControl = this.insumosFormArray.at(index);
    const cantidad = insumoControl.get('cantidad')?.value || 0;
    const costoUnitario = insumoControl.get('costoUnitario')?.value || 0;
    return cantidad * costoUnitario;
  }

  calcularTotal(): number {
    let total = 0;
    for (let i = 0; i < this.insumosFormArray.length; i++) {
      total += this.calcularSubtotal(i);
    }
    return total;
  }

  mostrarFormulario(): void {
    this.vistaActual = 'nueva';
    this.compraForm.reset();
    this.insumosFormArray.clear();
    this.agregarInsumo(); // Agregar primera fila
  }

  mostrarLista(): void {
    this.vistaActual = 'lista';
    this.compraEditandoId = null; // Limpiar el ID de edición
  }

  guardarCompra(): void {
    if (this.compraForm.valid && this.insumosFormArray.length > 0) {
      this.loading = true;
      
      const compraData = {
        proveedorId: parseInt(this.compraForm.get('proveedorId')?.value),
        numeroFactura: this.compraForm.get('numeroFactura')?.value,
        observaciones: this.compraForm.get('observaciones')?.value,
        insumos: this.insumosFormArray.value.map((insumo: any) => ({
          insumoId: parseInt(insumo.insumoId),
          cantidad: parseFloat(insumo.cantidad),
          costoUnitario: parseFloat(insumo.costoUnitario)
        }))
      };

      // Verificar si estamos editando o creando
      if (this.compraEditandoId) {
        // Actualizar compra existente
        this.comprasService.actualizarCompra(this.compraEditandoId, compraData).subscribe({
          next: (response) => {
            console.log('Compra actualizada:', response);
            this.mostrarLista();
            this.cargarDatos();
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Error al actualizar la compra';
            this.loading = false;
            console.error('Error:', err);
          }
        });
      } else {
        // Crear nueva compra
        this.comprasService.registrarCompra(compraData).subscribe({
          next: (response) => {
            console.log('Compra registrada:', response);
            this.mostrarLista();
            this.cargarDatos();
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Error al registrar la compra';
            this.loading = false;
            console.error('Error:', err);
          }
        });
      }
    } else {
      this.error = 'Por favor complete todos los campos requeridos';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(value);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getNombreProveedor(proveedorId: number): string {
    const proveedor = this.proveedores.find(p => p.id === proveedorId);
    return proveedor ? proveedor.nombre : 'Desconocido';
  }

  getNombreInsumo(insumoId: number): string {
    const insumo = this.insumos.find(i => i.id === insumoId);
    return insumo ? insumo.nombre : 'Desconocido';
  }

  // Nuevos métodos para ver detalles, editar y eliminar
  verDetalles(compra: Compra): void {
    this.comprasService.getCompra(compra.id).subscribe({
      next: (data) => {
        this.compraDetalle = data;
        this.mostrarModal = true;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles de la compra';
        console.error('Error:', err);
      }
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.compraDetalle = null;
  }

  editarCompra(compra: Compra): void {
    // Cargar los datos de la compra en el formulario
    this.comprasService.getCompra(compra.id).subscribe({
      next: (data) => {
        // Limpiar el formulario existente
        this.compraForm.patchValue({
          proveedorId: data.proveedorId,
          numeroFactura: data.numeroFactura || '',
          observaciones: data.observaciones || ''
        });

        // Limpiar y repoblar los insumos
        const insumosArray = this.compraForm.get('insumos') as FormArray;
        insumosArray.clear();

        if (data.detallesCompra && data.detallesCompra.length > 0) {
          data.detallesCompra.forEach((detalle: any) => {
            insumosArray.push(this.fb.group({
              insumoId: [detalle.insumoId, Validators.required],
              cantidad: [detalle.cantidad, [Validators.required, Validators.min(0.01)]],
              costoUnitario: [detalle.costoUnitario, [Validators.required, Validators.min(0.01)]]
            }));
          });
        }

        // Cambiar a vista de edición
        this.vistaActual = 'nueva';
        this.compraEditandoId = compra.id;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos de la compra para edición';
        console.error('Error:', err);
      }
    });
  }

  eliminarCompra(compra: Compra): void {
    if (confirm(`¿Está seguro que desea eliminar la compra #${compra.id}?\n\nEsta acción no se puede deshacer.`)) {
      this.loading = true;
      this.comprasService.eliminarCompra(compra.id).subscribe({
        next: (response) => {
          console.log('Compra eliminada:', response);
          this.cargarDatos(); // Recargar la lista
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al eliminar la compra';
          this.loading = false;
          console.error('Error:', err);
        }
      });
    }
  }

  // Variable para controlar si estamos editando
  compraEditandoId: number | null = null;
}
