// src/pages/Carrito.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CartItem, Producto } from '../types/producto'
import {
  leerCarrito,
  aumentarCantidad,
  disminuirCantidad,
  eliminarDelCarrito,
  vaciarCarrito,
  sincronizarCarritoConProductos,
} from '../services/carritoService'
import { listarProductosCatalogo } from '../services/productoService'
import { calcularTotales } from '../services/pedidosService'

function Carrito() {
  const [estadoInicialCarrito] = useState(() => {
    try {
      return {
        items: leerCarrito(),
        error: null as string | null,
      }
    } catch (error) {
      return {
        items: [] as CartItem[],
        error:
          error instanceof Error
            ? error.message
            : 'No se pudo leer el carrito guardado.',
      }
    }
  })

  const [items, setItems] = useState<CartItem[]>(
    estadoInicialCarrito.items
  )
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(
    !estadoInicialCarrito.error
  )
  const [catalogoVerificado, setCatalogoVerificado] = useState(false)
  const [errorCatalogo, setErrorCatalogo] = useState<string | null>(
    estadoInicialCarrito.error
  )
  const [mensaje, setMensaje] = useState<string | null>(null)

  useEffect(() => {
    if (estadoInicialCarrito.error) return

    let activo = true

    listarProductosCatalogo()
      .then((productosActuales) => {
        if (!activo) return

        const carritoActualizado =
          sincronizarCarritoConProductos(productosActuales)

        setProductos(productosActuales)
        setItems(carritoActualizado)
        setCatalogoVerificado(true)
      })
      .catch(() => {
        if (activo) {
          setErrorCatalogo(
            'No se pudo verificar el catálogo y el stock. Inténtalo nuevamente antes de continuar.'
          )
        }
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [estadoInicialCarrito.error])

  const productosPorId = new Map(
    productos.map((producto) => [producto.id, producto])
  )

  const actualizarCarrito = (operacion: () => CartItem[]) => {
    try {
      setItems(operacion())
      setMensaje(null)
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el carrito.'
      )
    }
  }

  const handleAumentar = (id: number) => {
    const producto = productosPorId.get(id)

    if (!catalogoVerificado || !producto) {
      setMensaje(
        'No se puede aumentar la cantidad sin verificar el producto y su stock.'
      )
      return
    }

    actualizarCarrito(() => aumentarCantidad(id, producto.stock))
  }

  const handleDisminuir = (id: number) => {
    actualizarCarrito(() => disminuirCantidad(id))
  }

  const handleEliminar = (id: number) => {
    actualizarCarrito(() => eliminarDelCarrito(id))
  }

  const handleVaciarCarrito = () => {
    const confirmar = window.confirm(
      '¿Estás seguro de que deseas vaciar todo el carrito?'
    )

    if (confirmar) {
      actualizarCarrito(() => vaciarCarrito())
    }
  }

  const formatPrecio = (valor: number): string => {
    return `S/ ${valor.toFixed(2)}`
  }

  const itemsConPreciosActuales = items.map((item) => ({
    precio: productosPorId.get(item.id)?.precio ?? item.precio,
    cantidad: item.cantidad,
  }))

  const {
    subtotal: subtotalProductos,
    envio,
    total: totalFinal,
  } = calcularTotales(itemsConPreciosActuales)

  const totalProductos = items.reduce(
    (acc, item) => acc + item.cantidad,
    0
  )

  const hayProblemasStock = items.some((item) => {
    const producto = productosPorId.get(item.id)

    return (
      !catalogoVerificado ||
      !producto ||
      !Number.isSafeInteger(producto.stock) ||
      producto.stock <= 0 ||
      item.cantidad > producto.stock
    )
  })

  const puedeMostrarImportes =
    catalogoVerificado &&
    !errorCatalogo &&
    items.every((item) => {
      const producto = productosPorId.get(item.id)

      return (
        producto !== undefined &&
        Number.isFinite(producto.precio) &&
        producto.precio >= 0
      )
    })

  const puedeContinuar =
    puedeMostrarImportes &&
    items.length > 0 &&
    !hayProblemasStock

  if (cargando) {
    return (
      <main className="container py-5">
        <div className="alert alert-info" role="status">
          Verificando productos y stock del carrito...
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="container py-5" id="carrito-vacio-vista">
        {errorCatalogo && (
          <div className="alert alert-danger" role="alert">
            {errorCatalogo}
          </div>
        )}

        <div
          className="card border-0 shadow-sm mx-auto p-4 p-md-5 text-center bg-white"
          style={{ maxWidth: '580px', borderRadius: '12px' }}
          id="contenedor-mensaje-vacio"
        >
          <div className="d-flex justify-content-center mb-3">
            <img
              src="/images/products/logo_menoss.png"
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
            No tienes productos seleccionados en este momento. Revisa
            nuestro catálogo y añade lo que necesites para tu hogar.
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
    <main
      className="container py-4 py-md-5"
      id="carrito-vista-principal"
    >
      {errorCatalogo && (
        <div className="alert alert-danger" role="alert">
          {errorCatalogo}
        </div>
      )}

      {mensaje && (
        <div className="alert alert-warning" role="alert">
          {mensaje}
        </div>
      )}

      {catalogoVerificado && hayProblemasStock && (
        <div className="alert alert-warning" role="alert">
          Revisa los productos sin stock suficiente o que ya no están
          disponibles antes de continuar.
        </div>
      )}

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
              Gestiona las cantidades y revisa el resumen de tus
              abarrotes.
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
              src="/images/products/logo_menoss.png"
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
                    const producto = productosPorId.get(item.id)
                    const nombre = producto?.nombre ?? item.nombre

                    const precioVerificado =
                      catalogoVerificado &&
                      producto !== undefined &&
                      Number.isFinite(producto.precio) &&
                      producto.precio >= 0

                    const precio = producto?.precio ?? item.precio

                    const subtotal = calcularTotales([
                      { precio, cantidad: item.cantidad },
                    ]).subtotal

                    const stockValido =
                      producto !== undefined &&
                      Number.isSafeInteger(producto.stock) &&
                      producto.stock >= 0

                    const mensajeStock = !catalogoVerificado
                      ? 'No se pudo verificar el stock.'
                      : !producto
                        ? 'Este producto ya no existe o no está disponible.'
                        : !stockValido
                          ? 'No se pudo verificar el stock disponible.'
                          : producto.stock === 0
                            ? 'Producto sin stock.'
                            : item.cantidad > producto.stock
                              ? `Solo quedan ${producto.stock} unidades; reduce la cantidad.`
                              : `Stock disponible: ${producto.stock}.`

                    return (
                      <tr key={item.id}>
                        <td className="ps-3 ps-md-4 py-3">
                          <span className="fw-semibold text-dark d-block">
                            {nombre}
                          </span>

                          <span
                            className={`small ${
                              !catalogoVerificado ||
                              !producto ||
                              !stockValido ||
                              producto.stock < item.cantidad
                                ? 'text-danger'
                                : 'text-muted'
                            }`}
                          >
                            ID #{item.id} · {mensajeStock}
                          </span>
                        </td>

                        <td className="text-center text-muted small py-3">
                          {precioVerificado
                            ? formatPrecio(precio)
                            : 'Por confirmar'}
                        </td>

                        <td className="text-center py-3 text-nowrap">
                          <div
                            className="btn-group btn-group-sm border rounded-2"
                            role="group"
                            aria-label={`Control de cantidad para ${nombre}`}
                            style={{ overflow: 'hidden' }}
                          >
                            <button
                              type="button"
                              className="btn btn-light border-0 px-2 fw-bold text-primary"
                              onClick={() => handleDisminuir(item.id)}
                              disabled={item.cantidad <= 1}
                              aria-label={`Disminuir cantidad de ${nombre}`}
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
                              disabled={
                                !catalogoVerificado ||
                                !producto ||
                                !stockValido ||
                                item.cantidad >= producto.stock
                              }
                              aria-label={`Aumentar cantidad de ${nombre}`}
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="text-end fw-bold text-primary py-3">
                          {precioVerificado
                            ? formatPrecio(subtotal)
                            : 'Por confirmar'}
                        </td>

                        <td className="text-center pe-3 pe-md-4 py-3">
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-danger text-decoration-none p-1"
                            onClick={() => handleEliminar(item.id)}
                            aria-label={`Eliminar ${nombre}`}
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
                <span>Productos (IGV incluido):</span>
                <span className="fw-semibold text-dark">
                  {puedeMostrarImportes
                    ? formatPrecio(subtotalProductos)
                    : 'Por confirmar'}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-3 text-secondary small">
                <span>Envío:</span>
                <span className="fw-semibold text-dark">
                  {puedeMostrarImportes
                    ? formatPrecio(envio)
                    : 'Por confirmar'}
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
                      Total
                    </span>

                    <span
                      className="badge fw-semibold"
                      style={{
                        backgroundColor: '#ffecb5',
                        color: '#664d03',
                      }}
                    >
                      El backend confirma el total
                    </span>
                  </div>

                  <span className="h4 fw-bold text-primary mb-0">
                    {puedeMostrarImportes
                      ? formatPrecio(totalFinal)
                      : 'Por confirmar'}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className={`btn btn-primary w-100 py-2 mb-2 fw-medium shadow-sm ${
                  puedeContinuar ? '' : 'disabled'
                }`}
                aria-disabled={!puedeContinuar}
                tabIndex={puedeContinuar ? undefined : -1}
                onClick={(event) => {
                  if (!puedeContinuar) event.preventDefault()
                }}
              >
                Continuar con el pedido
              </Link>

              <div className="text-center">
                <span
                  className="text-muted d-block small"
                  style={{ fontSize: '0.78rem' }}
                >
                  Los precios incluyen IGV, sin recargo adicional. El
                  backend vuelve a validar los precios, el stock, el
                  envío y el total al crear el pedido.
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
