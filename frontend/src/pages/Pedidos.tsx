import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getPedidos,
  getCarritoActual,
  ESTADO_LABELS,
  ESTADO_BADGE_CLASS,
  METODO_PAGO_LABELS,
  formatPrecio,
  formatFecha,
} from '../services/pedidosService';
import type { EstadoPedido, Pedido } from '../types/pedido';

type Filtro = 'todos' | EstadoPedido;

function Pedidos() {
  const [listaPedidos] = useState<Pedido[]>(() => getPedidos());
  const [hayCarrito] = useState(() => getCarritoActual().length > 0);
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const pedidosFiltrados =
    filtro === 'todos'
      ? listaPedidos
      : listaPedidos.filter((pedido) => pedido.estado === filtro);

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h2 className="mb-0">Mis pedidos</h2>
        {hayCarrito ? (
          <Link to="/checkout" className="btn btn-primary">
            Finalizar compra pendiente
          </Link>
        ) : (
          <Link to="/productos" className="btn btn-outline-primary">
            Ir a la tienda
          </Link>
        )}
      </div>

      {listaPedidos.length > 0 && (
        <div className="d-flex align-items-center gap-2 mb-3">
          <label htmlFor="filtro-estado" className="small text-muted mb-0">
            Filtrar por estado:
          </label>
          <select
            id="filtro-estado"
            className="form-select form-select-sm w-auto"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as Filtro)}
          >
            <option value="todos">Todos</option>
            {(Object.keys(ESTADO_LABELS) as EstadoPedido[]).map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_LABELS[estado]}
              </option>
            ))}
          </select>
        </div>
      )}

      {listaPedidos.length === 0 ? (
        <div className="alert alert-info text-center">
          Aún no tienes pedidos registrados.
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="alert alert-light border text-center">
          No tienes pedidos con estado “{ESTADO_LABELS[filtro as EstadoPedido]}”.
        </div>
      ) : (
        <div className="row g-3">
          {pedidosFiltrados.map((pedido) => {
            const cantidadProductos = pedido.detalles.reduce(
              (acc, d) => acc + d.cantidad,
              0
            );

            return (
              <div className="col-md-6" key={pedido.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="card-title mb-1">Pedido #{pedido.id}</h5>
                      <span className={`badge ${ESTADO_BADGE_CLASS[pedido.estado]}`}>
                        {ESTADO_LABELS[pedido.estado]}
                      </span>
                    </div>

                    <p className="card-text text-muted small mb-2">
                      {formatFecha(pedido.fecha)} · {cantidadProductos}{' '}
                      {cantidadProductos === 1 ? 'producto' : 'productos'}
                    </p>

                    <p className="card-text small mb-1">
                      <strong>Pago:</strong> {METODO_PAGO_LABELS[pedido.metodoPago]}
                    </p>
                    <p className="card-text mb-3">
                      <strong>Total:</strong> {formatPrecio(pedido.total)}
                    </p>

                    <Link
                      to={`/pedidos/${pedido.id}`}
                      className="btn btn-outline-primary btn-sm mt-auto align-self-start"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Pedidos;