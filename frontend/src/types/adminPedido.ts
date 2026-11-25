import type { EstadoPedido, MetodoPago, Pedido } from './pedido';

/** Fila del listado administrativo (GET /api/admin/pedidos). */
export interface AdminPedidoResumen {
  id: string;
  fecha: string;
  estado: EstadoPedido;
  metodoPago: MetodoPago;
  direccion: string;
  cantidadProductos: number;
  total: number;
  estadosPermitidos: EstadoPedido[];
}

/** Detalle administrativo (GET /api/admin/pedidos/{id}). */
export interface AdminPedidoDetalle extends Pedido {
  /** Estados a los que el administrador puede mover el pedido. */
  estadosPermitidos: EstadoPedido[];
}