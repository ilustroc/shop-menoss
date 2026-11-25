import axios from 'axios';
import api from './api';
import { leerCarrito, vaciarCarrito } from './carritoService';
import type { CartItem } from '../types/producto';
import type {
  CrearPedidoRequest,
  DatosCompra,
  EstadoPedidoApi,
  EstadoPedido,
  MetodoPago,
  MetodoPagoApi,
  Pedido,
  PedidoResponse,
} from '../types/pedido';

export const ESTADO_LABELS: Record<EstadoPedido, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  preparando: 'Preparando',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export const ESTADO_BADGE_CLASS: Record<EstadoPedido, string> = {
  pendiente: 'bg-secondary',
  confirmado: 'bg-info text-dark',
  preparando: 'bg-warning text-dark',
  entregado: 'bg-success',
  cancelado: 'bg-danger',
};

export const ESTADO_DESCRIPCION: Record<EstadoPedido, string> = {
  pendiente: 'Recibimos tu pedido y está esperando la confirmación de la tienda.',
  confirmado: 'La tienda confirmó tu pedido.',
  preparando: 'Estamos preparando tus productos.',
  entregado: 'Tu pedido fue entregado. ¡Gracias por comprar en Shop Menoss!',
  cancelado: 'Este pedido fue cancelado.',
};

/** Pasos del flujo normal que se muestran en el detalle (cancelado va aparte). */
export const PASOS_ESTADO: EstadoPedido[] = [
  'pendiente',
  'confirmado',
  'preparando',
  'entregado',
];

export const METODO_PAGO_LABELS: Record<MetodoPago, string> = {
  efectivo: 'Efectivo contra entrega',
  tarjeta: 'Tarjeta de crédito / débito',
  transferencia: 'Transferencia bancaria',
};

function normalizarEstado(estado: EstadoPedidoApi): EstadoPedido {
  switch (estado) {
    case 'PENDIENTE':
      return 'pendiente';
    case 'CONFIRMADO':
      return 'confirmado';
    case 'PREPARANDO':
      return 'preparando';
    case 'ENTREGADO':
      return 'entregado';
    case 'CANCELADO':
      return 'cancelado';
    default:
      throw new Error(`Estado de pedido no soportado: ${estado}`);
  }
}

const METODOS_PAGO_API: Record<MetodoPago, MetodoPagoApi> = {
  efectivo: 'EFECTIVO',
  tarjeta: 'TARJETA',
  transferencia: 'TRANSFERENCIA',
};

function normalizarMetodoPago(metodoPago: MetodoPagoApi): MetodoPago {
  switch (metodoPago) {
    case 'EFECTIVO':
      return 'efectivo';
    case 'TARJETA':
      return 'tarjeta';
    case 'TRANSFERENCIA':
      return 'transferencia';
    default:
      throw new Error(`Método de pago no soportado: ${metodoPago}`);
  }
}

export function mapearPedidoBackend(pedido: PedidoResponse): Pedido {
  return {
    id: String(pedido.id),
    fecha: pedido.fechaCreacion,
    estado: normalizarEstado(pedido.estado),
    direccion: pedido.direccion,
    referencia: pedido.referencia ?? undefined,
    metodoPago: normalizarMetodoPago(pedido.metodoPago),
    detalles: pedido.detalles.map((detalle) => ({
      id: detalle.id,
      productoId: detalle.productoId,
      nombre: detalle.nombreProducto,
      precioUnitario: detalle.precioUnitario,
      cantidad: detalle.cantidad,
      subtotal: detalle.subtotal,
    })),
    subtotal: pedido.subtotal,
    envio: pedido.envio,
    igv: 0,
    total: pedido.total,
  };
}

export async function listarPedidos(): Promise<Pedido[]> {
  const { data } = await api.get<PedidoResponse[]>('/pedidos');
  return data
    .map(mapearPedidoBackend)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export async function obtenerPedidoPorId(id: string): Promise<Pedido | undefined> {
  try {
    const { data } = await api.get<PedidoResponse>(`/pedidos/${id}`);
    return mapearPedidoBackend(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return undefined;
    }

    throw error;
  }
}

export function getCarritoActual(): CartItem[] {
  return leerCarrito();
}

export async function crearPedido(datos: DatosCompra): Promise<Pedido> {
  const carrito = leerCarrito();

  if (carrito.length === 0) {
    throw new Error('El carrito está vacío.');
  }

  const request: CrearPedidoRequest = {
    direccion: datos.direccion.trim(),
    ...(datos.referencia?.trim()
      ? { referencia: datos.referencia.trim() }
      : {}),
    metodoPago: METODOS_PAGO_API[datos.metodoPago],
    detalles: carrito.map((item) => ({
      productoId: item.id,
      cantidad: item.cantidad,
    })),
  };
  const { data } = await api.post<PedidoResponse>('/pedidos', request);
  const pedido = mapearPedidoBackend(data);
  vaciarCarrito();
  return pedido;
}

export { listarPedidos as getPedidos, obtenerPedidoPorId as getPedidoById };

export function formatPrecio(valor: number): string {
  return `S/ ${valor.toFixed(2)}`;
}

export function formatFecha(fechaIso: string): string {
  return new Date(fechaIso).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}