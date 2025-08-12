import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario, ActualizarPerfilRequest, CambiarPasswordRequest } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:5118/api/Usuarios';

  constructor(private http: HttpClient) {}

  obtenerPerfil(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/perfil/${id}`);
  }

  actualizarPerfil(id: number, request: ActualizarPerfilRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar/${id}`, request);
  }

  cambiarPassword(id: number, request: CambiarPasswordRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/cambiar-password/${id}`, request);
  }

  // Para administradores
  obtenerUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  actualizarUsuario(usuario: Usuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/${usuario.id}`, usuario);
  }
}
