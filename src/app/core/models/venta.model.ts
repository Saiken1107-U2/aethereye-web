export interface Venta {
  id: number;
  fecha: string;
  total: number;
  estado: string;
}

export interface DetalleCompra {
  id: number;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CompraDetallada {
  compra: {
    id: number;
    fecha: string;
    total: number;
    cliente: string;
  };
  detalles: DetalleCompra[];
}