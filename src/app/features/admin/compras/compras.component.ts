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

      this.comprasService.registrarCompra(compraData).subscribe({
        next: (response) => {
          console.log('Compra registrada:', response);
          this.mostrarLista();
          this.cargarDatos();
        },
        error: (err) => {
          this.error = 'Error al registrar la compra';
          this.loading = false;
          console.error('Error:', err);
        }
      });
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
}
