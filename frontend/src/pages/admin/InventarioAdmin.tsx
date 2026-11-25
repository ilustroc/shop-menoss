import { useEffect, useState } from 'react';
import type { Producto } from '../../types/producto';
import { listarProductos, ajustarStock } from '../../services/productoService';

const STOCK_BAJO = 5;

function InventarioAdmin() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  async function ejecutar(action: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true); setError('');
    try { await action(); } catch(e) { setError(e instanceof Error ? e.message : 'No se pudo completar'); }
    finally { setBusy(false); }
  }
  const [productos, setProductos] = useState<Producto[]>([]);

  const cargar = async () => setProductos(await listarProductos());

  useEffect(() => {
    void listarProductos().then(setProductos).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  }, []);

  const ajustar = async (id: number, delta: number) => {
    await ajustarStock(id, delta);
    await cargar();
  };

  return (
    <fieldset disabled={busy || loading}>
      {(busy || loading) && <p>{loading ? 'Cargando datos…' : 'Procesando…'}</p>}
      {error && <div role="alert" className="alert alert-danger">{error} <button onClick={()=>window.location.reload()}>Reintentar</button></div>}
      <h2 className="mb-3">Inventario</h2>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Producto</th><th>Categoría</th>
              <th className="text-end">Stock</th><th>Estado</th>
              <th className="text-end">Ajustar</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !error && productos.length === 0 && <tr><td colSpan={5}>No hay productos registrados.</td></tr>}
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td className="text-end">{p.stock}</td>
                <td>
                  {p.stock === 0 ? (
                    <span className="badge bg-danger">Agotado</span>
                  ) : p.stock <= STOCK_BAJO ? (
                    <span className="badge bg-warning text-dark">Stock bajo</span>
                  ) : (
                    <span className="badge bg-success">Disponible</span>
                  )}
                </td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-secondary" onClick={() => ejecutar(() => ajustar(p.id, -10))}>-10</button>
                    <button className="btn btn-outline-secondary" onClick={() => ejecutar(() => ajustar(p.id, -1))}>-1</button>
                    <button className="btn btn-outline-secondary" onClick={() => ejecutar(() => ajustar(p.id, 1))}>+1</button>
                    <button className="btn btn-outline-secondary" onClick={() => ejecutar(() => ajustar(p.id, 10))}>+10</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </fieldset>
  );
}

export default InventarioAdmin;
