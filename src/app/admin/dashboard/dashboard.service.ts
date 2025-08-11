import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalInsumos: number;
  valorTotalInventario: number;
  insumosStockBajo: number;
  movimientosHoy: number;
  totalProveedores: number;
  fechaActualizacion: string;
}

export interface StockByCategory {
  categoria: string;
  cantidad: number;
  valorTotal: number;
}

export interface MovementTrend {
  fecha: string;
  entradas: number;
  salidas: number;
  ajustes: number;
}

export interface AlertItem {
  insumoId: number;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  categoria: string;
  urgencia: 'Crítico' | 'Alto' | 'Medio';
}

export interface TopItem {
  insumoId: number;
  nombre: string;
  categoria: string;
  totalMovimientos: number;
  cantidadTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:5118/api/Dashboard';

  constructor(private http: HttpClient) { }

  // Obtener estadísticas principales del dashboard
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  // Obtener stock por categoría para gráficos
  getStockByCategory(): Observable<StockByCategory[]> {
    return this.http.get<StockByCategory[]>(`${this.apiUrl}/stock-by-category`);
  }

  // Obtener tendencia de movimientos
  getMovementTrend(days: number = 7): Observable<MovementTrend[]> {
    return this.http.get<MovementTrend[]>(`${this.apiUrl}/movements/${days}`);
  }

  // Obtener alertas de stock bajo
  getLowStockAlerts(): Observable<AlertItem[]> {
    return this.http.get<AlertItem[]>(`${this.apiUrl}/low-stock-alerts`);
  }

  // Obtener items más usados
  getTopItems(count: number = 5): Observable<TopItem[]> {
    return this.http.get<TopItem[]>(`${this.apiUrl}/top-items/${count}`);
  }

  // Endpoints legacy para compatibilidad
  getResumen(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resumen`);
  }

  getTotales(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/totales`);
  }
}
