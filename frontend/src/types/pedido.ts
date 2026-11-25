export type EstadoPedidoApi =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'PREPARANDO'
  | 'ENTREGADO'
  | 'CANCELADO';

export type MetodoPagoApi =
  | 'EFECTIVO'
  | 'TARJETA'
  | 'TRANSFERENCIA';

export interface CrearPedidoRequest {
  direccion: string;
  referencia?: string;
  metodoPago: MetodoPagoApi;
  detalles: DetallePedidoRequest[];
}

export interface DetallePedidoRequest {
  productoId: number;
  cantidad: number;
}

export interface DetallePedidoResponse {
  id: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoResponse {
  id: number;
  direccion: string;
  referencia: string | null;
  metodoPago: MetodoPagoApi;
  estado: EstadoPedidoApi;
  subtotal: number;
  envio: number;
  total: number;
  fechaCreacion: string;
  detalles: DetallePedidoResponse[];
}

export type EstadoPedido =
  | 'pendiente'
  | 'confirmado'
  | 'preparando'
  | 'entregado'
  | 'cancelado';

export type MetodoPago =
  | 'efectivo'
  | 'tarjeta'
  | 'transferencia';

export interface DetallePedido {
  id?: number;
  productoId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal?: number;
}

export interface Pedido {
  id: string;
  fecha: string;
  estado: EstadoPedido;
  direccion: string;
  referencia?: string;
  metodoPago: MetodoPago;
  tarjetaUltimos4?: string;
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