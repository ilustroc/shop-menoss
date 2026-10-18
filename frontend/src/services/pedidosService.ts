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
// import api from './api'

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

function generarId(existentes: Pedido[]): string {
  let id: string;
  do {
    id = `${Math.floor(1000 + Math.random() * 9000)}`;
  } while (existentes.some((p) => p.id === id));
  return id;
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
    },
    {
      id: '1025',
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      estado: 'preparando',
      direccion: 'Jr. Los Olivos 456',
      metodoPago: 'efectivo',
      detalles: detallesPedido1025,
      ...totalesDeDetalles(detallesPedido1025),
    },
  ];
}

const ESTADOS_VALIDOS = Object.keys(ESTADO_LABELS) as EstadoPedido[];

/** Corrige pedidos guardados con estados antiguos (ej. 'en_camino'). */
function normalizarEstado(estado: string): EstadoPedido {
  if (estado === 'en_camino') return 'preparando';
  return ESTADOS_VALIDOS.includes(estado as EstadoPedido)
    ? (estado as EstadoPedido)
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

function guardarPedidos(pedidos: Pedido[]) {
  try {
    localStorage.setItem(PEDIDOS_STORAGE_KEY, JSON.stringify(pedidos));
  } catch (error) {
    console.error('Error al guardar pedidos en localStorage:', error);
  }
}

/** Devuelve el historial de pedidos, del más reciente al más antiguo. */
export function getPedidos(): Pedido[] {
  return [...leerPedidos()].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

/** Busca un pedido por id. Devuelve undefined si no existe. */
export function getPedidoById(id: string): Pedido | undefined {
  return leerPedidos().find((pedido) => pedido.id === id);
}

/** Lee el carrito actual (reutiliza carritoService de feature/cart-ui). */
export function getCarritoActual(): CartItem[] {
  return leerCarrito();
}

/** Crea un nuevo pedido a partir del carrito actual y vacía el carrito. */
export function crearPedido(datos: DatosCompra): Pedido {
  const carrito = leerCarrito();

  if (carrito.length === 0) {
    throw new Error('El carrito está vacío.');
  }

  const detalles: DetallePedido[] = carrito.map((item) => ({
    productoId: item.id,
    nombre: item.nombre,
    precioUnitario: item.precio,
    cantidad: item.cantidad,
  }));

  const pedidos = leerPedidos();

  const nuevoPedido: Pedido = {
    id: generarId(pedidos),
    fecha: new Date().toISOString(),
    // Todo pedido nace PENDIENTE; el administrador lo confirma (feature/admin-pedidos).
    estado: 'pendiente',
    direccion: datos.direccion.trim(),
    referencia: datos.referencia?.trim() || undefined,
    metodoPago: datos.metodoPago,
    tarjetaUltimos4:
      datos.metodoPago === 'tarjeta' && datos.tarjeta
        ? datos.tarjeta.numero.replace(/\D/g, '').slice(-4)
        : undefined,
    detalles,
    ...totalesDeDetalles(detalles),
  };

  pedidos.push(nuevoPedido);
  guardarPedidos(pedidos);
  vaciarCarrito();

  return nuevoPedido;
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