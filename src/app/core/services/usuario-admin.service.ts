import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioAdminService {
  private apiUrl = 'https://localhost:7052/api/Usuarios';

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/con-roles`);
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  actualizarUsuario(usuario: Usuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/${usuario.id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  cambiarEstadoUsuario(id: number, estaActivo: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/estado`, { estaActivo });
  }

  obtenerRoles(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7052/api/Roles');
  }
}
