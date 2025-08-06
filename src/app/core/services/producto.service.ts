import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProductoPublico {
  id: number;
  nombre: string;
  descripcion: string;
  imagenUrl?: string;
  precioVenta: number;
  fechaRegistro: string;
}

export interface ProductoDetalle extends ProductoPublico {
  especificaciones?: string;
  caracteristicas?: string[];
  disponible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'https://localhost:7052/api/Productos';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<ProductoPublico[]> {
    return this.http.get<ProductoPublico[]>(this.apiUrl);
  }

  obtenerProductoPorId(id: number): Observable<ProductoDetalle> {
    return this.http.get<ProductoDetalle>(`${this.apiUrl}/${id}`);
  }
}
