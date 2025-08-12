import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface VentaRequest {
  nombreCliente: string;
  correoCliente?: string;
  telefonoCliente?: string;
  direccionCliente?: string;
  metodoPago: string;
  observaciones?: string;
  descuento: number;
  productos: DetalleVentaRequest[];
}

export interface DetalleVentaRequest {
  productoId: number;
  cantidad: number;
  precioUnitario?: number;
}

export interface VentaResponse {
  id: number;
  nombreCliente?: string;
  correoCliente?: string;
  telefonoCliente?: string;
  direccionCliente?: string;
  fecha: Date;
  estado: string;
  metodoPago?: string;
  observaciones?: string;
  numeroFactura?: string;
  subtotal: number;
  impuestos: number;
  descuento: number;
  total: number;
  vendedorNombre?: string;
  productos: DetalleVentaResponse[];
}

export interface DetalleVentaResponse {
  id: number;
  productoId: number;
  productoNombre?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface ActualizarEstadoVentaRequest {
  estado: string;
  observaciones?: string;
}

export interface EstadisticasVentas {
  ventasHoy: number;
  ventasSemana: number;
  ventasMes: number;
  ingresosHoy: number;
  ingresosSemana: number;
  ingresosMes: number;
  ventasPorEstado: VentasPorEstado[];
  productosMasVendidos: ProductoMasVendido[];
}

export interface VentasPorEstado {
  estado: string;
  cantidad: number;
}

export interface ProductoMasVendido {
  productoId: number;
  productoNombre: string;
  cantidadVendida: number;
  ingresoTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private apiUrl = `${environment.apiUrl}/api/Ventas`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Registrar nueva venta
  registrarVenta(venta: VentaRequest): Observable<VentaResponse> {
    return this.http.post<VentaResponse>(this.apiUrl, venta, { headers: this.getHeaders() });
  }

  // Obtener todas las ventas
  obtenerVentas(): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Obtener una venta específica
  obtenerVenta(id: number): Observable<VentaResponse> {
    return this.http.get<VentaResponse>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Actualizar estado de venta
  actualizarEstadoVenta(id: number, request: ActualizarEstadoVentaRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, request, { headers: this.getHeaders() });
  }

  // Obtener estadísticas
  obtenerEstadisticas(): Observable<EstadisticasVentas> {
    return this.http.get<EstadisticasVentas>(`${this.apiUrl}/estadisticas`, { headers: this.getHeaders() });
  }

  // Obtener ventas por estado
  obtenerVentasPorEstado(estado: string): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(`${this.apiUrl}/por-estado/${estado}`, { headers: this.getHeaders() });
  }

  // Buscar ventas
  buscarVentas(termino: string): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(`${this.apiUrl}/buscar?termino=${encodeURIComponent(termino)}`, { headers: this.getHeaders() });
  }

  // Estados válidos
  getEstadosValidos(): string[] {
    return ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'];
  }

  // Métodos de pago válidos
  getMetodosPagoValidos(): string[] {
    return ['Efectivo', 'Tarjeta', 'Transferencia'];
  }
}
