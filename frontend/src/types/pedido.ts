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
  /** Solo los últimos 4 dígitos de la tarjeta simulada (nunca el número completo). */
  tarjetaUltimos4?: string;
  detalles: DetallePedido[];
  subtotal: number;
  igv: number;
  total: number;
}

/** Datos de una tarjeta ficticia. Solo se validan en el formulario, no se guardan. */
export interface DatosTarjeta {
  titular: string;
  numero: string;
  vencimiento: string; // MM/AA
  cvv: string;
}

export interface DatosCompra {
  direccion: string;
  referencia?: string;
  metodoPago: MetodoPago;
  tarjeta?: DatosTarjeta;
}