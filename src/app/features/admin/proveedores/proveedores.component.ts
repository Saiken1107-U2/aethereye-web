import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProveedorService } from '../../../core/services/proveedor.service';
import { Proveedor, ProveedorRequest } from '../../../core/models/proveedor.model';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  proveedorForm: FormGroup;
  isEditing = false;
  proveedorSeleccionado: Proveedor | null = null;
  loading = false;
  error = '';
  success = '';
  mostrarFormulario = false;

  constructor(
    private proveedorService: ProveedorService,
    private fb: FormBuilder
  ) {
    this.proveedorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      nombreContacto: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      telefono: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      ciudad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      pais: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      codigoPostal: ['', [Validators.maxLength(10)]],
      sitioWeb: ['', [Validators.maxLength(200)]],
      descripcion: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.loading = true;
    this.error = '';
    
    this.proveedorService.obtenerProveedores().subscribe({
      next: (data: Proveedor[]) => {
        this.proveedores = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error al cargar proveedores: ' + error.message;
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  abrirFormulario(proveedor?: Proveedor): void {
    this.mostrarFormulario = true;
    this.error = '';
    this.success = '';

    if (proveedor) {
      this.isEditing = true;
      this.proveedorSeleccionado = proveedor;
      this.proveedorForm.patchValue({
        nombre: proveedor.nombre,
        nombreContacto: proveedor.nombreContacto,
        correo: proveedor.correo,
        telefono: proveedor.telefono,
        direccion: proveedor.direccion,
        ciudad: proveedor.ciudad,
        pais: proveedor.pais,
        codigoPostal: proveedor.codigoPostal,
        sitioWeb: proveedor.sitioWeb,
        descripcion: proveedor.descripcion
      });
    } else {
      this.isEditing = false;
      this.proveedorSeleccionado = null;
      this.proveedorForm.reset();
    }
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.isEditing = false;
    this.proveedorSeleccionado = null;
    this.proveedorForm.reset();
    this.error = '';
    this.success = '';
  }

  guardarProveedor(): void {
    if (this.proveedorForm.valid) {
      this.loading = true;
      this.error = '';
      
      const proveedorData: ProveedorRequest = this.proveedorForm.value;

      const operacion = this.isEditing && this.proveedorSeleccionado
        ? this.proveedorService.actualizarProveedor(this.proveedorSeleccionado.id, proveedorData)
        : this.proveedorService.crearProveedor(proveedorData);

      operacion.subscribe({
        next: () => {
          this.success = this.isEditing ? 'Proveedor actualizado exitosamente' : 'Proveedor creado exitosamente';
          this.loading = false;
          this.cargarProveedores();
          this.cerrarFormulario();
        },
        error: (error: any) => {
          this.error = 'Error al guardar proveedor: ' + error.message;
          this.loading = false;
          console.error('Error:', error);
        }
      });
    } else {
      this.marcarCamposComoTocados();
    }
  }



  eliminarProveedor(proveedor: Proveedor): void {
    if (confirm(`¿Está seguro de eliminar el proveedor "${proveedor.nombre}"? Esta acción no se puede deshacer.`)) {
      this.loading = true;
      this.error = '';

      this.proveedorService.eliminarProveedor(proveedor.id).subscribe({
        next: () => {
          this.success = 'Proveedor eliminado exitosamente';
          this.loading = false;
          this.cargarProveedores();
        },
        error: (error: any) => {
          this.error = 'Error al eliminar proveedor: ' + error.message;
          this.loading = false;
          console.error('Error:', error);
        }
      });
    }
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.proveedorForm.controls).forEach(key => {
      this.proveedorForm.get(key)?.markAsTouched();
    });
  }

  // Métodos auxiliares para las validaciones en el template
  campoTieneError(campo: string): boolean {
    const control = this.proveedorForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  obtenerErrorCampo(campo: string): string {
    const control = this.proveedorForm.get(campo);
    if (control && control.errors) {
      if (control.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (control.errors['email']) {
        return 'Ingrese un email válido';
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
