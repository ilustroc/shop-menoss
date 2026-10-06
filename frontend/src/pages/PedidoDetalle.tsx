import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import type { CartItem } from '../types/producto'

const ORDERS_STORAGE_KEY = 'shop_menoss_orders'

type EstadoPedido = 'Pendiente' | 'En camino' | 'Entregado' | 'Cancelado'

interface Pedido {
  id: number
  fecha: string
  estado: EstadoPedido
  items: CartItem[]
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

function PedidoDetalle() {
  const { id } = useParams<{ id: string }>()
  const [pedidos] = useState<Pedido[]>(() => leerPedidos())

  const pedido = pedidos.find((item) => String(item.id) === id)

  if (!pedido) {
    return (
      <main className="container py-5">
        <div className="card shadow-sm text-center p-5">
          <h1 className="h4 text-danger mb-3">
            Pedido no encontrado
          </h1>

          <p className="text-muted mb-4">
            No existe un pedido asociado al identificador solicitado.
          </p>

          <Link to="/pedidos" className="btn btn-primary">
            Volver a mis pedidos
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mt-4 mb-5">
      <Link to="/pedidos" className="btn btn-link mb-3 px-0">
        ← Volver a mis pedidos
      </Link>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h2 mb-1">
            Detalle del pedido #{pedido.id}
          </h1>

          <p className="text-muted mb-0">
            Registrado el {formatearFecha(pedido.fecha)}
          </p>
        </div>

        <span className={`badge fs-6 ${obtenerClaseEstado(pedido.estado)}`}>
          {pedido.estado}
        </span>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-light">
              Información de envío
            </div>

            <div className="card-body">
              <p className="mb-1">
                <strong>Dirección:</strong>
              </p>

              <p className="text-muted">
                {pedido.direccion}
              </p>

              {pedido.referencia && (
                <>
                  <p className="mb-1 mt-3">
                    <strong>Referencia:</strong>
                  </p>

                  <p className="text-muted">
                    {pedido.referencia}
                  </p>
                </>
              )}

              <p className="mb-1 mt-3">
                <strong>Método de pago:</strong>
              </p>

              <p className="text-muted text-capitalize">
                {pedido.metodoPago}
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              Productos del pedido
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-end">Precio</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pedido.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.nombre}</td>

                        <td className="text-center">
                          {item.cantidad}
                        </td>

                        <td className="text-end">
                          {formatearPrecio(item.precio)}
                        </td>

                        <td className="text-end">
                          {formatearPrecio(
                            item.precio * item.cantidad
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot className="table-group-divider">
                    <tr>
                      <th colSpan={3} className="text-end">
                        Subtotal:
                      </th>

                      <th className="text-end">
                        {formatearPrecio(pedido.subtotal)}
                      </th>
                    </tr>

                    <tr>
                      <th colSpan={3} className="text-end">
                        IGV:
                      </th>

                      <th className="text-end">
                        {formatearPrecio(pedido.igv)}
                      </th>
                    </tr>

                    <tr>
                      <th colSpan={3} className="text-end">
                        Total:
                      </th>

                      <th className="text-end fs-5">
                        {formatearPrecio(pedido.total)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PedidoDetalle