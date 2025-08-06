import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comentario } from '../models/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private apiUrl = 'https://localhost:7052/api/Comentarios';

  constructor(private http: HttpClient) {}

  obtenerComentariosPorCliente(usuarioId: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  crearComentario(data: { usuarioId: number; productoId: number; comentarioTexto: string; calificacion: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, data);
  }

  obtenerComentariosPorProducto(productoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/producto/${productoId}`);
  }

  obtenerProductosComprados(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos-comprados/${usuarioId}`);
  }

  obtenerEstadisticasProducto(productoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estadisticas/${productoId}`);
  }
}
