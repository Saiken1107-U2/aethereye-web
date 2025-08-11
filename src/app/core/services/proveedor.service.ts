import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Proveedor, ProveedorRequest } from '../models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = 'http://localhost:5118/api/Proveedores';

  constructor(private http: HttpClient) {}

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  obtenerProveedor(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  crearProveedor(proveedor: ProveedorRequest): Observable<any> {
    return this.http.post(this.apiUrl, proveedor)
      .pipe(
        catchError(this.handleError)
      );
  }

  actualizarProveedor(id: number, proveedor: ProveedorRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, proveedor)
      .pipe(
        catchError(this.handleError)
      );
  }

  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }



  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage += `\nDetalle: ${error.error.message}`;
      }
    }
    
    console.error('Error completo:', error);
    return throwError(() => new Error(errorMessage));
  }
}
