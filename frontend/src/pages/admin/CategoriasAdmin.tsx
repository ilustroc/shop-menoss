import { useEffect, useState } from 'react';
import type { Categoria } from '../../types/categoria';
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '../../services/categoriaService';
import CategoriaForm from '../../components/admin/CategoriaForm';

function CategoriasAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);

  const cargar = async () => setCategorias(await listarCategorias());

  useEffect(() => {
    void listarCategorias().then(setCategorias);
  }, []);

  const cerrarForm = () => {
    setMostrarForm(false);
    setEditando(null);
  };

  const guardar = async (data: Omit<Categoria, 'id'>) => {
    if (editando) await actualizarCategoria(editando.id, data);
    else await crearCategoria(data);
    cerrarForm();
    cargar();
  };

  const borrar = async (c: Categoria) => {
    if (!window.confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    await eliminarCategoria(c.id);
    cargar();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Categorías</h2>
        <button className="btn btn-primary" onClick={() => { setEditando(null); setMostrarForm(true); }}>
          + Nueva categoría
        </button>
      </div>

      {mostrarForm && (
        <CategoriaForm key={editando?.id ?? 'nueva'} inicial={editando} onGuardar={guardar} onCancelar={cerrarForm} />
      )}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Descripción</th><th className="text-end">Acciones</th></tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nombre}</td>
                <td>{c.descripcion}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setEditando(c); setMostrarForm(true); }}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => borrar(c)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {categorias.length === 0 && (
              <tr><td colSpan={4} className="text-center text-muted">No hay categorías.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CategoriasAdmin;