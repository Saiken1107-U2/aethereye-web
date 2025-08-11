import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Insumo, InsumoRequest, MovimientoStock, MovimientoStockRequest } from '../models/insumo.model';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {
  private apiUrl = 'http://localhost:5118/api/Insumos';

  constructor(private http: HttpClient) {}

  // CRUD básico de Insumos
  obtenerInsumos(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  obtenerInsumo(id: number): Observable<Insumo> {
    return this.http.get<Insumo>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  crearInsumo(insumo: InsumoRequest): Observable<any> {
    return this.http.post(this.apiUrl, insumo)
      .pipe(
        catchError(this.handleError)
      );
  }

  actualizarInsumo(id: number, insumo: InsumoRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, insumo)
      .pipe(
        catchError(this.handleError)
      );
  }

  eliminarInsumo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Gestión de Stock
  obtenerInsumosConStockBajo(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(`${this.apiUrl}/stock-bajo`)
      .pipe(
        catchError(this.handleError)
      );
  }

  ajustarStock(id: number, movimiento: MovimientoStockRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/ajustar-stock`, movimiento)
      .pipe(
        catchError(this.handleError)
      );
  }

  obtenerMovimientosStock(insumoId: number): Observable<MovimientoStock[]> {
    return this.http.get<MovimientoStock[]>(`${this.apiUrl}/${insumoId}/movimientos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Búsquedas y filtros
  buscarInsumos(termino: string): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(`${this.apiUrl}/buscar?termino=${encodeURIComponent(termino)}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  obtenerInsumosPorCategoria(categoria: string): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(`${this.apiUrl}/categoria/${encodeURIComponent(categoria)}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  obtenerCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categorias`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Reportes
  obtenerReporteValorInventario(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reporte/valor-inventario`)
      .pipe(
        catchError(this.handleError)
      );
  }

  obtenerReporteMovimientos(fechaInicio: string, fechaFin: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reporte/movimientos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
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
