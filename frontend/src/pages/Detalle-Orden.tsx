import React from 'react';
import { Link } from 'react-router-dom';

const DetalleOrden: React.FC = () => {
  return (
    <div className="container mt-4">
      <Link to="/pedidos" className="btn btn-link mb-3">← Volver a mis pedidos</Link>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Detalle del Pedido #1025</h2>
        <span className="badge bg-warning text-dark fs-6">En camino</span>
      </div>

      <div className="row">
        {/* Información de envío y pago */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-light">Información de Envío</div>
            <div className="card-body">
              <p className="mb-1"><strong>Dirección:</strong></p>
              <p className="text-muted">Av. Siempre Viva 123, Depto 4B</p>
              <p className="mb-1 mt-3"><strong>Método de Pago:</strong></p>
              <p className="text-muted">Tarjeta de Crédito (**** 1234)</p>
            </div>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-light">Productos</div>
            <div className="card-body p-0">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-end">Precio</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Leche Entera 1L</td>
                    <td className="text-center">2</td>
                    <td className="text-end">s/. 3.50</td>
                    <td className="text-end">s/. 7.00</td>
                  </tr>
                  <tr>
                    <td>Pan Francés (kg)</td>
                    <td className="text-center">1</td>
                    <td className="text-end">s/. 2.00</td>
                    <td className="text-end">s/. 2.00</td>
                  </tr>
                  <tr>
                    <td>Manzanas Rojas (kg)</td>
                    <td className="text-center">3</td>
                    <td className="text-end">s/. 4.50</td>
                    <td className="text-end">s/. 13.50</td>
                  </tr>
                </tbody>
                <tfoot className="table-group-divider">
                  <tr>
                    <th colSpan={3} className="text-end">Total:</th>
                    <th className="text-end fs-5">s/. 85.50</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;