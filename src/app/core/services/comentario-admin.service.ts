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

@Injectable({
  providedIn: 'root'
})
export class ComentarioAdminService {
  private apiUrl = 'https://localhost:7052/api/Comentarios';

  constructor(private http: HttpClient) {}

  obtenerTodosLosComentarios(): Observable<ComentarioAdmin[]> {
    return this.http.get<ComentarioAdmin[]>(`${this.apiUrl}/lista`);
  }

  eliminarComentario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`);
  }
}
