// src/services/pedidosService.ts
//
// Módulo: feature/orders-ui (Integrante 4)
//
// El backend todavía no expone los endpoints de pedidos (Pedido.java y
// DetallePedido.java aún no están implementados), así que este servicio
// simula el historial con localStorage y datos ficticios.
//
// Cuando feature/pedidos tenga listo /api/pedidos, esta es la única capa
// que debería cambiar: reemplazar las funciones internas por llamadas con
// `api` (ver services/api.ts) manteniendo la misma firma pública
// (getPedidos, getPedidoById, crearPedido) para no tocar las páginas.
//
//   GET  /api/pedidos       -> getPedidos()
//   GET  /api/pedidos/{id}  -> getPedidoById(id)
//   POST /api/pedidos       -> crearPedido(datos)
//
import api from './api';
import { leerCarrito, vaciarCarrito } from './carritoService';
import type { CartItem } from '../types/producto';
import type {
  DatosCompra,
  DetallePedido,
  EstadoPedido,
  MetodoPago,
  Pedido,
} from '../types/pedido';

const PEDIDOS_STORAGE_KEY = 'shop_menoss_pedidos';
export const IGV_RATE = 0.18;

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

export function calcularTotales(
  items: { precio: number; cantidad: number }[]
) {
  const subtotal = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const igv = subtotal * IGV_RATE;
  const total = subtotal + igv;

  return { subtotal, igv, total };
}

function totalesDeDetalles(detalles: DetallePedido[]) {
  return calcularTotales(
    detalles.map((d) => ({ precio: d.precioUnitario, cantidad: d.cantidad }))
  );
}

// Datos ficticios iniciales
function pedidosFicticios(): Pedido[] {
  const detallesPedido1024: DetallePedido[] = [
    { productoId: 1, nombre: 'Arroz Extra 1 kg', precioUnitario: 4.8, cantidad: 3 },
    { productoId: 2, nombre: 'Aceite Vegetal 1 L', precioUnitario: 8.5, cantidad: 2 },
    { productoId: 3, nombre: 'Leche Evaporada', precioUnitario: 3.9, cantidad: 6 },
  ];

  const detallesPedido1025: DetallePedido[] = [
    { productoId: 4, nombre: 'Pan Francés (kg)', precioUnitario: 2.0, cantidad: 1 },
    { productoId: 5, nombre: 'Manzanas Rojas (kg)', precioUnitario: 4.5, cantidad: 3 },
  ];

  return [
    {
      id: '1024',
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      estado: 'entregado',
      direccion: 'Av. Siempre Viva 123, Depto 4B',
      referencia: 'Casa azul, portón negro',
      metodoPago: 'tarjeta',
      tarjetaUltimos4: '4242',
      detalles: detallesPedido1024,
      ...totalesDeDetalles(detallesPedido1024),
      envio: 0,
    },
    {
      id: '1025',
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      estado: 'preparando',
      direccion: 'Jr. Los Olivos 456',
      metodoPago: 'efectivo',
      detalles: detallesPedido1025,
      ...totalesDeDetalles(detallesPedido1025),
      envio: 0,
    },
  ];
}

const ESTADOS_VALIDOS = Object.keys(ESTADO_LABELS) as EstadoPedido[];

/** Corrige pedidos guardados con estados antiguos (ej. 'en_camino'). */
function normalizarEstado(estado: string): EstadoPedido {
  const estadoNormalizado = estado.toLowerCase();
  if (estadoNormalizado === 'en_camino') return 'preparando';
  return ESTADOS_VALIDOS.includes(estadoNormalizado as EstadoPedido)
    ? (estadoNormalizado as EstadoPedido)
    : 'pendiente';
}

function leerPedidos(): Pedido[] {
  try {
    const stored = localStorage.getItem(PEDIDOS_STORAGE_KEY);
    if (stored !== null) {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return (parsed as Pedido[]).map((p) => ({
          ...p,
          estado: normalizarEstado(p.estado),
        }));
      }
    }
    const iniciales = pedidosFicticios();
    localStorage.setItem(PEDIDOS_STORAGE_KEY, JSON.stringify(iniciales));
    return iniciales;
  } catch {
    return pedidosFicticios();
  }
}

interface PedidoBackend {
  id: number;
  fechaCreacion: string;
  estado: string;
  direccion: string;
  referencia?: string;
  metodoPago: string;
  subtotal: number;
  envio: number;
  total: number;
  detalles: {
    productoId: number;
    nombreProducto: string;
    precioUnitario: number;
    cantidad: number;
  }[];
}

function normalizarMetodoPago(metodoPago: string): MetodoPago {
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
    fecha: pedido.fechaCreacion,
    estado: normalizarEstado(pedido.estado),
    direccion: pedido.direccion,
    referencia: pedido.referencia,
    metodoPago: normalizarMetodoPago(pedido.metodoPago),
    detalles: pedido.detalles.map((detalle) => ({
      productoId: detalle.productoId,
      nombre: detalle.nombreProducto,
      precioUnitario: detalle.precioUnitario,
      cantidad: detalle.cantidad,
    })),
    subtotal: pedido.subtotal,
    envio: pedido.envio,
    igv: 0,
    total: pedido.total,
  };
}

/** Devuelve el historial de pedidos, del más reciente al más antiguo. */
export async function getPedidos(): Promise<Pedido[]> {
  try {
    const { data } = await api.get<PedidoBackend[]>('/pedidos');
    return data
      .map(mapearPedidoBackend)
      .sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return leerPedidos();
  }
}

/** Busca un pedido por id. Devuelve undefined si no existe. */
function getPedidoByIdLocal(id: string): Pedido | undefined {
  return leerPedidos().find((pedido) => pedido.id === id);
}

export async function getPedidoById(id: string): Promise<Pedido | undefined> {
  try {
    const { data } = await api.get<PedidoBackend>(`/pedidos/${id}`);
    return mapearPedidoBackend(data);
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    return getPedidoByIdLocal(id);
  }
}

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