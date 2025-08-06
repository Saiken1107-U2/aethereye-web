export interface Comentario {
  id: number;
  usuario: string;
  producto: string;
  calificacion: number;
  comentarioTexto: string;
  fecha: string;
}

export interface ComentarioRequest {
  usuarioId: number;
  productoId: number;
  comentarioTexto: string;
  calificacion: number;
}
