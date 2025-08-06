import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Obtener el token
    const token = this.authService.obtenerToken();
    
    // Clonar la request y añadir el header de autorización si existe el token
    let authReq = req;
    if (token) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    // Enviar la request y manejar errores
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        
        // Si el error es 401 (No autorizado), cerrar sesión
        if (error.status === 401) {
          this.authService.cerrarSesion();
          return throwError(() => error);
        }

        // Si el error es 403 (Prohibido), mostrar mensaje
        if (error.status === 403) {
          console.error('No tienes permisos para realizar esta acción');
          return throwError(() => error);
        }

        return throwError(() => error);
      })
    );
  }
}
