import type { CartItem } from '../types/producto'

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

export function agregarAlCarrito(producto: {
  id: number
  nombre: string
  precio: number
  stock: number
}): CartItem[] {
  const carrito = leerCarrito()
  const productoExistente = carrito.find((item) => item.id === producto.id)

  if ((productoExistente?.cantidad || 0) >= producto.stock) throw new Error('No hay stock suficiente');
  let carritoActualizado: CartItem[]

  if (productoExistente) {
    carritoActualizado = carrito.map((item) =>
      item.id === producto.id
        ? { ...item, cantidad: item.cantidad + 1, precio: producto.precio, stock: producto.stock }
        : item
    )
  } else {
    carritoActualizado = [
      ...carrito,
      {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        stock: producto.stock,
      },
    ]
  }

  guardarCarrito(carritoActualizado)
  return carritoActualizado
}

export function aumentarCantidad(id: number): CartItem[] {
  const actual = leerCarrito().find(i=>i.id===id);
  if (actual && actual.cantidad >= (actual.stock ?? 0)) throw new Error('Revisa el stock en el catálogo antes de aumentar');
  const carritoActualizado = leerCarrito().map((item) =>
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
