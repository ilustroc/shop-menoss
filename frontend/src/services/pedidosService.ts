import api from './api';
import { leerCarrito, vaciarCarrito } from './carritoService';
import type { CartItem } from '../types/producto';
import type {
  DatosCompra,
  EstadoPedido,
  MetodoPago,
  Pedido,
} from '../types/pedido';


export { calcularTotales } from './totales';

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

/** Corrige pedidos guardados con estados antiguos (ej. 'en_camino'). */
function normalizarEstado(estado?: string | null): EstadoPedido {
  if (!estado || estado.trim() === '') return 'pendiente';

  switch (estado.trim().toUpperCase()) {
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
    case 'EN_CAMINO':
      return 'preparando';
    default:
      return 'pendiente';
  }
}

interface PedidoBackend {
  id: number;
  fechaCreacion?: string | null;
  estado?: string | null;
  direccion: string;
  referencia?: string;
  metodoPago?: string | null;
  subtotal?: number | null;
  envio?: number | null;
  total?: number | null;
  detalles?: {
    productoId?: number | null;
    nombreProducto?: string | null;
    precioUnitario?: number | null;
    cantidad?: number | null;
  }[] | null;
}

function normalizarMetodoPago(metodoPago?: string | null): MetodoPago {
  if (!metodoPago || metodoPago.trim() === '') {
    throw new Error('Método de pago ausente en la respuesta del backend');
  }

  const metodoNormalizado = metodoPago.toLowerCase();
  if (
    metodoNormalizado === 'efectivo' ||
    metodoNormalizado === 'tarjeta' ||
    metodoNormalizado === 'transferencia'
  ) {
    return metodoNormalizado;
  }

  throw new Error(`Método de pago no soportado: ${metodoPago}`);
}

export function mapearPedidoBackend(pedido: PedidoBackend): Pedido {
  return {
    id: String(pedido.id),
    fecha: pedido.fechaCreacion ?? '',
    estado: normalizarEstado(pedido.estado),
    direccion: pedido.direccion,
    referencia: pedido.referencia,
    metodoPago: normalizarMetodoPago(pedido.metodoPago),
    detalles: (pedido.detalles ?? []).map((detalle) => ({
      productoId: detalle.productoId ?? 0,
      nombre: detalle.nombreProducto ?? '',
      precioUnitario: detalle.precioUnitario ?? 0,
      cantidad: detalle.cantidad ?? 0,
    })),
    subtotal: pedido.subtotal ?? 0,
    envio: pedido.envio ?? 0,
    igv: 0,
    total: pedido.total ?? 0,
  };
}

/** Devuelve el historial de pedidos, del más reciente al más antiguo. */
export async function getPedidos(): Promise<Pedido[]> { return (await api.get<PedidoBackend[]>('/pedidos')).data.map(mapearPedidoBackend); }
export async function getPedidoById(id:string): Promise<Pedido|undefined> { return mapearPedidoBackend((await api.get<PedidoBackend>('/pedidos/'+id)).data); }
/** Lee el carrito actual (reutiliza carritoService de feature/cart-ui). */
export function getCarritoActual(): CartItem[] {
  return leerCarrito();
}

/** Crea un nuevo pedido a partir del carrito actual y vacía el carrito. */
export async function crearPedido(datos: DatosCompra): Promise<Pedido> {
  const carrito = leerCarrito();

  if (carrito.length === 0) {
    throw new Error('El carrito está vacío.');
  }

  try {
    const { data } = await api.post<PedidoBackend>('/pedidos', {
      direccion: datos.direccion.trim(),
      referencia: datos.referencia?.trim() || undefined,
      metodoPago: datos.metodoPago.toUpperCase(),
      detalles: carrito.map((item) => ({
        productoId: item.id,
        cantidad: item.cantidad,
      })),
    });

    const pedido = mapearPedidoBackend(data);
    vaciarCarrito();
    return pedido;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
}

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
