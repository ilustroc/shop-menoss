import { useState } from 'react'
import { Link } from 'react-router-dom'

const ORDERS_STORAGE_KEY = 'shop_menoss_orders'

type EstadoPedido = 'Pendiente' | 'En camino' | 'Entregado' | 'Cancelado'

interface PedidoItem {
  id: number
  nombre: string
  precio: number
  cantidad: number
}

interface Pedido {
  id: number
  fecha: string
  estado: EstadoPedido
  items: PedidoItem[]
  direccion: string
  referencia?: string
  metodoPago: string
  subtotal: number
  igv: number
  total: number
}

function leerPedidos(): Pedido[] {
  try {
    const pedidosGuardados = localStorage.getItem(ORDERS_STORAGE_KEY)

    if (!pedidosGuardados) {
      return []
    }

    const pedidosParseados: unknown = JSON.parse(pedidosGuardados)

    return Array.isArray(pedidosParseados)
      ? (pedidosParseados as Pedido[])
      : []
  } catch {
    return []
  }
}

function formatearPrecio(valor: number): string {
  return `S/ ${valor.toFixed(2)}`
}

function formatearFecha(fecha: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fecha))
}

function obtenerClaseEstado(estado: EstadoPedido): string {
  switch (estado) {
    case 'Entregado':
      return 'bg-success'

    case 'En camino':
      return 'bg-warning text-dark'

    case 'Cancelado':
      return 'bg-danger'

    default:
      return 'bg-secondary'
  }
}

function Pedidos() {
  const [pedidos] = useState<Pedido[]>(() => leerPedidos())

  return (
    <main className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">Mis pedidos</h1>

          <p className="text-muted mb-0">
            Consulta el estado y el detalle de tus pedidos.
          </p>
        </div>

        <Link to="/productos" className="btn btn-primary">
          + Nuevo pedido
        </Link>
      </div>

      {pedidos.length === 0 ? (
        <div className="card shadow-sm text-center p-5">
          <h2 className="h5 text-primary">
            Todavía no tienes pedidos
          </h2>

          <p className="text-muted mb-4">
            Agrega productos al carrito y confirma tu primera compra.
          </p>

          <Link to="/productos" className="btn btn-primary">
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {pedidos
            .slice()
            .reverse()
            .map((pedido) => (
              <div className="col-12 col-md-6" key={pedido.id}>
                <article className="card shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                      <div>
                        <h2 className="h5 card-title mb-1">
                          Pedido #{pedido.id}
                        </h2>

                        <p className="card-text text-muted small mb-0">
                          {formatearFecha(pedido.fecha)}
                        </p>
                      </div>

                      <span className={`badge ${obtenerClaseEstado(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </div>

                    <p className="card-text mb-2">
                      <strong>Productos:</strong>{' '}
                      {pedido.items.reduce(
                        (total, item) => total + item.cantidad,
                        0
                      )}
                    </p>

                    <p className="card-text mb-3">
                      <strong>Total:</strong>{' '}
                      {formatearPrecio(pedido.total)}
                    </p>

                    <Link
                      to={`/pedidos/${pedido.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </article>
              </div>
            ))}
        </div>
      )}
    </main>
  )
}

export default Pedidos