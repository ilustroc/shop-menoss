import type { CartItem, Producto } from '../types/producto'

const CART_KEY = 'shop_menoss_cart'

function esCartItem(item: unknown): item is CartItem {
  if (typeof item !== 'object' || item === null) {
    return false
  }

  const candidato = item as Record<string, unknown>

  return (
    Number.isSafeInteger(candidato.id) &&
    (candidato.id as number) > 0 &&
    typeof candidato.nombre === 'string' &&
    typeof candidato.precio === 'number' &&
    Number.isFinite(candidato.precio) &&
    candidato.precio >= 0 &&
    Number.isSafeInteger(candidato.cantidad) &&
    (candidato.cantidad as number) > 0
  )
}

export function leerCarrito(): CartItem[] {
  const stored = localStorage.getItem(CART_KEY)

  if (!stored) {
    return []
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(stored)
  } catch {
    throw new Error('El carrito guardado no se pudo leer. Vacíalo y vuelve a agregar los productos.')
  }

  if (!Array.isArray(parsed) || !parsed.every(esCartItem)) {
    throw new Error('El carrito guardado contiene datos inválidos. Vacíalo y vuelve a agregar los productos.')
  }

  return parsed
}

function guardarCarrito(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function agregarAlCarrito(producto: Producto): CartItem[] {
  if (!Number.isSafeInteger(producto.id) || producto.id <= 0) {
    throw new Error('El producto no tiene un identificador válido.')
  }

  if (!Number.isSafeInteger(producto.stock) || producto.stock <= 0) {
    throw new Error(`No hay stock disponible de ${producto.nombre}.`)
  }

  const carrito = leerCarrito()
  const productoExistente = carrito.find((item) => item.id === producto.id)

  if (productoExistente) {
    if (productoExistente.cantidad >= producto.stock) {
      throw new Error(`No hay más stock disponible de ${producto.nombre}.`)
    }

    const carritoActualizado = carrito.map((item) =>
      item.id === producto.id
        ? {
            ...item,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: item.cantidad + 1,
          }
        : item
    )

    guardarCarrito(carritoActualizado)
    return carritoActualizado
  }

  const carritoActualizado = [
    ...carrito,
    {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
    },
  ]

  guardarCarrito(carritoActualizado)
  return carritoActualizado
}

export function aumentarCantidad(id: number, stockDisponible: number): CartItem[] {
  const carrito = leerCarrito()
  const item = carrito.find((cartItem) => cartItem.id === id)

  if (!item) {
    throw new Error('El producto ya no está en el carrito.')
  }

  if (!Number.isSafeInteger(stockDisponible) || stockDisponible < 0) {
    throw new Error('No se pudo verificar el stock disponible.')
  }

  if (item.cantidad >= stockDisponible) {
    throw new Error(`Solo hay ${stockDisponible} unidades disponibles de ${item.nombre}.`)
  }

  const carritoActualizado = carrito.map((cartItem) =>
    cartItem.id === id
      ? { ...cartItem, cantidad: cartItem.cantidad + 1 }
      : cartItem
  )

  guardarCarrito(carritoActualizado)
  return carritoActualizado
}

export function sincronizarCarritoConProductos(productos: Producto[]): CartItem[] {
  const carrito = leerCarrito()
  const productosPorId = new Map(productos.map((producto) => [producto.id, producto]))
  let cambio = false

  const carritoActualizado = carrito.map((item) => {
    const producto = productosPorId.get(item.id)

    if (!producto || (item.nombre === producto.nombre && item.precio === producto.precio)) {
      return item
    }

    cambio = true
    return { ...item, nombre: producto.nombre, precio: producto.precio }
  })

  if (cambio) {
    guardarCarrito(carritoActualizado)
  }

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