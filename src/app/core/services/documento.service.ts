import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Documento } from '../models/documento.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private apiUrl = 'https://localhost:7052/api/Documentos';

  constructor(private http: HttpClient) {}

  obtenerDocumentosPorCliente(clienteId: number): Observable<Documento[]> {
    return this.http.get<Documento[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  descargarDocumento(documentoId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/descargar/${documentoId}`, { 
      responseType: 'blob' 
    });
  }
}
