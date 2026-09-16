import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPedidoById, ESTADO_LABELS, ESTADO_BADGE_CLASS, formatPrecio, formatFecha } from '../services/pedidosService';
import type { Pedido } from '../types/pedido';

function PedidoDetalle() {
  const { id } = useParams<{ id: string }>();
  
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
        <div className="alert alert-custom bg-danger-subtle text-danger border border-danger-subtle text-center p-4 rounded-3 shadow-sm">
          <h4 className="alert-heading fw-bold mb-2">¡Pedido no encontrado!</h4>
          <p className="mb-0">El identificador #{id} no coincide con ningún registro en nuestro sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      {/* Botón de retorno */}
      <div className="mb-4">
        <Link to="/pedidos" className="btn btn-light border btn-sm text-secondary px-3 py-2 rounded-3 shadow-sm hover-shadow">
          ← Volver a mis pedidos
        </Link>
      </div>

      {/* Encabezado principal */}
      <div className="bg-white border rounded-4 p-4 mb-4 shadow-sm d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
        <div>
          <span className="text-primary text-uppercase fs-7 fw-bold tracking-wider mb-1 d-block">Resumen de Compra</span>
          <h2 className="fw-black text-dark mb-0 display-6" style={{ fontSize: '1.75rem' }}>
            Pedido <span className="text-secondary font-monospace">#{pedido.id}</span>
          </h2>
          <p className="text-muted small mb-0 mt-1">
            Registrado el {formatFecha(pedido.fecha)}
          </p>
        </div>
        <div>
          <span className={`badge ${ESTADO_BADGE_CLASS[pedido.estado]} px-4 py-2.5 fs-6 rounded-pill shadow-xs border`}>
            ● {ESTADO_LABELS[pedido.estado]}
          </span>
        </div>
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
                  <label className="text-muted text-uppercase tracking-wider small fw-bold d-block mb-1">Dirección de Envío</label>
                  <p className="text-dark fw-medium bg-light p-3 rounded-3 border mb-0">
                    {pedido.direccion}
                  </p>
                </div>

                {pedido.referencia && (
                  <div className="mb-4">
                    <label className="text-muted text-uppercase tracking-wider small fw-bold d-block mb-1">Indicaciones / Referencia</label>
                    <p className="text-secondary small bg-light p-3 rounded-3 border mb-0">
                      {pedido.referencia}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-top pt-4 mt-2">
                <label className="text-muted text-uppercase tracking-wider small fw-bold d-block mb-1">Método de Pago Seleccionado</label>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <span className="badge bg-light text-dark border px-3 py-2 text-capitalize fs-7 rounded-3">
                    💳 {pedido.metodoPago}
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
                  <thead className="table-light text-secondary text-uppercase fs-7 border-bottom">
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
                          <span className="badge bg-light text-dark border px-3 py-1.5 rounded-3 fw-bold">
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
                    <span className="text-dark fw-bold fs-5">Total Facturado:</span>
                    <span className="text-primary fw-black fs-4 font-monospace">
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
