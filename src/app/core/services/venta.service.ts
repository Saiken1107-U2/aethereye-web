import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Venta, CompraDetallada } from '../models/venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = 'https://localhost:7052/api/Ventas';

  constructor(private http: HttpClient) {}

  obtenerComprasDelCliente(clienteId: number): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/cliente/${clienteId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  obtenerDetalleCompra(clienteId: number, ventaId: number): Observable<CompraDetallada> {
    return this.http.get<CompraDetallada>(`${this.apiUrl}/cliente/${clienteId}/detalle/${ventaId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método temporal para debug
  testComprasDelCliente(clienteId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/test/${clienteId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para compatibilidad hacia atrás
  obtenerVentasPorCliente(clienteId: number): Observable<Venta[]> {
    return this.obtenerComprasDelCliente(clienteId);
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
