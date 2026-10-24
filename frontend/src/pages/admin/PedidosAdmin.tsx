import { Fragment, useEffect, useState } from 'react';
import type { EstadoPedido, Pedido } from '../../types/pedido';
import { listarPedidos, cambiarEstadoPedido } from '../../services/pedidoAdminService';

const ESTADOS: EstadoPedido[] = ['pendiente', 'confirmado', 'preparando', 'entregado', 'cancelado'];

function PedidosAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [abierto, setAbierto] = useState<string | null>(null);

  const cargar = async () => setPedidos(await listarPedidos());

  useEffect(() => {
    void listarPedidos().then(setPedidos);
  }, []);

  const cambiar = async (id: string, estado: EstadoPedido) => {
    await cambiarEstadoPedido(id, estado);
    cargar();
  };

  return (
    <>
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
                      onChange={(e) => cambiar(p.id, e.target.value as EstadoPedido)}
                    >
                      {ESTADOS.map((e) => (
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
                        Subtotal S/ {p.subtotal.toFixed(2)} · IGV S/ {p.igv.toFixed(2)} · Total S/ {p.total.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PedidosAdmin;