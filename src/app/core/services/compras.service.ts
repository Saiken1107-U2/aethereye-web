import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CompraRequest {
  proveedorId: number;
  numeroFactura?: string;
  observaciones?: string;
  insumos: Array<{
    insumoId: number;
    cantidad: number;
    costoUnitario: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private apiUrl = `${environment.apiUrl}/Compras`;

  constructor(private http: HttpClient) {}

  getCompras(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCompra(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getEstadisticas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estadisticas`);
  }

  registrarCompra(compra: CompraRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, compra);
  }

  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Proveedores`);
  }

  getInsumos(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Insumos`);
  }

  actualizarCompra(id: number, compra: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, compra);
  }

  eliminarCompra(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
