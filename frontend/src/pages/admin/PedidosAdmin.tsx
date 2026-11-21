import { Fragment, useEffect, useState } from 'react';
import type { EstadoPedido, Pedido } from '../../types/pedido';
import { listarPedidos, cambiarEstadoPedido } from '../../services/pedidoAdminService';

const SIGUIENTES: Record<EstadoPedido, EstadoPedido[]> = {pendiente:['confirmado','cancelado'],confirmado:['preparando','cancelado'],preparando:['entregado','cancelado'],entregado:[],cancelado:[]};

function PedidosAdmin() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  async function ejecutar(action: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true); setError('');
    try { await action(); } catch(e) { setError(e instanceof Error ? e.message : 'No se pudo completar'); }
    finally { setBusy(false); }
  }
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [abierto, setAbierto] = useState<string | null>(null);

  const cargar = async () => setPedidos(await listarPedidos());

  useEffect(() => {
    void listarPedidos().then(setPedidos).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  }, []);

  const cambiar = async (id: string, estado: EstadoPedido) => {
    await cambiarEstadoPedido(id, estado);
    await cargar();
  };

  return (
    <fieldset disabled={busy || loading}>
      {(busy || loading) && <p>{loading ? 'Cargando datos…' : 'Procesando…'}</p>}
      {error && <div role="alert" className="alert alert-danger">{error} <button onClick={()=>window.location.reload()}>Reintentar</button></div>}
      <h2 className="mb-3">Pedidos</h2>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Pedido</th><th>Fecha</th><th>Pago</th>
              <th className="text-end">Total</th><th>Estado</th><th></th>
            </tr>
          </thead>
          <tbody>
            {!loading && !error && pedidos.length === 0 && <tr><td colSpan={6}>No hay pedidos registrados.</td></tr>}
            {pedidos.map((p) => (
              <Fragment key={p.id}>
                <tr>
                  <td>{p.id}</td>
                  <td>{p.fecha}</td>
                  <td className="text-capitalize">{p.metodoPago}</td>
                  <td className="text-end">S/ {p.total.toFixed(2)}</td>
                  <td>
                    <select
                      className="form-select form-select-sm text-capitalize"
                      value={p.estado}
                      onChange={(e) => ejecutar(() => cambiar(p.id, e.target.value as EstadoPedido))}
                    >
                      {[p.estado,...SIGUIENTES[p.estado]].map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setAbierto(abierto === p.id ? null : p.id)}>
                      {abierto === p.id ? 'Ocultar' : 'Ver detalle'}
                    </button>
                  </td>
                </tr>
                {abierto === p.id && (
                  <tr>
                    <td colSpan={6} className="bg-light">
                      <div className="mb-2">
                        <strong>Dirección:</strong> {p.direccion}
                        {p.referencia && <> ({p.referencia})</>}
                      </div>
                      <ul className="mb-2">
                        {p.detalles.map((d) => (
                          <li key={d.productoId}>
                            {d.cantidad} x {d.nombre} — S/ {(d.precioUnitario * d.cantidad).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                      <div className="text-muted">
                        Productos S/ {p.subtotal.toFixed(2)} · Envío S/ {p.envio.toFixed(2)} · Total S/ {p.total.toFixed(2)} · Pago simulado
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </fieldset>
  );
}

export default PedidosAdmin;
