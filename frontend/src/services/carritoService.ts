const CART_KEY = 'shop_menoss_cart';

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export function agregarAlCarrito(producto: { id: number; nombre: string; precio: number }) {
  const carritoActual: CartItem[] = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

  const index = carritoActual.findIndex((item) => item.id === producto.id);

  if (index !== -1) {
    carritoActual[index].cantidad += 1;
  } else {
    carritoActual.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(carritoActual));
}