import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">Finalizar Compra</h2>
      
      <div className="row">
        {/* Formulario de datos */}
        <div className="col-md-7">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">Datos de Envío y Pago</div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Dirección de entrega</label>
                  <input type="text" className="form-control" placeholder="Calle, número, departamento..." />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Referencia (Opcional)</label>
                  <input type="text" className="form-control" placeholder="Ej: Casa azul, portón negro" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Método de pago</label>
                  <select className="form-select">
                    <option value="efectivo">Efectivo contra entrega</option>
                    <option value="tarjeta">Tarjeta de Crédito / Débito</option>
                    <option value="transferencia">Transferencia bancaria</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-header bg-light">Resumen del Pedido</div>
            <div className="card-body">
              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Leche Entera 1L (x2)</span>
                  <span>s/. 7.00</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Pan Francés (x1)</span>
                  <span>s/. 2.00</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Manzanas Rojas (x3)</span>
                  <span>s/. 13.50</span>
                </li>
              </ul>
              
              <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                <span>Total a pagar:</span>
                <span>s/. 85.50</span>
              </div>

              <button className="btn btn-success w-100 py-2" disabled>
                Confirmar Pedido (Simulado)
              </button>
              <Link to="/pedidos" className="btn btn-link w-100 mt-2 text-center">
                Cancelar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;