import { useEffect, useState } from "react";
import type { Categoria, CategoriaRequest } from "../../types/categoria";
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../../services/categoriaService";
import { obtenerMensajeError } from "../../utils/errores";
import CategoriaForm from "../../components/admin/CategoriaForm";

function CategoriasAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    try {
      setCategorias(await listarCategorias());
    } catch (e) {
      setError(obtenerMensajeError(e));
    }
  };

  useEffect(() => {
    void listarCategorias()
      .then(setCategorias)
      .catch((e) => setError(obtenerMensajeError(e)))
      .finally(() => setCargando(false));
  }, []);

  const cerrarForm = () => {
    setMostrarForm(false);
    setEditando(null);
  };

  const guardar = async (data: CategoriaRequest) => {
    setError(null);
    try {
      if (editando) await actualizarCategoria(editando.id, data);
      else await crearCategoria(data);
      cerrarForm();
      await cargar();
    } catch (e) {
      // El formulario queda abierto para que el usuario corrija.
      setError(obtenerMensajeError(e));
    }
  };

  const borrar = async (c: Categoria) => {
    if (!window.confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    setError(null);
    try {
      await eliminarCategoria(c.id);
      await cargar();
    } catch (e) {
      // Ej.: 409 si la categoría tiene productos asociados.
      setError(obtenerMensajeError(e));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Categorías</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditando(null);
            setMostrarForm(true);
          }}
        >
          + Nueva categoría
        </button>
      </div>

      {error && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar"
            onClick={() => setError(null)}
          />
        </div>
      )}

      {mostrarForm && (
        <CategoriaForm
          key={editando?.id ?? "nueva"}
          inicial={editando}
          onGuardar={guardar}
          onCancelar={cerrarForm}
        />
      )}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  Cargando categorías...
                </td>
              </tr>
            )}
            {!cargando &&
              categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td>{c.descripcion}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => {
                        setEditando(c);
                        setMostrarForm(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => borrar(c)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            {!cargando && categorias.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  No hay categorías.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CategoriasAdmin;
