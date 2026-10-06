import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { CartItem } from '../types/producto'
import { leerCarrito, vaciarCarrito } from '../services/carritoService'

const IGV_RATE = 0.18

type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia'

interface FormularioCheckout {
  direccion: string
  referencia: string
  metodoPago: MetodoPago
}

function CheckoutPage() {
  const navigate = useNavigate()

  const [items] = useState<CartItem[]>(() => leerCarrito())

  const [formulario, setFormulario] = useState<FormularioCheckout>({
    direccion: '',
    referencia: '',
    metodoPago: 'efectivo',
  })

  const [error, setError] = useState('')
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false)

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    )
  }, [items])

  const igv = subtotal * IGV_RATE
  const total = subtotal + igv

  const totalProductos = items.reduce(
    (totalActual, item) => totalActual + item.cantidad,
    0
  )

  const formatPrecio = (valor: number): string => {
    return `S/ ${valor.toFixed(2)}`
  }

  const actualizarCampo = (
    campo: keyof FormularioCheckout,
    valor: string
  ) => {
    setFormulario((estadoAnterior) => ({
      ...estadoAnterior,
      [campo]: valor,
    }))

    if (error) {
      setError('')
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formulario.direccion.trim()) {
      setError('Ingresa una dirección de entrega.')
      return
    }

    if (items.length === 0) {
      setError('No tienes productos en el carrito.')
      return
    }

    const pedidosGuardados = JSON.parse(
      localStorage.getItem('shop_menoss_orders') ?? '[]'
    )

    const nuevoPedido = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      estado: 'Pendiente',
      items,
      direccion: formulario.direccion.trim(),
      referencia: formulario.referencia.trim(),
      metodoPago: formulario.metodoPago,
      subtotal,
      igv,
      total,
    }

    localStorage.setItem(
      'shop_menoss_orders',
      JSON.stringify([...pedidosGuardados, nuevoPedido])
    )

    vaciarCarrito()
    setPedidoConfirmado(true)
  }

  if (items.length === 0 && !pedidoConfirmado) {
    return (
      <main className="container py-5">
        <div className="card shadow-sm text-center p-4 mx-auto">
          <h1 className="h4 text-primary mb-3">
            Tu carrito está vacío
          </h1>

          <p className="text-muted">
            Agrega productos antes de continuar con el pedido.
          </p>

          <Link to="/productos" className="btn btn-primary">
            Ver productos
          </Link>
        </div>
      </main>
    )
  }

  if (pedidoConfirmado) {
    return (
      <main className="container py-5">
        <div className="card shadow-sm text-center p-4 mx-auto">
          <h1 className="h4 text-success mb-3">
            Pedido confirmado correctamente
          </h1>

          <p className="text-muted">
            Tu pedido fue registrado y está pendiente de atención.
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/pedidos')}
          >
            Ver mis pedidos
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="container mt-4 mb-5">
      <h1 className="mb-4">Finalizar compra</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-md-7">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              Datos de envío y pago
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">
                    Dirección de entrega
                  </label>

                  <input
                    id="direccion"
                    type="text"
                    className="form-control"
                    placeholder="Calle, número, departamento..."
                    value={formulario.direccion}
                    onChange={(event) =>
                      actualizarCampo('direccion', event.target.value)
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="referencia" className="form-label">
                    Referencia
                  </label>

                  <input
                    id="referencia"
                    type="text"
                    className="form-control"
                    placeholder="Ej.: casa azul, portón negro"
                    value={formulario.referencia}
                    onChange={(event) =>
                      actualizarCampo('referencia', event.target.value)
                    }
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="metodoPago" className="form-label">
                    Método de pago
                  </label>

                  <select
                    id="metodoPago"
                    className="form-select"
                    value={formulario.metodoPago}
                    onChange={(event) =>
                      actualizarCampo('metodoPago', event.target.value)
                    }
                  >
                    <option value="efectivo">
                      Efectivo contra entrega
                    </option>

                    <option value="tarjeta">
                      Tarjeta de crédito o débito
                    </option>

                    <option value="transferencia">
                      Yape o Plin 
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 py-2"
                >
                  Confirmar pedido
                </button>

                <Link
                  to="/carrito"
                  className="btn btn-link w-100 mt-2"
                >
                  Volver al carrito
                </Link>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-5">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              Resumen del pedido
            </div>

            <div className="card-body">
              <ul className="list-group list-group-flush mb-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item px-0 d-flex justify-content-between gap-3"
                  >
                    <span>
                      {item.nombre} x{item.cantidad}
                    </span>

                    <span className="text-nowrap">
                      {formatPrecio(item.precio * item.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="d-flex justify-content-between mb-2">
                <span>Unidades:</span>
                <span>{totalProductos}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{formatPrecio(subtotal)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>IGV (18%):</span>
                <span>{formatPrecio(igv)}</span>
              </div>

              <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-3">
                <span>Total a pagar:</span>
                <span>{formatPrecio(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default CheckoutPage