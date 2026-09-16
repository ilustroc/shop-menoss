import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCarritoActual, crearPedido, formatPrecio } from '../services/pedidosService';
import type { DatosCompra } from '../types/pedido'; // Removido MetodoPago porque no se usaba

interface ProductItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

function CheckoutPage() {
  const navigate = useNavigate();
  
  // Inicializa el estado cargando los productos directamente
  const [carrito] = useState<ProductItemCarrito[]>(() => getCarritoActual());
  
  // Estado para capturar los datos del formulario
  const [datosForm, setDatosForm] = useState<DatosCompra>({
    direccion: '',
    referencia: '',
    metodoPago: 'efectivo',
  });

  // Se calcula los totales basados en el estado inicial directo
  const subtotalNeto = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const igvImpuesto = subtotalNeto * 0.18;
  const totalFinal = subtotalNeto + igvImpuesto;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDatosForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmarPedido = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!datosForm.direccion.trim()) {
      alert('Por favor, ingresa una dirección de entrega válida.');
      return;
    }

    if (carrito.length === 0) {
      alert('Tu carrito está vacío. Agrega productos antes de procesar el pago.');
      return;
    }

    const pedidoCreado = crearPedido(datosForm);
    alert(`¡Pedido #${pedidoCreado.id} confirmado con éxito! Gracias por tu compra.`);
    
    // Redirecciona al usuario a su listado actualizado de pedidos
    navigate('/pedidos');
  };

  return (
    <div className="container mt-4 mb-5">
      {/* Título y cabecera */}
      <div className="border-bottom pb-3 mb-4">
        <span className="text-success text-uppercase fs-7 fw-bold d-block mb-1">Paso Final</span>
        <h2 className="fw-black text-dark mb-0">Finalizar Compra</h2>
      </div>

      <div className="row g-4">
        {/* Formulario de datos */}
        <div className="col-lg-7">
          <div className="card border rounded-4 shadow-sm overflow-hidden">
            <div className="card-header bg-dark text-white border-0 py-3 px-4">
              <h5 className="card-title mb-0 fs-6 fw-bold">Datos de Envío y Pago</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleConfirmarPedido}>
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary small text-uppercase">
                    Dirección de entrega <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    className="form-control form-control-lg border-2 rounded-3 fs-6"
                    placeholder="Calle, número, departamento, distrito..."
                    value={datosForm.direccion}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary small text-uppercase">
                    Referencia (Opcional)
                  </label>
                  <input
                    type="text"
                    name="referencia"
                    className="form-control border-2 rounded-3 fs-6"
                    placeholder="Ej: Frente al parque principal, portón negro"
                    value={datosForm.referencia}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label fw-semibold text-secondary small text-uppercase">
                    Método de pago
                  </label>
                  <select
                    name="metodoPago"
                    className="form-select form-select-lg border-2 rounded-3 fs-6 text-capitalize"
                    value={datosForm.metodoPago}
                    onChange={handleInputChange}
                  >
                    <option value="efectivo"> Efectivo contra entrega</option>
                    <option value="tarjeta"> Tarjeta de Crédito / Débito</option>
                    <option value="transferencia"> Transferencia bancaria</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="col-lg-5">
          <div className="card border rounded-4 shadow-sm overflow-hidden">
            <div className="card-header bg-light border-bottom py-3 px-4">
              <h5 className="card-title text-dark mb-0 fs-6 fw-bold">Resumen del Pedido</h5>
            </div>
            <div className="card-body p-4">
              {carrito.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <p className="mb-3">No hay productos seleccionados en tu carrito.</p>
                  <Link to="/productos" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                    Ir a la tienda
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="list-group list-group-flush mb-4 max-height-300 overflow-y-auto">
                    {carrito.map((item) => (
                      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom-dashed">
                        <div>
                          <span className="fw-semibold text-dark d-block">{item.nombre}</span>
                          <small className="text-muted">
                            {formatPrecio(item.precio)} x {item.cantidad}
                          </small>
                        </div>
                        <span className="fw-bold text-dark">
                          {formatPrecio(item.precio * item.cantidad)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-light p-3 rounded-4 border mb-4">
                    <div className="d-flex justify-content-between mb-2 small text-secondary">
                      <span>Subtotal Neto:</span>
                      <span>{formatPrecio(subtotalNeto)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 pb-2 border-bottom small text-secondary">
                      <span>IGV (18%):</span>
                      <span>{formatPrecio(igvImpuesto)}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center fw-bold">
                      <span className="fs-5 text-dark">Total a pagar:</span>
                      <span className="fs-4 text-success font-monospace">{formatPrecio(totalFinal)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmarPedido}
                    className="btn btn-success w-100 py-3 fs-5 fw-bold rounded-3 shadow"
                  >
                    Confirmar Compra 
                  </button>
                </>
              )}

              <Link
                to="/pedidos"
                className="btn btn-link w-100 mt-3 text-center text-secondary small text-decoration-none"
              >
                ← Cancelar y volver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
