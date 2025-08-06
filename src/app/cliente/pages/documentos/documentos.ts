import { Component, OnInit } from '@angular/core';
import { DocumentoService } from '../../../core/services/documento.service';
import { Documento } from '../../../core/models/documento.model';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.html',
  standalone: false
})
export class DocumentosComponent implements OnInit {
  documentos: Documento[] = [];
  cargando = true;

  constructor(private documentoService: DocumentoService) {}

  ngOnInit(): void {
    // Simularemos el ID del cliente como 3 por ahora
    this.documentoService.obtenerDocumentosPorCliente(3).subscribe({
      next: (docs) => {
        this.documentos = docs;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }
}
