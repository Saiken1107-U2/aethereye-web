import { Component, OnInit } from '@angular/core';
import { DocumentoService } from '../../../core/services/documento.service';
import { AuthService } from '../../../core/services/auth.service';
import { Documento } from '../../../core/models/documento.model';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.html',
  standalone: false
})
export class DocumentosComponent implements OnInit {
  documentos: Documento[] = [];
  cargando = true;
  error = '';

  constructor(
    private documentoService: DocumentoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuarioActual = this.authService.obtenerUsuarioActual();
    if (!usuarioActual) {
      this.error = 'No se pudo obtener el usuario actual';
      this.cargando = false;
      return;
    }

    // Cargar documentos relacionados con las compras del cliente
    this.documentoService.obtenerDocumentosPorCliente(usuarioActual.id).subscribe({
      next: (docs) => {
        this.documentos = docs;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar documentos:', err);
        this.error = 'Error al cargar los documentos';
        this.cargando = false;
      }
    });
  }

  descargarDocumento(documento: Documento): void {
    this.documentoService.descargarDocumento(documento.id).subscribe({
      next: (blob) => {
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = documento.nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar documento:', err);
        alert('Error al descargar el documento');
      }
    });
  }
}
