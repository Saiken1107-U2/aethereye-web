import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface VentaAdmin {
  id: number;
  producto: string;
  cliente: string;
  cantidad: number;
  total: number;
  estado: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class VentaAdminService {
  private apiUrl = 'http://localhost:5118/api/Ventas';

  constructor(private http: HttpClient) {}

  obtenerTodasLasVentas(): Observable<VentaAdmin[]> {
    return this.http.get<VentaAdmin[]>(`${this.apiUrl}/todas`);
  }
}
