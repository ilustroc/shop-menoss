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
  fecha: string 
  estado: EstadoPedido
  direccion: string
  referencia?: string
  metodoPago: MetodoPago
  items: PedidoItem[]
  subtotal: number
  igv: number
  total: number
}


export interface DatosCompra {
  direccion: string
  referencia?: string
  metodoPago: MetodoPago
}
