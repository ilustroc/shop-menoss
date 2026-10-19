import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getCarritoActual,
  crearPedido,
  calcularTotales,
  formatPrecio,
  METODO_PAGO_LABELS,
} from '../services/pedidosService';
import type { CartItem } from '../types/producto';
import type { DatosCompra, DatosTarjeta, MetodoPago } from '../types/pedido';

type Errores = Partial<Record<'direccion' | keyof DatosTarjeta | 'general', string>>;

const TARJETA_VACIA: DatosTarjeta = { titular: '', numero: '', vencimiento: '', cvv: '' };

// Validaciones del pago simulado (no se conecta con ninguna pasarela real)
function validar(datos: DatosCompra, tarjeta: DatosTarjeta): Errores {
  const errores: Errores = {};

  if (datos.direccion.trim().length < 5) {
    errores.direccion = 'Ingresa una dirección de entrega válida.';
  }

  if (datos.metodoPago === 'tarjeta') {
    if (tarjeta.titular.trim().length < 3) {
      errores.titular = 'Ingresa el nombre del titular.';
    }
    if (tarjeta.numero.replace(/\D/g, '').length !== 16) {
      errores.numero = 'El número debe tener 16 dígitos.';
    }

    const match = /^(\d{2})\/(\d{2})$/.exec(tarjeta.vencimiento);
    if (!match) {
      errores.vencimiento = 'Usa el formato MM/AA.';
    } else {
      const mes = Number(match[1]);
      const anio = 2000 + Number(match[2]);
      const hoy = new Date();
      const vencida =
        anio < hoy.getFullYear() ||
        (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1);
      if (mes < 1 || mes > 12) errores.vencimiento = 'Mes inválido.';
      else if (vencida) errores.vencimiento = 'La tarjeta está vencida.';
    }

    if (!/^\d{3,4}$/.test(tarjeta.cvv)) {
      errores.cvv = 'CVV de 3 o 4 dígitos.';
    }
  }

  return errores;
}

function formatearNumeroTarjeta(valor: string) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatearVencimiento(valor: string) {
  const digitos = valor.replace(/\D/g, '').slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
}

function CheckoutPage() {
  const navigate = useNavigate();

  const [carrito] = useState<CartItem[]>(() => getCarritoActual());
  const [datosForm, setDatosForm] = useState<DatosCompra>({
    direccion: '',
    referencia: '',
    metodoPago: 'efectivo',
  });
  const [tarjeta, setTarjeta] = useState<DatosTarjeta>(TARJETA_VACIA);
  const [errores, setErrores] = useState<Errores>({});
  const [procesando, setProcesando] = useState(false);

  const { subtotal, igv, total } = calcularTotales(carrito);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDatosForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTarjetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let valor = value;
    if (name === 'numero') valor = formatearNumeroTarjeta(value);
    if (name === 'vencimiento') valor = formatearVencimiento(value);
    if (name === 'cvv') valor = value.replace(/\D/g, '').slice(0, 4);
    setTarjeta((prev) => ({ ...prev, [name]: valor }));
  };

  const handleConfirmarPedido = (e: React.FormEvent) => {
    e.preventDefault();

    if (carrito.length === 0) {
      setErrores({ general: 'Tu carrito está vacío. Agrega productos antes de continuar.' });
      return;
    }

    const nuevosErrores = validar(datosForm, tarjeta);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setProcesando(true);
    // Simulamos una pequeña espera de "procesando pago"
    setTimeout(() => {
      try {
        const pedidoCreado = crearPedido({
          ...datosForm,
          tarjeta: datosForm.metodoPago === 'tarjeta' ? tarjeta : undefined,
        });
        navigate(`/pedidos/${pedidoCreado.id}`, { state: { recienCreado: true } });
      } catch {
        setErrores({ general: 'No se pudo registrar el pedido. Inténtalo nuevamente.' });
        setProcesando(false);
      }
    }, 800);
  };

  const claseInput = (campo: keyof Errores, base: string) =>
    `${base} ${errores[campo] ? 'is-invalid' : ''}`;

  return (
    <div className="container mt-4 mb-5">
      <div className="border-bottom pb-3 mb-4">
        <span className="text-success text-uppercase small fw-bold d-block mb-1">Paso final</span>
        <h2 className="fw-bold text-dark mb-0">Finalizar compra</h2>
      </div>

      {errores.general && (
        <div className="alert alert-danger" role="alert">
          {errores.general}
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

                {datosForm.metodoPago === 'tarjeta' && (
                  <div className="border rounded-3 p-3 bg-light">
                    <p className="small text-muted mb-3">
                      Pago simulado: no ingreses datos reales. Puedes usar 4242 4242 4242 4242.
                    </p>
                    <div className="mb-3">
                      <label htmlFor="titular" className="form-label small fw-semibold">Titular</label>
                      <input
                        id="titular"
                        name="titular"
                        className={claseInput('titular', 'form-control')}
                        placeholder="Como aparece en la tarjeta"
                        value={tarjeta.titular}
                        onChange={handleTarjetaChange}
                      />
                      <div className="invalid-feedback">{errores.titular}</div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="numero" className="form-label small fw-semibold">Número de tarjeta</label>
                      <input
                        id="numero"
                        name="numero"
                        inputMode="numeric"
                        autoComplete="off"
                        className={claseInput('numero', 'form-control font-monospace')}
                        placeholder="0000 0000 0000 0000"
                        value={tarjeta.numero}
                        onChange={handleTarjetaChange}
                      />
                      <div className="invalid-feedback">{errores.numero}</div>
                    </div>
                    <div className="row g-3">
                      <div className="col-6">
                        <label htmlFor="vencimiento" className="form-label small fw-semibold">Vencimiento</label>
                        <input
                          id="vencimiento"
                          name="vencimiento"
                          inputMode="numeric"
                          className={claseInput('vencimiento', 'form-control')}
                          placeholder="MM/AA"
                          value={tarjeta.vencimiento}
                          onChange={handleTarjetaChange}
                        />
                        <div className="invalid-feedback">{errores.vencimiento}</div>
                      </div>
                      <div className="col-6">
                        <label htmlFor="cvv" className="form-label small fw-semibold">CVV</label>
                        <input
                          id="cvv"
                          name="cvv"
                          inputMode="numeric"
                          autoComplete="off"
                          className={claseInput('cvv', 'form-control')}
                          placeholder="123"
                          value={tarjeta.cvv}
                          onChange={handleTarjetaChange}
                        />
                        <div className="invalid-feedback">{errores.cvv}</div>
                      </div>
                    </div>
                  </div>
                )}

                {datosForm.metodoPago === 'transferencia' && (
                  <div className="alert alert-info small mb-0">
                    Al confirmar, te mostraremos el pedido como <strong>pendiente</strong> hasta que
                    la tienda valide la transferencia (cuenta ficticia BCP 191-0000000-0-00).
                  </div>
                )}

                {datosForm.metodoPago === 'efectivo' && (
                  <div className="alert alert-light border small mb-0">
                    Pagarás en efectivo al recibir tu pedido.
                  </div>
                )}
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
                      <span>Subtotal:</span>
                      <span>{formatPrecio(subtotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 pb-2 border-bottom small text-secondary">
                      <span>IGV (18%):</span>
                      <span>{formatPrecio(igv)}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center fw-bold">
                      <span className="fs-5 text-dark">Total a pagar:</span>
                      <span className="fs-4 text-success font-monospace">{formatPrecio(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={procesando}
                    className="btn btn-success w-100 py-3 fs-5 fw-bold rounded-3 shadow"
                  >
                    {procesando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                        Procesando pago...
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