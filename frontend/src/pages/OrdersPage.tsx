import React from 'react';
import { Link } from 'react-router-dom';

const OrdersPage: React.FC = () => {
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2> Mis Pedidos</h2>
        <Link to="/checkout" className="btn btn-primary">+ Nuevo Pedido</Link>
      </div>

      <div className="row g-3">
        {/* Pedido 1 */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Pedido #1024</h5>
                <span className="badge bg-success">Entregado</span>
              </div>
              <p className="card-text text-muted mb-1">12 de Septiembre, 2026</p>
              <p className="card-text"><strong>Total:</strong> s/. 150.00</p>
              <Link to="/pedidos/1024" className="btn btn-outline-primary btn-sm">Ver detalle</Link>
            </div>
          </div>
        </div>

        {/* Pedido 2 */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">Pedido #1025</h5>
                <span className="badge bg-warning text-dark">En camino</span>
              </div>
              <p className="card-text text-muted mb-1">12 de Septiembre, 2026</p>
              <p className="card-text"><strong>Total:</strong> s/. 85.50</p>
              <Link to="/pedidos/1025" className="btn btn-outline-primary btn-sm">Ver detalle</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;