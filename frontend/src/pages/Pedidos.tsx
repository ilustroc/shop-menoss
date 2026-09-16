import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getPedidos, ESTADO_LABELS, ESTADO_BADGE_CLASS, formatPrecio, formatFecha } from '../services/pedidosService';
import type { Pedido } from '../types/pedido';

function Pedidos() {
  // Se inicializa el estado cargando los pedidos directamente
  const [listaPedidos] = useState<Pedido[]>(() => getPedidos());

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mis Pedidos</h2>
        <Link to="/checkout" className="btn btn-primary">
          + Nuevo Pedido
        </Link>
      </div>

      {listaPedidos.length === 0 ? (
        <div className="alert alert-info text-center">
          Aún no tienes pedidos registrados.
        </div>
      ) : (
        <div className="row g-3">
          {listaPedidos.map((pedido) => (
            <div className="col-md-6" key={pedido.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title">Pedido #{pedido.id}</h5>
                    <span className={`badge ${ESTADO_BADGE_CLASS[pedido.estado]}`}>
                      {ESTADO_LABELS[pedido.estado]}
                    </span>
                  </div>

                  <p className="card-text text-muted mb-1">
                    {formatFecha(pedido.fecha)}
                  </p>

                  <p className="card-text">
                    <strong>Total:</strong> {formatPrecio(pedido.total)}
                  </p>

                  <Link
                    to={`/pedidos/${pedido.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Pedidos;
