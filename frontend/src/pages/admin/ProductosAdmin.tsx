import { useEffect, useState } from 'react';
import type { Producto } from '../../types/producto';
import type { Categoria } from '../../types/categoria';
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../../services/productoService';
import { listarCategorias } from '../../services/categoriaService';
import ProductoForm from '../../components/admin/ProductoForm';

function ProductosAdmin() {
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
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);

  const cargar = async () => {
    setProductos(await listarProductos());
    setCategorias(await listarCategorias());
  };

  useEffect(() => {
    void Promise.all([listarProductos(), listarCategorias()]).then(
      ([productosCargados, categoriasCargadas]) => {
        setProductos(productosCargados);
        setCategorias(categoriasCargadas);
      }
    ).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  }, []);

  const cerrarForm = () => {
    setMostrarForm(false);
    setEditando(null);
  };

  const guardar = async (data: Omit<Producto, 'id'>) => {
    if (editando) await actualizarProducto(editando.id, data);
    else await crearProducto(data);
    cerrarForm();
    await cargar();
  };

  const borrar = async (p: Producto) => {
    if (!window.confirm(`¿Desactivar el producto "${p.nombre}" del catálogo?`)) return;
    await eliminarProducto(p.id);
    await cargar();
  };

  return (
    <fieldset disabled={busy || loading}>
      {(busy || loading) && <p>{loading ? 'Cargando datos…' : 'Procesando…'}</p>}
      {error && <div role="alert" className="alert alert-danger">{error} <button onClick={()=>window.location.reload()}>Reintentar</button></div>}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Productos</h2>
        <button className="btn btn-primary" onClick={() => { setEditando(null); setMostrarForm(true); }}>
          + Nuevo producto
        </button>
      </div>

      {mostrarForm && (
        <ProductoForm
          key={editando?.id ?? 'nuevo'}
          inicial={editando}
          categorias={categorias}
          onGuardar={data => ejecutar(() => guardar(data))}
          onCancelar={cerrarForm}
        />
      )}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Categoría</th>
              <th className="text-end">Precio</th><th className="text-end">Stock</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre} {p.activo === false && <span className="badge bg-secondary">Inactivo</span>}</td>
                <td>{p.categoria}</td>
                <td className="text-end">S/ {p.precio.toFixed(2)}</td>
                <td className="text-end">{p.stock}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setEditando(p); setMostrarForm(true); }}>Editar</button>
                  <button disabled={p.activo === false} className="btn btn-sm btn-outline-danger" onClick={() => ejecutar(() => borrar(p))}>Desactivar</button>
                </td>
              </tr>
            ))}
            {!loading && !error && productos.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted">No hay productos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </fieldset>
  );
}

export default ProductosAdmin;
