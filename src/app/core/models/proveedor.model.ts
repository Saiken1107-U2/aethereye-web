export interface Proveedor {
  id: number;
  nombre: string;
  nombreContacto: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  codigoPostal?: string;
  sitioWeb?: string;
  descripcion?: string;
  estaActivo: boolean;
  fechaRegistro: string;
}

export interface ProveedorRequest {
  nombre: string;
  nombreContacto: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  codigoPostal?: string;
  sitioWeb?: string;
  descripcion?: string;
}
