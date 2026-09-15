// src/pages/Carrito.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface CartItem {
  id: number
  nombre: string
  precio: number
  cantidad: number
}

const CART_STORAGE_KEY = 'shop_menoss_cart'
const IGV_RATE = 0.18

const INITIAL_PRODUCTS: CartItem[] = [
  { id: 1, nombre: 'Arroz Extra 1 kg', precio: 4.8, cantidad: 2 },
  { id: 2, nombre: 'Aceite Vegetal 1 L', precio: 8.5, cantidad: 1 },
  { id: 3, nombre: 'Leche Evaporada', precio: 3.9, cantidad: 3 },
]

function Carrito() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)

      if (stored !== null) {
        const parsed = JSON.parse(stored)

        if (Array.isArray(parsed)) {
          return parsed as CartItem[]
        }
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS))
      return INITIAL_PRODUCTS
    } catch {
      return INITIAL_PRODUCTS
    }
  })

  const updateCart = (newItems: CartItem[]) => {
    setItems(newItems)

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems))
    } catch (error) {
      console.error('Error al guardar en localStorage:', error)
    }
  }

  const handleAumentar = (id: number) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
    )

    updateCart(updated)
  }

  const handleDisminuir = (id: number) => {
    const updated = items.map((item) => {
      if (item.id === id && item.cantidad > 1) {
        return { ...item, cantidad: item.cantidad - 1 }
      }

      return item
    })

    updateCart(updated)
  }

  const handleEliminar = (id: number) => {
    const updated = items.filter((item) => item.id !== id)
    updateCart(updated)
  }

  const handleVaciarCarrito = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
      updateCart([])
    }
  }

  const formatPrecio = (valor: number): string => {
    return `S/ ${valor.toFixed(2)}`
  }

  const subtotalProductos = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  )

  const igv = subtotalProductos * IGV_RATE
  const totalFinal = subtotalProductos + igv

  const totalProductos = items.reduce(
    (acc, item) => acc + item.cantidad,
    0
  )

  if (items.length === 0) {
    return (
      <main className="container py-5" id="carrito-vacio-vista">
        <div
          className="card border-0 shadow-sm mx-auto p-4 p-md-5 text-center bg-white"
          style={{ maxWidth: '580px', borderRadius: '12px' }}
          id="contenedor-mensaje-vacio"
        >
          <div className="d-flex justify-content-center mb-3">
            <img
              src="/images/products/logo_menoss.jpeg"
              alt="Logo de Shop Menoss"
              className="rounded"
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'contain',
              }}
            />
          </div>

          <span
            className="badge mx-auto mb-3 px-3 py-2 fw-semibold"
            style={{
              backgroundColor: '#fff3cd',
              color: '#664d03',
              fontSize: '0.85rem',
              width: 'fit-content',
            }}
          >
            Abarrotes y Despensa
          </span>

          <h1 className="h4 fw-bold text-primary mb-2">
            Tu carrito está vacío
          </h1>

          <p className="text-secondary mb-4 small">
            No tienes productos seleccionados en este momento. Revisa nuestro
            catálogo y añade lo que necesites para tu hogar.
          </p>

          <Link
            to="/productos"
            className="btn btn-primary px-4 py-2 fw-medium shadow-sm"
          >
            Explorar productos
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container py-4 py-md-5" id="carrito-vista-principal">
      <div className="bg-white border rounded-3 p-3 p-md-4 mb-4 shadow-sm">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <h1 className="h3 fw-bold text-primary mb-0">
                Carrito de compras
              </h1>

              <span
                className="badge fw-normal"
                style={{
                  backgroundColor: '#fff3cd',
                  color: '#664d03',
                  border: '1px solid #ffe69c',
                }}
              >
                {totalProductos}{' '}
                {totalProductos === 1 ? 'artículo' : 'artículos'}
              </span>
            </div>

            <p className="text-muted small mb-0">
              Gestiona las cantidades y revisa el resumen estimado de tus abarrotes
            </p>
          </div>

          <div className="d-flex align-items-center justify-content-between gap-3 align-self-stretch align-self-md-auto">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={handleVaciarCarrito}
            >
              Vaciar carrito
            </button>

            <img
              src="/images/products/logo_menoss.jpeg"
              alt="Logo de Shop Menoss"
              className="rounded border"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'contain',
                backgroundColor: '#f8f9fa',
                padding: '6px',
              }}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border shadow-sm bg-white overflow-hidden rounded-3">
            <div className="card-header bg-light border-bottom py-3 px-3 px-md-4 d-flex justify-content-between align-items-center">
              <span className="fw-semibold text-secondary small text-uppercase">
                Productos en tu canasta
              </span>

              <span className="text-muted small">
                {items.length}{' '}
                {items.length === 1
                  ? 'producto distinto'
                  : 'productos distintos'}
              </span>
            </div>

            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead style={{ backgroundColor: '#fdfdfe' }}>
                  <tr className="border-bottom">
                    <th className="ps-3 ps-md-4 py-3 text-secondary small fw-semibold">
                      Producto
                    </th>

                    <th className="text-center py-3 text-secondary small fw-semibold">
                      Unitario
                    </th>

                    <th className="text-center py-3 text-secondary small fw-semibold">
                      Cantidad
                    </th>

                    <th className="text-end py-3 text-secondary small fw-semibold">
                      Subtotal
                    </th>

                    <th className="text-center pe-3 pe-md-4 py-3 text-secondary small fw-semibold">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => {
                    const subtotal = item.precio * item.cantidad

                    return (
                      <tr key={item.id}>
                        <td className="ps-3 ps-md-4 py-3">
                          <span className="fw-semibold text-dark d-block">
                            {item.nombre}
                          </span>

                          <span className="text-muted small">
                            Abarrotes Menoss
                          </span>
                        </td>

                        <td className="text-center text-muted small py-3">
                          {formatPrecio(item.precio)}
                        </td>

                        <td className="text-center py-3 text-nowrap">
                          <div
                            className="btn-group btn-group-sm border rounded-2"
                            role="group"
                            aria-label={`Control de cantidad para ${item.nombre}`}
                            style={{ overflow: 'hidden' }}
                          >
                            <button
                              type="button"
                              className="btn btn-light border-0 px-2 fw-bold text-primary"
                              onClick={() => handleDisminuir(item.id)}
                              disabled={item.cantidad <= 1}
                              aria-label="Disminuir cantidad"
                            >
                              −
                            </button>

                            <span
                              className="px-3 d-flex align-items-center justify-content-center fw-bold small bg-white text-dark"
                              style={{ minWidth: '36px' }}
                            >
                              {item.cantidad}
                            </span>

                            <button
                              type="button"
                              className="btn btn-light border-0 px-2 fw-bold text-primary"
                              onClick={() => handleAumentar(item.id)}
                              aria-label="Aumentar cantidad"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="text-end fw-bold text-primary py-3">
                          {formatPrecio(subtotal)}
                        </td>

                        <td className="text-center pe-3 pe-md-4 py-3">
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-danger text-decoration-none p-1"
                            onClick={() => handleEliminar(item.id)}
                            aria-label={`Eliminar ${item.nombre}`}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex justify-content-start mt-3">
            <Link
              to="/productos"
              className="btn btn-link text-primary text-decoration-none px-0 small fw-medium"
            >
              ← Continuar comprando productos
            </Link>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border shadow-sm rounded-3 bg-white">
            <div className="card-header bg-light border-bottom py-3 px-3 px-md-4">
              <h2 className="h6 fw-bold text-primary mb-0">
                Resumen de compra
              </h2>
            </div>

            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between mb-2 text-secondary small">
                <span>Unidades totales:</span>
                <span className="fw-semibold text-dark">
                  {totalProductos}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-2 text-secondary small">
                <span>Subtotal sin IGV:</span>
                <span className="fw-semibold text-dark">
                  {formatPrecio(subtotalProductos)}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-3 text-secondary small">
                <span>IGV ({(IGV_RATE * 100).toFixed(0)}%):</span>
                <span className="fw-semibold text-dark">
                  {formatPrecio(igv)}
                </span>
              </div>

              <div
                className="p-3 rounded-2 mb-3 border"
                style={{
                  backgroundColor: '#fffdf5',
                  borderColor: '#ffe69c',
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="d-block small text-muted">
                      Total final
                    </span>

                    <span
                      className="badge fw-semibold"
                      style={{
                        backgroundColor: '#ffecb5',
                        color: '#664d03',
                      }}
                    >
                      IGV incluido
                    </span>
                  </div>

                  <span className="h4 fw-bold text-primary mb-0">
                    {formatPrecio(totalFinal)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary w-100 py-2 mb-2 fw-medium shadow-sm"
                disabled
                aria-disabled="true"
              >
                Continuar con el pedido
              </button>

              <div className="text-center">
                <span
                  className="text-muted d-block small"
                  style={{ fontSize: '0.78rem' }}
                >
                  El registro y pago de pedidos se habilitará en la siguiente fase.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Carrito