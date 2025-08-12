import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Receta {
  id: number;
  productoId: number;
  producto?: {
    id: number;
    nombre: string;
    precioUnitario: number;
  };
  insumoId: number;
  insumo?: {
    id: number;
    nombre: string;
    costoUnitario: number;
    unidadMedida: string;
    stockActual: number;
  };
  cantidadNecesaria: number;
  unidadMedida: string;
  fechaCreacion: string;
}

export interface RecetaRequest {
  productoId: number;
  insumoId: number;
  cantidadNecesaria: number;
  unidadMedida: string;
}

export interface RecetaCompleta {
  producto: {
    id: number;
    nombre: string;
    precioUnitario: number;
  };
  recetas: Receta[];
  costoTotal: number;
  margenUtilidad: number;
}

// Nuevas interfaces para explosión de materiales
export interface ExplosionMateriales {
  productoId: number;
  productoNombre: string;
  cantidadProductos: number;
  items: ExplosionItem[];
  costoTotalMateriales: number;
  costoTotalConMerma: number;
  tieneFaltantes: boolean;
  alertasFaltantes: string[];
}

export interface ExplosionItem {
  insumoId?: number;
  subproductoId?: number;
  nombre: string;
  tipo: string; // "Insumo" o "Subproducto"
  cantidadUnitaria: number;
  cantidadTotal: number;
  cantidadConMerma: number;
  unidadMedida: string;
  costoUnitario: number;
  costoTotal: number;
  porcentajeMerma: number;
  nivel: number;
  stockActual: number;
  stockDisponible: number;
  tieneFaltante: boolean;
  esCritico: boolean;
  observaciones?: string;
  subItems: ExplosionItem[];
}

export interface ExplosionRequest {
  productoId: number;
  cantidadProductos: number;
  incluirSubrecetas?: boolean;
  verificarStock?: boolean;
}

export interface SolicitudCompraAutomatica {
  productoObjetivo: number;
  cantidadObjetivo: number;
  items: ItemSolicitudCompra[];
  montoEstimado: number;
  fechaNecesaria: string;
}

export interface ItemSolicitudCompra {
  insumoId: number;
  insumoNombre: string;
  cantidadFaltante: number;
  unidadMedida: string;
  costoUnitarioEstimado: number;
  montoTotal: number;
  proveedorPreferido?: number;
  esCritico: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private apiUrl = `${environment.apiUrl}/Recetas`;

  constructor(private http: HttpClient) {}

  // Obtener todas las recetas
  obtenerRecetas(): Observable<Receta[]> {
    return this.http.get<Receta[]>(this.apiUrl);
  }

  // Obtener recetas por producto
  obtenerRecetasPorProducto(productoId: number): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.apiUrl}/producto/${productoId}`);
  }

  // Obtener receta completa con costeo
  obtenerRecetaCompleta(productoId: number): Observable<RecetaCompleta> {
    return this.http.get<RecetaCompleta>(`${this.apiUrl}/completa/${productoId}`);
  }

  // Crear nueva receta
  crearReceta(receta: RecetaRequest): Observable<Receta> {
    return this.http.post<Receta>(this.apiUrl, receta);
  }

  // Actualizar receta
  actualizarReceta(id: number, receta: RecetaRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, receta);
  }

  // Eliminar receta
  eliminarReceta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Calcular costo total de un producto
  calcularCostoProducto(productoId: number): Observable<{costoTotal: number, margenUtilidad: number}> {
    return this.http.get<{costoTotal: number, margenUtilidad: number}>(`${this.apiUrl}/costo/${productoId}`);
  }

  // Calcular explosión de materiales
  calcularExplosionMateriales(request: ExplosionRequest): Observable<ExplosionMateriales> {
    return this.http.post<ExplosionMateriales>(`${this.apiUrl}/explosion`, request);
  }

  // Generar solicitud de compra automática
  generarSolicitudCompra(productoId: number, cantidad: number): Observable<SolicitudCompraAutomatica> {
    return this.http.get<SolicitudCompraAutomatica>(`${this.apiUrl}/solicitud-compra/${productoId}/${cantidad}`);
  }
}
