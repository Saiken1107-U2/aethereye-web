import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComentarioService } from '../../../core/services/comentario.service';
import { Comentario } from '../../../core/models/comentario.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.html',
  standalone: false
})
export class ComentariosComponent implements OnInit {
  comentarios: Comentario[] = [];
  productosComprados: any[] = [];
  form: FormGroup;
  cargando = true;
  exito = false;
  error = false;
  mensajeError = '';

  constructor(
    private comentarioService: ComentarioService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      productoId: ['', Validators.required],
      comentarioTexto: ['', [Validators.required, Validators.minLength(5)]],
      calificacion: ['', [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    this.cargarProductosComprados();
    this.obtenerComentarios();
  }

  cargarProductosComprados(): void {
    const usuarioActual = this.authService.obtenerUsuarioActual();
    if (usuarioActual) {
      console.log('Cargando productos comprados para usuario:', usuarioActual.id);
      
      this.comentarioService.obtenerProductosComprados(usuarioActual.id).subscribe({
        next: (productos) => {
          this.productosComprados = productos;
          console.log('Productos comprados cargados:', productos);
          console.log('Cantidad de productos:', productos.length);
        },
        error: (error) => {
          console.error('Error al cargar productos comprados:', error);
          console.error('Status:', error.status);
          console.error('Message:', error.message);
          console.error('Body:', error.error);
          this.mensajeError = 'Error al cargar productos comprados: ' + (error.error?.message || error.message);
        }
      });
    } else {
      console.error('No hay usuario autenticado');
      this.mensajeError = 'Usuario no autenticado';
    }
  }

  obtenerComentarios(): void {
    const usuarioActual = this.authService.obtenerUsuarioActual();
    if (usuarioActual) {
      this.comentarioService.obtenerComentariosPorCliente(usuarioActual.id).subscribe({
        next: (data) => {
          this.comentarios = data;
          this.cargando = false;
        },
        error: () => {
          this.cargando = false;
        }
      });
    }
  }

  enviarComentario(): void {
    if (this.form.invalid) {
      console.log('Formulario inválido:', this.form.errors);
      return;
    }
    
    const usuarioActual = this.authService.obtenerUsuarioActual();
    if (!usuarioActual) {
      this.error = true;
      this.mensajeError = 'Usuario no autenticado';
      console.error('Usuario no autenticado');
      return;
    }

    const comentarioData = {
      usuarioId: usuarioActual.id,
      productoId: parseInt(this.form.value.productoId),
      comentarioTexto: this.form.value.comentarioTexto,
      calificacion: parseInt(this.form.value.calificacion)
    };

    console.log('Enviando comentario:', comentarioData);
    console.log('Usuario actual:', usuarioActual);

    this.comentarioService.crearComentario(comentarioData).subscribe({
      next: (response) => {
        console.log('Respuesta exitosa:', response);
        this.exito = true;
        this.error = false;
        this.mensajeError = '';
        this.form.reset();
        this.obtenerComentarios();
      },
      error: (error) => {
        console.error('Error completo:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error body:', error.error);
        this.exito = false;
        this.error = true;
        this.mensajeError = error.error?.message || error.error || 'Error al enviar el comentario';
      }
    });
  }
}
