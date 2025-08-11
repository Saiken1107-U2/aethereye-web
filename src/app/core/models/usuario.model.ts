export interface Usuario {
  id: number;
  nombreCompleto: string;
  correo: string;
  rol?: string;
  estaActivo?: boolean;
}

export interface ActualizarPerfilRequest {
  nombreCompleto: string;
  correo: string;
}

export interface CambiarPasswordRequest {
  contrasenaActual: string;
  contrasenaNueva: string;
}