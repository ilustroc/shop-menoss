import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import {
  getCarritoActual,
  crearPedido,
  calcularTotales,
  formatPrecio,
  METODO_PAGO_LABELS,
} from '../services/pedidosService';
import type { CartItem } from '../types/producto';
import type { DatosCompra, MetodoPago } from '../types/pedido';

import api from '../services/api';
import { session } from '../services/session';
type Errores = Partial<Record<'direccion' | 'general', string>>;
function validar(datos: DatosCompra): Errores {
 return datos.direccion.trim().length < 5 ? {direccion:'Ingresa una dirección válida.'} : {};
}
function CheckoutPage() {
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState<CartItem[]>(() => getCarritoActual());
  const [datosForm, setDatosForm] = useState<DatosCompra>({
    direccion: '',
    referencia: '',
    metodoPago: 'efectivo',
  });
  const enviando = useRef(false);
  const [stockValidado, setStockValidado] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [procesando, setProcesando] = useState(false);

  useEffect(() => { Promise.all(getCarritoActual().map(async item => {
    const p = (await api.get('/productos/'+item.id)).data;
    if (!p.activo || p.stock < item.cantidad) throw new Error('Stock insuficiente: '+p.nombre);
    return {...item, precio:p.precio, nombre:p.nombre, stock:p.stock};
  })).then(items=>{setCarrito(items);setStockValidado(true);}).catch(e=>setErrores({general:e.message})); }, []);
  const { subtotal, envio, total } = calcularTotales(carrito);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDatosForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmarPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando.current || !stockValidado) return;

    if (carrito.length === 0) {
      setErrores({ general: 'Tu carrito está vacío. Agrega productos antes de continuar.' });
      return;
    }

    const nuevosErrores = validar(datosForm);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setProcesando(true);
    enviando.current = true;
    {
      try {
        const pedidoCreado = await crearPedido({
          ...datosForm,

        });
        navigate(`/pedidos/${pedidoCreado.id}`, { state: { recienCreado: true } });
      } catch(e) {
        setErrores({ general: e instanceof Error ? e.message : 'No se pudo registrar el pedido.' });
        setProcesando(false);
        enviando.current = false;
      }
    }
  };

  const claseInput = (campo: keyof Errores, base: string) =>
    `${base} ${errores[campo] ? 'is-invalid' : ''}`;

  if (!session()) return <Navigate to="/login" replace/>;
  return (
    <div className="container mt-4 mb-5"><p className="alert alert-info">Pago simulado: no se realizan cobros reales. Precios con IGV incluido; envío S/ 10.00.</p>
      <div className="border-bottom pb-3 mb-4">
        <span className="text-success text-uppercase small fw-bold d-block mb-1">Paso final</span>
        <h2 className="fw-bold text-dark mb-0">Finalizar compra</h2>
      </div>

      {errores.general && (
        <div className="alert alert-danger" role="alert">
          {errores.general} <button onClick={()=>window.location.reload()}>Reintentar</button>
        </div>
      )}

      <div className="row g-4">
        {/* Formulario de datos */}
        <div className="col-lg-7">
          <div className="card border rounded-4 shadow-sm overflow-hidden">
            <div className="card-header bg-dark text-white border-0 py-3 px-4">
              <h5 className="card-title mb-0 fs-6 fw-bold">Datos de envío y pago</h5>
            </div>
            <div className="card-body p-4">
              <form id="checkout-form" onSubmit={handleConfirmarPedido} noValidate>
                <div className="mb-4">
                  <label htmlFor="direccion" className="form-label fw-semibold text-secondary small text-uppercase">
                    Dirección de entrega <span className="text-danger">*</span>
                  </label>
                  <input
                    id="direccion"
                    type="text"
                    name="direccion"
                    maxLength={255}
                    className={claseInput('direccion', 'form-control form-control-lg border-2 rounded-3 fs-6')}
                    placeholder="Calle, número, departamento, distrito..."
                    value={datosForm.direccion}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">{errores.direccion}</div>
                </div>

                <div className="mb-4">
                  <label htmlFor="referencia" className="form-label fw-semibold text-secondary small text-uppercase">
                    Referencia (opcional)
                  </label>
                  <input
                    id="referencia"
                    type="text"
                    name="referencia"
                    maxLength={255}
                    className="form-control border-2 rounded-3 fs-6"
                    placeholder="Ej: Frente al parque principal, portón negro"
                    value={datosForm.referencia}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="metodoPago" className="form-label fw-semibold text-secondary small text-uppercase">
                    Método de pago
                  </label>
                  <select
                    id="metodoPago"
                    name="metodoPago"
                    className="form-select form-select-lg border-2 rounded-3 fs-6"
                    value={datosForm.metodoPago}
                    onChange={handleInputChange}
                  >
                    {(Object.keys(METODO_PAGO_LABELS) as MetodoPago[]).map((metodo) => (
                      <option key={metodo} value={metodo}>
                        {METODO_PAGO_LABELS[metodo]}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="alert alert-info">Todos los métodos son simulados. No ingreses datos bancarios.</p>
              </form>
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="col-lg-5">
          <div className="card border rounded-4 shadow-sm overflow-hidden">
            <div className="card-header bg-light border-bottom py-3 px-4">
              <h5 className="card-title text-dark mb-0 fs-6 fw-bold">Resumen del pedido</h5>
            </div>
            <div className="card-body p-4">
              {carrito.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <p className="mb-3">No hay productos en tu carrito.</p>
                  <Link to="/productos" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                    Ir a la tienda
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="list-group list-group-flush mb-4">
                    {carrito.map((item) => (
                      <li
                        key={item.id}
                        className="list-group-item d-flex justify-content-between align-items-center px-0 py-3"
                      >
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
                      <span>Productos (IGV incluido):</span>
                      <span>{formatPrecio(subtotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 pb-2 border-bottom small text-secondary">
                      <span>Envío:</span>
                      <span>{formatPrecio(envio)}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center fw-bold">
                      <span className="fs-5 text-dark">Total a pagar:</span>
                      <span className="fs-4 text-success font-monospace">{formatPrecio(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={procesando || !stockValidado}
                    className="btn btn-success w-100 py-3 fs-5 fw-bold rounded-3 shadow"
                  >
                    {procesando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                        Registrando pedido...
                      </>
                    ) : (
                      'Confirmar compra'
                    )}
                  </button>
                </>
              )}

              <Link
                to="/carrito"
                className="btn btn-link w-100 mt-3 text-center text-secondary small text-decoration-none"
              >
                ← Volver al carrito
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
