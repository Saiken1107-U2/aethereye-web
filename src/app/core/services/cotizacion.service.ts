import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CotizacionRequest } from '../models/cotizacion-request.model';
import { Observable } from 'rxjs';

export interface Cotizacion {
  id: number;
  cantidad: number;
  precioUnitario: number;
  total: number;
  fecha: string;
  estado: string;
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  usuario?: {
    id: number;
    nombreCompleto: string;
    correo: string;
  };
}

export interface CotizacionDetalle {
  id: number;
  cantidad: number;
  precioUnitario: number;
  total: number;
  fecha: string;
  estado: string;
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  usuario: {
    id: number;
    nombreCompleto: string;
    correo: string;
  };
  desglose: {
    insumo: string;
    cantidad: number;
    costoUnitario: number;
    subtotal: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  private apiUrl = 'https://localhost:7052/api/Cotizaciones';

  constructor(private http: HttpClient) {}

  crearCotizacion(data: CotizacionRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, data);
  }

  // Para clientes
  getCotizacionesPorUsuario(usuarioId: number): Observable<Cotizacion[]> {
    return this.http.get<Cotizacion[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  // Para admin
  getCotizacionesPendientes(): Observable<Cotizacion[]> {
    return this.http.get<Cotizacion[]>(`${this.apiUrl}/pendientes`);
  }

  getTodasLasCotizaciones(): Observable<Cotizacion[]> {
    return this.http.get<Cotizacion[]>(`${this.apiUrl}/todas`);
  }

  // Detalle de cotización
  getDetalleCotizacion(id: number): Observable<CotizacionDetalle> {
    return this.http.get<CotizacionDetalle>(`${this.apiUrl}/detalle/${id}`);
  }

  // Cambiar estado (solo admin)
  cambiarEstado(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, { estado });
  }
}
