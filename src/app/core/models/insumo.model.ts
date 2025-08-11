export interface Insumo {
  id: number;
  nombre: string;
  descripcion?: string;
  unidadMedida: string;
  costoUnitario: number;
  stockActual: number;
  stockMinimo: number;
  stockMaximo?: number;
  proveedorId?: number;
  proveedorNombre?: string;
  categoria: string;
  codigoInterno?: string;
  fechaUltimaActualizacion: string;
  fechaVencimiento?: string;
  activo: boolean;
}

export interface InsumoRequest {
  nombre: string;
  descripcion?: string;
  unidadMedida: string;
  costoUnitario: number;
  stockActual: number;
  stockMinimo: number;
  stockMaximo?: number;
  proveedorId?: number;
  categoria: string;
  codigoInterno?: string;
  fechaVencimiento?: string;
}

export interface MovimientoStock {
  id: number;
  insumoId: number;
  tipoMovimiento: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  cantidad: number;
  costoUnitario?: number;
  motivo: string;
  fecha: string;
  usuarioId: number;
  documento?: string;
}

export interface MovimientoStockRequest {
  insumoId: number;
  tipoMovimiento: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  cantidad: number;
  costoUnitario?: number;
  motivo: string;
  documento?: string;
}
