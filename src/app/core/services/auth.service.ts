import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Usuario {
  id: number;
  nombreCompleto: string;
  correo: string;
  rol: string;
}

export interface UsuarioBackend {
  id: number;
  nombreCompleto: string;
  correo: string;
  rol: string;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioBackend;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Verificar si hay un token al inicializar el servicio
    this.verificarTokenExistente();
  }

  private verificarTokenExistente(): void {
    const token = this.obtenerToken();
    if (token && !this.isTokenExpired(token)) {
      const usuario = this.extraerUsuarioDelToken(token);
      if (usuario) {
        this.currentUserSubject.next(usuario);
        this.isAuthenticatedSubject.next(true);
      }
    } else {
      this.cerrarSesion();
    }
  }

  login(correo: string, contrasena: string): Observable<LoginResponse> {
    console.log('🔐 Intentando login con:', { correo, contrasena: '***' });
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/Usuarios/login`, { correo, contrasena })
      .pipe(
        tap(response => {
          console.log('✅ Respuesta del servidor:', response);
          
          if (response.token) {
            console.log('🔑 Token recibido, guardando...');
            this.guardarToken(response.token);
            
            // Mapear UsuarioBackend a Usuario
            const usuario: Usuario = {
              id: response.usuario.id,
              nombreCompleto: response.usuario.nombreCompleto,
              correo: response.usuario.correo,
              rol: response.usuario.rol
            };
            
            console.log('👤 Usuario mapeado:', usuario);
            this.currentUserSubject.next(usuario);
            this.isAuthenticatedSubject.next(true);
          } else {
            console.error('❌ No se recibió token en la respuesta');
          }
        }),
        catchError(error => {
          console.error('❌ Error en login:', error);
          console.error('📝 Detalles del error:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });
          throw error;
        })
      );
  }

  register(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/register`, usuario);
  }

  guardarToken(token: string): void {
    localStorage.setItem('aethereye_token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('aethereye_token');
  }

  isAuthenticated(): boolean {
    const token = this.obtenerToken();
    return token !== null && !this.isTokenExpired(token);
  }

  obtenerUsuarioActual(): Usuario | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const usuario = this.obtenerUsuarioActual();
    console.log('🔍 Verificando rol:', { usuario, rolRequerido: role });
    return usuario ? usuario.rol === role : false;
  }

  isAdmin(): boolean {
    const esAdminCompleto = this.hasRole('Administrador');
    const esAdminCorto = this.hasRole('Admin'); // Compatibilidad temporal
    const esAdmin = esAdminCompleto || esAdminCorto;
    console.log('👑 ¿Es administrador?', esAdmin, '(Administrador:', esAdminCompleto, 'Admin:', esAdminCorto, ')');
    return esAdmin;
  }

  isCliente(): boolean {
    return this.hasRole('Cliente');
  }

  cerrarSesion(): void {
    localStorage.removeItem('aethereye_token');
    localStorage.removeItem('aethereye_user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  public isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() >= exp;
    } catch (error) {
      return true; // Si hay error al decodificar, consideramos el token como expirado
    }
  }

  private extraerUsuarioDelToken(token: string): Usuario | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔍 Payload del token:', payload);
      
      const usuario = {
        id: parseInt(payload.nameid || payload.id || payload.userId),
        nombreCompleto: payload.unique_name || payload.nombreCompleto || payload.name,
        correo: payload.email || payload.correo,
        rol: payload.role || payload.rol
      };
      
      console.log('👤 Usuario extraído del token:', usuario);
      return usuario;
    } catch (error) {
      console.error('❌ Error al extraer usuario del token:', error);
      return null;
    }
  }

  // Método para refrescar el token si es necesario
  refreshToken(): Observable<any> {
    const token = this.obtenerToken();
    if (!token) {
      return of(null);
    }
    
    return this.http.post(`${this.apiUrl}/Auth/refresh`, { token })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            this.guardarToken(response.token);
          }
        }),
        catchError(error => {
          this.cerrarSesion();
          return of(null);
        })
      );
  }

  // Método para cambiar contraseña
  cambiarPassword(passwordActual: string, passwordNueva: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/cambiar-password`, {
      passwordActual,
      passwordNueva
    });
  }

  // Método para recuperar contraseña
  recuperarPassword(correo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/recuperar-password`, { correo });
  }
}
