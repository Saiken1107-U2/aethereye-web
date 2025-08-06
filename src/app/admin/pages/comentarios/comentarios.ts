import { Component, OnInit } from '@angular/core';
import { ComentarioAdminService, ComentarioAdmin } from '../../../core/services/comentario-admin.service';

@Component({
  selector: 'app-admin-comentarios',
  templateUrl: './comentarios.html',
  standalone: false
})
export class ComentariosComponent implements OnInit {
  comentarios: ComentarioAdmin[] = [];

  constructor(private comentarioService: ComentarioAdminService) {}

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    this.comentarioService.obtenerTodosLosComentarios().subscribe(data => {
      this.comentarios = data;
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Deseas eliminar este comentario?')) {
      this.comentarioService.eliminarComentario(id).subscribe(() => {
        this.cargarComentarios();
      });
    }
  }
}
