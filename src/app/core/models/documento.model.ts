export interface Documento {
  id: number;
  nombre: string;
  nombreArchivo: string;
  url: string;
  productoId: number;
  fechaCreacion?: string;
  size?: number;
  tipoArchivo?: string;
}