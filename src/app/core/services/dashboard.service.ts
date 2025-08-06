import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://localhost:7052/api/Dashboard'; // Crea este controller si no existe

  constructor(private http: HttpClient) {}

  obtenerTotales(): Observable<{ usuarios: number, productos: number, ventas: number, comentarios: number }> {
    return this.http.get<{ usuarios: number, productos: number, ventas: number, comentarios: number }>(`${this.apiUrl}/totales`);
  }
}
