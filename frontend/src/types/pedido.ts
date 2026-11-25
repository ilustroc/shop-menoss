// Estados acordados por el equipo (ver documento de ramas backend).
// En el backend serán el enum EstadoPedido: PENDIENTE, CONFIRMADO,
// PREPARANDO, ENTREGADO y CANCELADO.
export type EstadoPedido =
  | 'pendiente'
  | 'confirmado'
  | 'preparando'
  | 'entregado'
  | 'cancelado';

export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia';

export interface DetallePedido {
  productoId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}

export interface Pedido {
  id: string;
  fecha: string;
  estado: EstadoPedido;
  direccion: string;
  referencia?: string;
  metodoPago: MetodoPago;
  detalles: DetallePedido[];
  subtotal: number;
  envio: number;
  igv: number;
  total: number;
}

export interface DatosCompra {
  direccion: string;
  referencia?: string;
  metodoPago: MetodoPago;
}
