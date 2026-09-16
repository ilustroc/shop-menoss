<<<<<<< Updated upstream
=======
// src/types/pedido.ts
// Tipos del módulo de pedidos (feature/orders-ui).
// Estos tipos son la forma "ideal" del pedido pensando en el futuro
// contrato del backend (Order / OrderItem). Mientras esos endpoints
// no existan, el módulo trabaja con datos ficticios guardados en
// localStorage (ver services/pedidosService.ts).

>>>>>>> Stashed changes
export type EstadoPedido =
  | 'pendiente'
  | 'confirmado'
  | 'en_camino'
  | 'entregado'
  | 'cancelado'

export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia'

export interface PedidoItem {
  productoId: number
  nombre: string
  precioUnitario: number
  cantidad: number
}

export interface Pedido {
  id: string
<<<<<<< Updated upstream
  fecha: string 
=======
  fecha: string // ISO string
>>>>>>> Stashed changes
  estado: EstadoPedido
  direccion: string
  referencia?: string
  metodoPago: MetodoPago
  items: PedidoItem[]
  subtotal: number
  igv: number
  total: number
}

<<<<<<< Updated upstream

=======
// Datos que se piden en el formulario de checkout.
>>>>>>> Stashed changes
export interface DatosCompra {
  direccion: string
  referencia?: string
  metodoPago: MetodoPago
}
