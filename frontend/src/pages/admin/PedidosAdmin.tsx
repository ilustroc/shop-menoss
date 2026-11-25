import { Fragment, useCallback, useEffect, useState } from 'react';
import type { EstadoPedido } from '../../types/pedido';
import type { AdminPedidoDetalle, AdminPedidoResumen } from '../../types/adminPedido';
import {
  cambiarEstadoPedido,
  listarPedidos,
  mensajeError,
  obtenerPedido,
} from '../../services/pedidoAdminService';
import {
  ESTADO_BADGE_CLASS,
  ESTADO_LABELS,
  METODO_PAGO_LABELS,
  formatFecha,
  formatPrecio,
} from '../../services/pedidosService';

const ESTADOS: EstadoPedido[] = ['pendiente', 'confirmado', 'preparando', 'entregado', 'cancelado'];

// Mismas reglas que ReglasEstadoPedido.java (el backend vuelve a validarlas).
const SIGUIENTES: Record<EstadoPedido, EstadoPedido[]> = {
  pendiente: ['confirmado', 'cancelado'],
  confirmado: ['preparando', 'cancelado'],
  preparando: ['entregado', 'cancelado'],
  entregado: [],
  cancelado: [],
};

function PedidosAdmin() {
  const [pedidos, setPedidos] = useState<AdminPedidoResumen[]>([]);
  const [filtro, setFiltro] = useState<EstadoPedido | ''>('');
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [abierto, setAbierto] = useState<string | null>(null);
  const [detalle, setDetalle] = useState<AdminPedidoDetalle | null>(null);

  const cargar = useCallback(async (estado: EstadoPedido | '') => {
    setCargando(true);
    setError('');
    try {
      setPedidos(await listarPedidos(estado || undefined));
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga inicial y cada vez que cambia el filtro
  useEffect(() => {
    let activo = true;
    listarPedidos(filtro || undefined)
      .then((datos) => activo && setPedidos(datos))
      .catch((e) => activo && setError(mensajeError(e)))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, [filtro]);

  const cambiarFiltro = (estado: EstadoPedido | '') => {
    setCargando(true);
    setError('');
    setAbierto(null);
    setFiltro(estado);
  };

  const verDetalle = async (id: string) => {
    if (abierto === id) {
      setAbierto(null);
      return;
    }
    setAbierto(id);
    setDetalle(null);
    try {
      setDetalle(await obtenerPedido(id));
    } catch (e) {
      setError(mensajeError(e));
      setAbierto(null);
    }
  };

  const cambiar = async (pedido: AdminPedidoResumen, estado: EstadoPedido) => {
    if (
      estado === 'cancelado' &&
      !window.confirm(`¿Cancelar el pedido #${pedido.id}? Se devolverá el stock de sus productos.`)
    ) {
      return;
    }

    setProcesando(pedido.id);
    setError('');
    setAviso('');
    try {
      const actualizado = await cambiarEstadoPedido(pedido.id, estado);
      setPedidos((lista) =>
        lista.map((p) => (p.id === pedido.id ? { ...p, estado: actualizado.estado } : p)),
      );
      if (abierto === pedido.id) setDetalle(actualizado);
      setAviso(
        `Pedido #${pedido.id} actualizado a "${ESTADO_LABELS[actualizado.estado]}".` +
          (estado === 'cancelado' ? ' El stock fue devuelto al inventario.' : ''),
      );
      if (filtro && filtro !== actualizado.estado) await cargar(filtro);
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setProcesando(null);
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="mb-0">Pedidos</h2>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="filtro-estado" className="small text-muted mb-0">Estado:</label>
          <select
            id="filtro-estado"
            className="form-select form-select-sm w-auto"
            value={filtro}
            onChange={(e) => cambiarFiltro(e.target.value as EstadoPedido | '')}
          >
            <option value="">Todos</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
            ))}
          </select>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => void cargar(filtro)} disabled={cargando}>
            Actualizar
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {aviso && <div className="alert alert-success" role="status">{aviso}</div>}

      {cargando ? (
        <p className="text-muted">Cargando pedidos…</p>
      ) : pedidos.length === 0 && !error ? (
        <div className="alert alert-light border">No hay pedidos{filtro && ` en estado "${ESTADO_LABELS[filtro]}"`}.</div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Pedido</th><th>Fecha</th><th>Pago</th><th className="text-end">Productos</th>
                <th className="text-end">Total</th><th>Estado</th><th>Cambiar a</th><th></th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => {
                const siguientes = SIGUIENTES[p.estado];
                return (
                  <Fragment key={p.id}>
                    <tr>
                      <td>#{p.id}</td>
                      <td>{p.fecha ? formatFecha(p.fecha) : '—'}</td>
                      <td>{METODO_PAGO_LABELS[p.metodoPago] ?? p.metodoPago}</td>
                      <td className="text-end">{p.cantidadProductos}</td>
                      <td className="text-end">{formatPrecio(p.total)}</td>
                      <td><span className={`badge ${ESTADO_BADGE_CLASS[p.estado]}`}>{ESTADO_LABELS[p.estado]}</span></td>
                      <td>
                        {siguientes.length === 0 ? (
                          <span className="small text-muted">Estado final</span>
                        ) : (
                          <select
                            className="form-select form-select-sm"
                            value=""
                            disabled={procesando === p.id}
                            onChange={(e) => void cambiar(p, e.target.value as EstadoPedido)}
                            aria-label={`Cambiar estado del pedido ${p.id}`}
                          >
                            <option value="" disabled>{procesando === p.id ? 'Guardando…' : 'Elegir…'}</option>
                            {siguientes.map((e) => (
                              <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => void verDetalle(p.id)}>
                          {abierto === p.id ? 'Ocultar' : 'Ver detalle'}
                        </button>
                      </td>
                    </tr>
                    {abierto === p.id && (
                      <tr>
                        <td colSpan={8} className="bg-light">
                          {!detalle ? (
                            <span className="text-muted">Cargando detalle…</span>
                          ) : (
                            <>
                              <div className="mb-2">
                                <strong>Dirección:</strong> {detalle.direccion}
                                {detalle.referencia && <> ({detalle.referencia})</>}
                              </div>
                              <ul className="mb-2">
                                {detalle.detalles.map((d) => (
                                  <li key={d.productoId}>
                                    {d.cantidad} x {d.nombre} — {formatPrecio(d.precioUnitario * d.cantidad)}
                                  </li>
                                ))}
                              </ul>
                              <div className="text-muted">
                                Subtotal {formatPrecio(detalle.subtotal)} · Envío {formatPrecio(detalle.envio)} · Total {formatPrecio(detalle.total)}
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default PedidosAdmin;