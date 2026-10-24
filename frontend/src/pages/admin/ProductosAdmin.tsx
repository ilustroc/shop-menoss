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
    );
  }, []);

  const cerrarForm = () => {
    setMostrarForm(false);
    setEditando(null);
  };

  const guardar = async (data: Omit<Producto, 'id'>) => {
    if (editando) await actualizarProducto(editando.id, data);
    else await crearProducto(data);
    cerrarForm();
    cargar();
  };

  const borrar = async (p: Producto) => {
    if (!window.confirm(`¿Eliminar el producto "${p.nombre}"?`)) return;
    await eliminarProducto(p.id);
    cargar();
  };

  return (
    <>
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
          onGuardar={guardar}
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
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td className="text-end">S/ {p.precio.toFixed(2)}</td>
                <td className="text-end">{p.stock}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setEditando(p); setMostrarForm(true); }}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => borrar(p)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted">No hay productos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ProductosAdmin;