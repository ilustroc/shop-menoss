import type { DatosCompra, Pedido, PedidoItem, EstadoPedido } from '../types/pedido'

const PEDIDOS_STORAGE_KEY = 'shop_menoss_pedidos'
const IGV_RATE = 0.18

const CART_STORAGE_KEY = 'shop_menoss_cart'

interface CartItemCompartido {
  id: number
  nombre: string
  precio: number
  cantidad: number
}

export const ESTADO_LABELS: Record<EstadoPedido, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  en_camino: 'En camino',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

export const ESTADO_BADGE_CLASS: Record<EstadoPedido, string> = {
  pendiente: 'bg-secondary',
  confirmado: 'bg-info text-dark',
  en_camino: 'bg-warning text-dark',
  entregado: 'bg-success',
  cancelado: 'bg-danger',
}

export const PASOS_ESTADO: EstadoPedido[] = [
  'pendiente',
  'confirmado',
  'en_camino',
  'entregado',
]

function calcularTotales(items: PedidoItem[]) {
  const subtotal = items.reduce(
    (acc, item) => acc + item.precioUnitario * item.cantidad,
    0
  )
  const igv = subtotal * IGV_RATE
  const total = subtotal + igv

  return { subtotal, igv, total }
}

function generarId(): string {
  const numero = Math.floor(1000 + Math.random() * 9000)
  return `${numero}`
}

function pedidosFicticios(): Pedido[] {
  const itemsPedido1024: PedidoItem[] = [
    { productoId: 1, nombre: 'Arroz Extra 1 kg', precioUnitario: 4.8, cantidad: 3 },
    { productoId: 2, nombre: 'Aceite Vegetal 1 L', precioUnitario: 8.5, cantidad: 2 },
    { productoId: 3, nombre: 'Leche Evaporada', precioUnitario: 3.9, cantidad: 6 },
  ]

  const itemsPedido1025: PedidoItem[] = [
    { productoId: 4, nombre: 'Pan Francés (kg)', precioUnitario: 2.0, cantidad: 1 },
    { productoId: 5, nombre: 'Manzanas Rojas (kg)', precioUnitario: 4.5, cantidad: 3 },
  ]

  return [
    {
      id: '1024',
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      estado: 'entregado',
      direccion: 'Av. Siempre Viva 123, Depto 4B',
      referencia: 'Casa azul, portón negro',
      metodoPago: 'tarjeta',
      items: itemsPedido1024,
      ...calcularTotales(itemsPedido1024),
    },
    {
      id: '1025',
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      estado: 'en_camino',
      direccion: 'Jr. Los Olivos 456',
      metodoPago: 'efectivo',
      items: itemsPedido1025,
      ...calcularTotales(itemsPedido1025),
    },
  ]
}

function leerPedidos(): Pedido[] {
  try {
    const stored = localStorage.getItem(PEDIDOS_STORAGE_KEY)

    if (stored !== null) {
      const parsed = JSON.parse(stored)

      if (Array.isArray(parsed)) {
        return parsed as Pedido[]
      }
    }

    const iniciales = pedidosFicticios()
    localStorage.setItem(PEDIDOS_STORAGE_KEY, JSON.stringify(iniciales))
    return iniciales
  } catch {
    return pedidosFicticios()
  }
}

function guardarPedidos(pedidos: Pedido[]) {
  try {
    localStorage.setItem(PEDIDOS_STORAGE_KEY, JSON.stringify(pedidos))
  } catch (error) {
    console.error('Error al guardar pedidos en localStorage:', error)
  }
}
export function getPedidos(): Pedido[] {
  return [...leerPedidos()].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )
}
export function getPedidoById(id: string): Pedido | undefined {
  return leerPedidos().find((pedido) => pedido.id === id)
}

export function getCarritoActual(): CartItemCompartido[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? (parsed as CartItemCompartido[]) : []
  } catch {
    return []
  }
}

function vaciarCarrito() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]))
  } catch (error) {
    console.error('Error al vaciar el carrito:', error)
  }
}

export function crearPedido(datos: DatosCompra): Pedido {
  const carrito = getCarritoActual()

  const items: PedidoItem[] = carrito.map((item) => ({
    productoId: item.id,
    nombre: item.nombre,
    precioUnitario: item.precio,
    cantidad: item.cantidad,
  }))

  const nuevoPedido: Pedido = {
    id: generarId(),
    fecha: new Date().toISOString(),
    estado: 'confirmado',
    direccion: datos.direccion,
    referencia: datos.referencia,
    metodoPago: datos.metodoPago,
    items,
    ...calcularTotales(items),
  }

  const pedidos = leerPedidos()
  pedidos.push(nuevoPedido)
  guardarPedidos(pedidos)
  vaciarCarrito()

  return nuevoPedido
}

export function formatPrecio(valor: number): string {
  return `S/ ${valor.toFixed(2)}`
}

export function formatFecha(fechaIso: string): string {
  return new Date(fechaIso).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
