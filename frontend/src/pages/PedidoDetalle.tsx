import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  getPedidoById,
  ESTADO_LABELS,
  ESTADO_BADGE_CLASS,
  ESTADO_DESCRIPCION,
  METODO_PAGO_LABELS,
  PASOS_ESTADO,
  formatPrecio,
  formatFecha,
} from '../services/pedidosService';
import type { EstadoPedido, Pedido } from '../types/pedido';

/** Línea de progreso del estado del pedido. */
function SeguimientoEstado({ estado }: { estado: EstadoPedido }) {
  if (estado === 'cancelado') {
    return (
      <div className="alert alert-danger mb-0">
        <strong>Pedido cancelado.</strong> {ESTADO_DESCRIPCION.cancelado}
      </div>
    );
  }

  const indiceActual = PASOS_ESTADO.indexOf(estado);

  return (
    <div>
      <ol className="list-unstyled d-flex justify-content-between position-relative mb-3">
        {PASOS_ESTADO.map((paso, indice) => {
          const completado = indice <= indiceActual;
          return (
            <li key={paso} className="text-center flex-fill position-relative">
              {indice > 0 && (
                <span
                  className={`position-absolute top-0 translate-middle-y ${
                    indice <= indiceActual ? 'bg-success' : 'bg-secondary-subtle'
                  }`}
                  style={{ height: 4, left: '-50%', right: '50%', marginTop: 16 }}
                  aria-hidden="true"
                />
              )}
              <span
                className={`d-inline-flex align-items-center justify-content-center rounded-circle fw-bold position-relative ${
                  completado ? 'bg-success text-white' : 'bg-light text-secondary border'
                }`}
                style={{ width: 32, height: 32, zIndex: 1 }}
                aria-current={indice === indiceActual ? 'step' : undefined}
              >
                {indice < indiceActual ? '✓' : indice + 1}
              </span>
              <span
                className={`d-block small mt-2 ${
                  indice === indiceActual ? 'fw-bold text-dark' : 'text-muted'
                }`}
              >
                {ESTADO_LABELS[paso]}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="small text-secondary mb-0 text-center">{ESTADO_DESCRIPCION[estado]}</p>
    </div>
  );
}

function PedidoDetalle() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const recienCreado = Boolean(
    (location.state as { recienCreado?: boolean } | null)?.recienCreado
  );

  // Inicializamos el estado directamente
  const [pedido] = useState<Pedido | undefined>(() => {
    return id ? getPedidoById(id) : undefined;
  });

  if (!pedido) {
    return (
      <div className="container mt-5 py-4">
        <Link to="/pedidos" className="btn btn-outline-secondary btn-sm mb-4 px-3 rounded-pill">
          ← Volver al Historial
        </Link>
        <div className="alert bg-danger-subtle text-danger border border-danger-subtle text-center p-4 rounded-3 shadow-sm">
          <h4 className="alert-heading fw-bold mb-2">¡Pedido no encontrado!</h4>
          <p className="mb-0">El identificador #{id} no coincide con ningún registro en nuestro sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      {recienCreado && (
        <div className="alert alert-success" role="status">
          <strong>¡Pedido #{pedido.id} registrado con éxito!</strong> Gracias por tu compra.
        </div>
      )}

      {/* Botón de retorno */}
      <div className="mb-4">
        <Link to="/pedidos" className="btn btn-light border btn-sm text-secondary px-3 py-2 rounded-3 shadow-sm">
          ← Volver a mis pedidos
        </Link>
      </div>

      {/* Encabezado principal */}
      <div className="bg-white border rounded-4 p-4 mb-4 shadow-sm d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
        <div>
          <span className="text-primary text-uppercase small fw-bold mb-1 d-block">Resumen de Compra</span>
          <h2 className="fw-bold text-dark mb-0 display-6" style={{ fontSize: '1.75rem' }}>
            Pedido <span className="text-secondary font-monospace">#{pedido.id}</span>
          </h2>
          <p className="text-muted small mb-0 mt-1">
            Registrado el {formatFecha(pedido.fecha)}
          </p>
        </div>
        <div>
          <span className={`badge ${ESTADO_BADGE_CLASS[pedido.estado]} px-4 py-2 fs-6 rounded-pill border`}>
            ● {ESTADO_LABELS[pedido.estado]}
          </span>
        </div>
      </div>

      {/* Estado del pedido */}
      <div className="bg-white border rounded-4 p-4 mb-4 shadow-sm">
        <h5 className="fs-6 fw-bold text-dark mb-4">Estado del pedido</h5>
        <SeguimientoEstado estado={pedido.estado} />
      </div>

      <div className="row g-4">
        {/* Información de Entrega y Pago */}
        <div className="col-lg-4">
          <div className="card border rounded-4 shadow-sm overflow-hidden h-100">
            <div className="card-header bg-dark text-white border-0 py-3 px-4">
              <h5 className="card-title mb-0 fs-6 fw-bold">Datos de Entrega</h5>
            </div>
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="mb-4">
                  <label className="text-muted text-uppercase small fw-bold d-block mb-1">Dirección de Envío</label>
                  <p className="text-dark fw-medium bg-light p-3 rounded-3 border mb-0">
                    {pedido.direccion}
                  </p>
                </div>

                {pedido.referencia && (
                  <div className="mb-4">
                    <label className="text-muted text-uppercase small fw-bold d-block mb-1">Indicaciones / Referencia</label>
                    <p className="text-secondary small bg-light p-3 rounded-3 border mb-0">
                      {pedido.referencia}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-top pt-4 mt-2">
                <label className="text-muted text-uppercase small fw-bold d-block mb-1">Método de Pago Seleccionado</label>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <span className="badge bg-light text-dark border px-3 py-2 rounded-3">
                    {METODO_PAGO_LABELS[pedido.metodoPago]}
                    {pedido.tarjetaUltimos4 && ` •••• ${pedido.tarjetaUltimos4}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles del Carrito / Productos */}
        <div className="col-lg-8">
          <div className="card border rounded-4 shadow-sm overflow-hidden">
            <div className="card-header bg-light border-bottom py-3 px-4">
              <h5 className="card-title text-dark mb-0 fs-6 fw-bold">Productos en este pedido</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover">
                  <thead className="table-light text-secondary text-uppercase small border-bottom">
                    <tr>
                      <th className="py-3 px-4" style={{ width: '45%' }}>Producto</th>
                      <th className="py-3 text-center" style={{ width: '15%' }}>Cantidad</th>
                      <th className="py-3 text-end" style={{ width: '20%' }}>Precio Unit.</th>
                      <th className="py-3 text-end px-4" style={{ width: '20%' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="border-0">
                    {pedido.detalles.map((detalle, index) => (
                      <tr key={index} className="border-bottom">
                        <td className="py-3 px-4">
                          <span className="fw-semibold text-dark d-block">{detalle.nombre}</span>
                          <span className="text-muted small">ID Ref: #{detalle.productoId}</span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="badge bg-light text-dark border px-3 py-1 rounded-3 fw-bold">
                            {detalle.cantidad}
                          </span>
                        </td>
                        <td className="py-3 text-end text-muted">
                          {formatPrecio(detalle.precioUnitario)}
                        </td>
                        <td className="py-3 text-end fw-semibold text-dark px-4">
                          {formatPrecio(detalle.precioUnitario * detalle.cantidad)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Sección de Totales */}
            <div className="card-footer bg-light border-top-0 p-4">
              <div className="row justify-content-end">
                <div className="col-sm-6 col-md-5">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Subtotal Neto:</span>
                    <span className="text-dark fw-medium">{formatPrecio(pedido.subtotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                    <span className="text-muted small">IGV Impuestos (18%):</span>
                    <span className="text-dark fw-medium">{formatPrecio(pedido.igv)}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-dark fw-bold fs-5 text-nowrap me-3">Total facturado:</span>
                    <span className="text-primary fw-bold fs-4 font-monospace text-nowrap">
                      {formatPrecio(pedido.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PedidoDetalle;