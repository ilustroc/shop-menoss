import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  getCarritoActual,
  crearPedido,
  calcularTotales,
  formatPrecio,
  METODO_PAGO_LABELS,
} from '../services/pedidosService';
import { listarProductosCatalogo } from '../services/productoService';
import { sincronizarCarritoConProductos } from '../services/carritoService';
import { session } from '../services/session';
import type { CartItem } from '../types/producto';
import type { DatosCompra, MetodoPago } from '../types/pedido';

type Errores = Partial<Record<'direccion' | 'general', string>>;

function leerCarritoInicial(): {
  carrito: CartItem[];
  error: string | null;
} {
  try {
    return { carrito: getCarritoActual(), error: null };
  } catch {
    return {
      carrito: [],
      error:
        'No se pudo leer el carrito. Vuelve al carrito y revisa sus productos.',
    };
  }
}

function mensajeErrorCreacion(error: unknown): string {
  if (axios.isAxiosError<{ message?: unknown; detail?: unknown }>(error)) {
    if (error.response?.status === 401) {
      return 'Tu sesión no es válida o ha vencido. Vuelve a iniciar sesión.';
    }

    if (error.response?.status === 403) {
      return 'No tienes permiso para realizar esta operación.';
    }

    const respuesta = error.response?.data;

    if (typeof respuesta?.message === 'string') {
      return respuesta.message;
    }

    if (typeof respuesta?.detail === 'string') {
      return respuesta.detail;
    }

    return 'No se pudo registrar el pedido. Revisa tu conexión y el estado de tu compra antes de reintentar.';
  }

  return error instanceof Error
    ? error.message
    : 'No se pudo completar la operación.';
}

function validar(datos: DatosCompra): Errores {
  if (datos.direccion.trim().length < 5) {
    return {
      direccion: 'Ingresa una dirección de entrega válida.',
    };
  }

  return {};
}

async function consultarCarritoActualizado(): Promise<CartItem[]> {
  const carritoActual = getCarritoActual();

  if (carritoActual.length === 0) {
    throw new Error(
      'Tu carrito está vacío. Agrega productos antes de continuar.'
    );
  }

  const productos = await listarProductosCatalogo();
  const productosPorId = new Map(
    productos.map((producto) => [producto.id, producto])
  );

  for (const item of carritoActual) {
    const producto = productosPorId.get(item.id);

    if (!producto) {
      throw new Error(
        `${item.nombre} ya no está disponible. Revisa tu carrito.`
      );
    }

    if (
      !Number.isSafeInteger(producto.stock) ||
      producto.stock < item.cantidad
    ) {
      throw new Error(
        `Stock insuficiente de ${producto.nombre}. Revisa las cantidades en tu carrito.`
      );
    }

    if (!Number.isFinite(producto.precio) || producto.precio < 0) {
      throw new Error(
        `No se pudo verificar el precio de ${producto.nombre}.`
      );
    }
  }

  return sincronizarCarritoConProductos(productos);
}

function mismoResumen(
  anterior: CartItem[],
  actualizado: CartItem[]
): boolean {
  if (anterior.length !== actualizado.length) {
    return false;
  }

  const anterioresPorId = new Map(
    anterior.map((item) => [item.id, item])
  );

  return actualizado.every((item) => {
    const anteriorItem = anterioresPorId.get(item.id);

    return (
      anteriorItem !== undefined &&
      anteriorItem.cantidad === item.cantidad &&
      anteriorItem.precio === item.precio &&
      anteriorItem.nombre === item.nombre
    );
  });
}

function CheckoutPage() {
  const navigate = useNavigate();
  const [estadoInicial] = useState(leerCarritoInicial);
  const [carrito, setCarrito] = useState<CartItem[]>(
    estadoInicial.carrito
  );
  const [datosForm, setDatosForm] = useState<DatosCompra>({
    direccion: '',
    referencia: '',
    metodoPago: 'efectivo',
  });
  const [errores, setErrores] = useState<Errores>(() =>
    estadoInicial.error ? { general: estadoInicial.error } : {}
  );
  const [aviso, setAviso] = useState('');
  const [stockValidado, setStockValidado] = useState(false);
  const [verificando, setVerificando] = useState(
    !estadoInicial.error && estadoInicial.carrito.length > 0
  );
  const [procesando, setProcesando] = useState(false);
  const enviando = useRef(false);
  const autenticado = Boolean(session());

  useEffect(() => {
    if (
      !autenticado ||
      estadoInicial.error ||
      estadoInicial.carrito.length === 0
    ) {
      return;
    }

    let activo = true;

    consultarCarritoActualizado()
      .then((itemsActualizados) => {
        if (!activo) return;

        setCarrito(itemsActualizados);
        setStockValidado(true);

        if (!mismoResumen(estadoInicial.carrito, itemsActualizados)) {
          setAviso(
            'Actualizamos los productos y precios. Revisa el resumen antes de confirmar.'
          );
        }
      })
      .catch((error: unknown) => {
        if (!activo) return;

        setErrores({ general: mensajeErrorCreacion(error) });
        setStockValidado(false);
      })
      .finally(() => {
        if (activo) setVerificando(false);
      });

    return () => {
      activo = false;
    };
  }, [autenticado, estadoInicial]);

  const { subtotal, envio, total } = calcularTotales(carrito);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setDatosForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmarPedido = async (event: React.FormEvent) => {
    event.preventDefault();

    if (enviando.current || !stockValidado || verificando) {
      return;
    }

    if (carrito.length === 0) {
      setErrores({
        general:
          'Tu carrito está vacío. Agrega productos antes de continuar.',
      });
      return;
    }

    const nuevosErrores = validar(datosForm);
    setErrores(nuevosErrores);
    setAviso('');

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    enviando.current = true;
    setProcesando(true);

    let pedidoRegistrado = false;

    try {
      const carritoActualizado = await consultarCarritoActualizado();
      setCarrito(carritoActualizado);

      if (!mismoResumen(carrito, carritoActualizado)) {
        setAviso(
          'El carrito o los precios cambiaron. Revisa el resumen actualizado y vuelve a confirmar.'
        );
        return;
      }

      const pedidoCreado = await crearPedido({
        direccion: datosForm.direccion.trim(),
        referencia: datosForm.referencia?.trim() || undefined,
        metodoPago: datosForm.metodoPago,
      });

      pedidoRegistrado = true;

      navigate(`/pedidos/${pedidoCreado.id}`, {
        state: { recienCreado: true },
      });
    } catch (error) {
      setErrores({ general: mensajeErrorCreacion(error) });
    } finally {
      if (!pedidoRegistrado) {
        setProcesando(false);
        enviando.current = false;
      }
    }
  };

  const claseInput = (campo: keyof Errores, base: string) =>
    `${base} ${errores[campo] ? 'is-invalid' : ''}`;

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mt-4 mb-5">
      <p className="alert alert-info">
        Pago simulado: no se realizan cobros reales ni se solicitan
        datos bancarios. Los precios incluyen IGV, sin recargo adicional.
      </p>

      <div className="border-bottom pb-3 mb-4">
        <span className="text-success text-uppercase small fw-bold d-block mb-1">
          Paso final
        </span>
        <h2 className="fw-bold text-dark mb-0">Finalizar compra</h2>
      </div>

      {verificando && (
        <div className="alert alert-info" role="status">
          Verificando los precios y el stock del carrito...
        </div>
      )}

      {aviso && (
        <div className="alert alert-warning" role="status">
          {aviso}
        </div>
      )}

      {errores.general && (
        <div className="alert alert-danger" role="alert">
          <p className="mb-2">{errores.general}</p>
          <Link to="/carrito" className="alert-link">
            Revisar carrito
          </Link>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border rounded-4 shadow-sm overflow-hidden">
            <div className="card-header bg-dark text-white border-0 py-3 px-4">
              <h5 className="card-title mb-0 fs-6 fw-bold">
                Datos de envío y pago
              </h5>
            </div>

            <div className="card-body p-4">
              <form
                id="checkout-form"
                onSubmit={handleConfirmarPedido}
                noValidate
              >
                <fieldset disabled={procesando}>
                  <div className="mb-4">
                    <label
                      htmlFor="direccion"
                      className="form-label fw-semibold text-secondary small text-uppercase"
                    >
                      Dirección de entrega{' '}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      id="direccion"
                      type="text"
                      name="direccion"
                      maxLength={255}
                      className={claseInput(
                        'direccion',
                        'form-control form-control-lg border-2 rounded-3 fs-6'
                      )}
                      placeholder="Calle, número, departamento, distrito..."
                      value={datosForm.direccion}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(errores.direccion)}
                      aria-describedby={
                        errores.direccion ? 'direccion-error' : undefined
                      }
                    />
                    <div
                      id="direccion-error"
                      className="invalid-feedback"
                    >
                      {errores.direccion}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="referencia"
                      className="form-label fw-semibold text-secondary small text-uppercase"
                    >
                      Referencia (opcional)
                    </label>
                    <input
                      id="referencia"
                      type="text"
                      name="referencia"
                      maxLength={255}
                      className="form-control border-2 rounded-3 fs-6"
                      placeholder="Ej: Frente al parque principal"
                      value={datosForm.referencia ?? ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="metodoPago"
                      className="form-label fw-semibold text-secondary small text-uppercase"
                    >
                      Método de pago
                    </label>
                    <select
                      id="metodoPago"
                      name="metodoPago"
                      className="form-select form-select-lg border-2 rounded-3 fs-6"
                      value={datosForm.metodoPago}
                      onChange={handleInputChange}
                    >
                      {(
                        Object.keys(METODO_PAGO_LABELS) as MetodoPago[]
                      ).map((metodo) => (
                        <option key={metodo} value={metodo}>
                          {METODO_PAGO_LABELS[metodo]}
                        </option>
                      ))}
                    </select>
                  </div>
                </fieldset>

                <p className="alert alert-info mb-0">
                  Todos los métodos de pago son simulados. No ingreses
                  datos de tarjeta ni información bancaria.
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border rounded-4 shadow-sm overflow-hidden">
            <div className="card-header bg-light border-bottom py-3 px-4">
              <h5 className="card-title text-dark mb-0 fs-6 fw-bold">
                Resumen del pedido
              </h5>
            </div>

            <div className="card-body p-4">
              {carrito.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <p className="mb-3">
                    No hay productos en tu carrito.
                  </p>
                  <Link
                    to="/productos"
                    className="btn btn-outline-primary btn-sm rounded-pill px-3"
                  >
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
                          <span className="fw-semibold text-dark d-block">
                            {item.nombre}
                          </span>
                          <small className="text-muted">
                            {stockValidado
                              ? `${formatPrecio(item.precio)} x ${item.cantidad}`
                              : `Cantidad: ${item.cantidad}`}
                          </small>
                        </div>

                        <span className="fw-bold text-dark">
                          {stockValidado
                            ? formatPrecio(
                                calcularTotales([item]).subtotal
                              )
                            : 'Por confirmar'}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-light p-3 rounded-4 border mb-4">
                    <div className="d-flex justify-content-between mb-2 small text-secondary">
                      <span>Productos (IGV incluido):</span>
                      <span>
                        {stockValidado
                          ? formatPrecio(subtotal)
                          : 'Por confirmar'}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between mb-3 pb-2 border-bottom small text-secondary">
                      <span>Envío:</span>
                      <span>
                        {stockValidado
                          ? formatPrecio(envio)
                          : 'Por confirmar'}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center fw-bold">
                      <span className="fs-5 text-dark">Total:</span>
                      <span className="fs-5 text-success">
                        {stockValidado
                          ? formatPrecio(total)
                          : 'Por confirmar'}
                      </span>
                    </div>

                    <p className="small text-muted mt-3 mb-0">
                      El backend vuelve a validar los precios y el
                      stock al registrar el pedido.
                    </p>
                  </div>

                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={
                      procesando || verificando || !stockValidado
                    }
                    className="btn btn-success w-100 py-3 fs-5 fw-bold rounded-3 shadow"
                  >
                    {procesando ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Registrando pedido...
                      </>
                    ) : (
                      'Crear pedido'
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