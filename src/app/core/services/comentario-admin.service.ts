import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ComentarioAdmin {
  id: number;
  producto: string;
  cliente: string;
  contenido: string;
  fecha: string;
}

export interface ComentarioConSeguimiento {
  id: number;
  comentarioTexto: string;
  calificacion: number;
  fecha: string;
  cliente: string;
  producto: string;
  estadoSeguimiento: string;
  respuestaAdmin?: string;
  fechaRespuesta?: string;
  adminResponsable?: string;
  notasInternas?: string;
  prioridad: number;
  requiereAccion: boolean;
  categoriaProblema?: string;
}

export interface ActualizarSeguimientoRequest {
  estadoSeguimiento?: string;
  respuestaAdmin?: string;
  notasInternas?: string;
  prioridad?: number;
  requiereAccion?: boolean;
  categoriaProblema?: string;
  adminId?: number;
}

export interface EstadisticasSeguimiento {
  totalComentarios: number;
  pendientes: number;
  enRevision: number;
  respondidos: number;
  resueltos: number;
  archivados: number;
  requierenAccion: number;
  altaPrioridad: number;
  promedioCalificacion: number;
}

export interface ResponderComentarioRequest {
  respuestaAdmin: string;
  adminId: number;
}

export interface ComentarioCliente {
  id: number;
  comentarioTexto: string;
  calificacion: number;
  fecha: string;
  productoNombre: string;
  respuestaAdmin?: string;
  fechaRespuesta?: string;
  tieneRespuesta: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ComentarioAdminService {
  private apiUrl = 'http://localhost:5118/api/Comentarios';

  constructor(private http: HttpClient) {}

  obtenerTodosLosComentarios(): Observable<ComentarioAdmin[]> {
    return this.http.get<ComentarioAdmin[]>(`${this.apiUrl}/lista`);
  }

  // Nuevos métodos para seguimiento
  obtenerComentariosConSeguimiento(): Observable<ComentarioConSeguimiento[]> {
    return this.http.get<ComentarioConSeguimiento[]>(`${this.apiUrl}/admin/seguimiento`);
  }

  actualizarSeguimiento(id: number, datos: ActualizarSeguimientoRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/seguimiento`, datos);
  }

  responderComentario(id: number, respuesta: ResponderComentarioRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/responder`, respuesta);
  }

  obtenerComentariosCliente(clienteId: number): Observable<ComentarioCliente[]> {
    return this.http.get<ComentarioCliente[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  obtenerEstadisticasSeguimiento(): Observable<EstadisticasSeguimiento> {
    return this.http.get<EstadisticasSeguimiento>(`${this.apiUrl}/admin/estadisticas-seguimiento`);
  }

  eliminarComentario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`);
  }
}
