import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoAdminService } from '../../../core/services/producto-admin.service';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.html',
  standalone: false
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  form: FormGroup;
  modoEditar = false;

  constructor(private productoService: ProductoAdminService, private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioUnitario: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe(data => {
      this.productos = data;
    });
  }

  guardar(): void {
    if (this.form.invalid) return;

    const producto: Producto = this.form.value;

    if (this.modoEditar) {
      this.productoService.actualizarProducto(producto).subscribe(() => {
        this.cargarProductos();
        this.resetForm();
      });
    } else {
      this.productoService.crearProducto(producto).subscribe(() => {
        this.cargarProductos();
        this.resetForm();
      });
    }
  }

  editar(producto: Producto): void {
    this.form.patchValue(producto);
    this.modoEditar = true;
  }

  eliminar(id: number): void {
    if (confirm('¿Deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe(() => {
        this.cargarProductos();
      });
    }
  }

  resetForm(): void {
    this.form.reset({ id: 0 });
    this.modoEditar = false;
  }
}
