import { Component, OnInit } from '@angular/core';
import { ComentarioAdminService, ComentarioAdmin } from '../../../core/services/comentario-admin.service';

interface ComentarioDetalle {
  id: number;
  producto: string;
  cliente: string;
  contenido: string;
  fecha: string;
  calificacion: number;
  cliente_detalle: {
    nombre: string;
    correo: string;
  };
  producto_detalle: {
    nombre: string;
    categoria: string;
  };
}

@Component({
  selector: 'app-admin-comentarios',
  templateUrl: './comentarios.html',
  standalone: false
})
export class ComentariosComponent implements OnInit {
  comentarios: ComentarioAdmin[] = [];
  mostrarModal: boolean = false;
  comentarioDetalle: ComentarioDetalle | null = null;

  constructor(private comentarioService: ComentarioAdminService) {}

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    this.comentarioService.obtenerTodosLosComentarios().subscribe({
      next: (data) => {
        this.comentarios = data;
      },
      error: (error) => {
        console.error('Error al cargar comentarios:', error);
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Deseas eliminar este comentario?')) {
      this.comentarioService.eliminarComentario(id).subscribe({
        next: () => {
          this.cargarComentarios();
        },
        error: (error) => {
          console.error('Error al eliminar comentario:', error);
        }
      });
    }
  }

  verDetalle(comentarioId: number): void {
    const comentario = this.comentarios.find(c => c.id === comentarioId);
    if (comentario) {
      // Simular datos detallados hasta que esté disponible el endpoint
      this.comentarioDetalle = {
        id: comentario.id,
        producto: comentario.producto,
        cliente: comentario.cliente,
        contenido: comentario.contenido,
        fecha: comentario.fecha,
        calificacion: 5, // Calificación simulada
        cliente_detalle: {
          nombre: comentario.cliente || 'Cliente no especificado',
          correo: 'cliente@ejemplo.com'
        },
        producto_detalle: {
          nombre: comentario.producto,
          categoria: 'Categoría general'
        }
      };
      this.mostrarModal = true;
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.comentarioDetalle = null;
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  eliminarComentario(id: number): void {
    this.eliminar(id);
    this.cerrarModal();
  }
}
