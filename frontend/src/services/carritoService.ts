import type { CartItem } from '../types/producto';

const CART_KEY = 'shop_menoss_cart';

export function leerCarrito(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function guardarCarrito(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function agregarAlCarrito(producto: { id: number; nombre: string; precio: number }): CartItem[] {
  const carrito = leerCarrito();
  const index = carrito.findIndex((item) => item.id === producto.id);

  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
  }

  guardarCarrito(carrito);
  return carrito;
}

export function aumentarCantidad(id: number): CartItem[] {
  const carrito = leerCarrito().map((item) =>
    item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
  );
  guardarCarrito(carrito);
  return carrito;
}

export function disminuirCantidad(id: number): CartItem[] {
  const carrito = leerCarrito().map((item) =>
    item.id === id && item.cantidad > 1 ? { ...item, cantidad: item.cantidad - 1 } : item
  );
  guardarCarrito(carrito);
  return carrito;
}

export function eliminarDelCarrito(id: number): CartItem[] {
  const carrito = leerCarrito().filter((item) => item.id !== id);
  guardarCarrito(carrito);
  return carrito;
}

export function vaciarCarrito(): CartItem[] {
  guardarCarrito([]);
  return [];
}