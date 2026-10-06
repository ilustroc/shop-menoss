import type { CartItem } from '../types/producto'
import { PRODUCTOS_MOCK } from '../data/productosMock'

const CART_KEY = 'shop_menoss_cart'

export function leerCarrito(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY)

    if (!stored) {
      return []
    }

    const parsed: unknown = JSON.parse(stored)

    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

function guardarCarrito(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

function obtenerStockDisponible(id: number): number {
  const producto = PRODUCTOS_MOCK.find((item) => item.id === id)
  return producto?.stock ?? 0
}

export function agregarAlCarrito(producto: {
  id: number
  nombre: string
  precio: number
}): CartItem[] {
  const carrito = leerCarrito()
  const productoOriginal = PRODUCTOS_MOCK.find(
    (item) => item.id === producto.id
  )

  if (!productoOriginal || productoOriginal.stock <= 0) {
    return carrito
  }

  const productoExistente = carrito.find(
    (item) => item.id === producto.id
  )

  if (productoExistente) {
    if (productoExistente.cantidad >= productoOriginal.stock) {
      return carrito
    }

    const carritoActualizado = carrito.map((item) =>
      item.id === producto.id
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    )

    guardarCarrito(carritoActualizado)
    return carritoActualizado
  }

  const carritoActualizado: CartItem[] = [
    ...carrito,
    {
      id: productoOriginal.id,
      nombre: productoOriginal.nombre,
      precio: productoOriginal.precio,
      cantidad: 1,
    },
  ]

  guardarCarrito(carritoActualizado)
  return carritoActualizado
}

export function aumentarCantidad(id: number): CartItem[] {
  const carrito = leerCarrito()
  const stockDisponible = obtenerStockDisponible(id)
  const productoActual = carrito.find((item) => item.id === id)

  if (!productoActual || productoActual.cantidad >= stockDisponible) {
    return carrito
  }

  const carritoActualizado = carrito.map((item) =>
    item.id === id
      ? { ...item, cantidad: item.cantidad + 1 }
      : item
  )

  guardarCarrito(carritoActualizado)
  return carritoActualizado
}

export function disminuirCantidad(id: number): CartItem[] {
  const carritoActualizado = leerCarrito().map((item) =>
    item.id === id && item.cantidad > 1
      ? { ...item, cantidad: item.cantidad - 1 }
      : item
  )

  guardarCarrito(carritoActualizado)
  return carritoActualizado
}

export function eliminarDelCarrito(id: number): CartItem[] {
  const carritoActualizado = leerCarrito().filter(
    (item) => item.id !== id
  )

  guardarCarrito(carritoActualizado)
  return carritoActualizado
}

export function vaciarCarrito(): CartItem[] {
  guardarCarrito([])
  return []
}

export function obtenerStock(id: number): number {
  return obtenerStockDisponible(id)
}