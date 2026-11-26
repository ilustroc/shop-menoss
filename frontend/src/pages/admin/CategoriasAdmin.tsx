import { useEffect, useRef, useState } from "react";
import type { Categoria, CategoriaRequest } from "../../types/categoria";
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../../services/categoriaService";
import CategoriaForm from "../../components/admin/CategoriaForm";
import ConfirmModal from "../../components/admin/ConfirmModal";
import Notificacion from "../../components/admin/Notificacion";

interface Aviso {
  id: number;
  tipo: "exito" | "error";
  mensaje: string;
}

// api.ts ya normaliza el mensaje de error (401, 403, { error }, validaciones, sin conexión).
const mensajeDe = (e: unknown) =>
  e instanceof Error ? e.message : "No se pudo completar la operación.";

function CategoriasAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [porEliminar, setPorEliminar] = useState<Categoria | null>(null);
  const [ocupado, setOcupado] = useState(false);
  // El ref bloquea al instante un segundo clic; el estado solo deshabilita los controles.
  const ocupadoRef = useRef(false);
  // Identifica cada aviso para que el temporizador de uno nuevo empiece de cero.
  const contadorAvisos = useRef(0);

  const mostrarAviso = (tipo: Aviso["tipo"], mensaje: string) => {
    contadorAvisos.current += 1;
    setAviso({ id: contadorAvisos.current, tipo, mensaje });
  };

  const ejecutar = async (accion: () => Promise<void>) => {
    if (ocupadoRef.current) return;
    ocupadoRef.current = true;
    setOcupado(true);
    try {
      await accion();
    } finally {
      ocupadoRef.current = false;
      setOcupado(false);
    }
  };

  const cargar = async () => {
    try {
      setCategorias(await listarCategorias());
      setErrorCarga(null);
    } catch (e) {
      setErrorCarga(mensajeDe(e));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void listarCategorias()
      .then(setCategorias)
      .catch((e) => setErrorCarga(mensajeDe(e)))
      .finally(() => setCargando(false));
  }, []);

  const reintentar = () => {
    setCargando(true);
    setErrorCarga(null);
    void cargar();
  };

  const cerrarForm = () => {
    setMostrarForm(false);
    setEditando(null);
  };

  const guardar = async (data: CategoriaRequest) => {
    try {
      if (editando) {
        await actualizarCategoria(editando.id, data);
        mostrarAviso("exito", "Categoría actualizada correctamente.");
      } else {
        await crearCategoria(data);
        mostrarAviso("exito", "Categoría creada correctamente.");
      }
      cerrarForm();
      await cargar();
    } catch (e) {
      // El formulario queda abierto para que el usuario corrija.
      mostrarAviso("error", mensajeDe(e));
    }
  };

  const confirmarEliminar = async () => {
    if (!porEliminar) return;
    try {
      await eliminarCategoria(porEliminar.id);
      mostrarAviso("exito", `Categoría "${porEliminar.nombre}" eliminada.`);
      await cargar();
    } catch (e) {
      // Ej.: 409 si la categoría tiene productos asociados.
      mostrarAviso("error", mensajeDe(e));
    } finally {
      setPorEliminar(null);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Categorías</h2>
        <button
          className="btn btn-primary"
          disabled={ocupado}
          onClick={() => {
            setEditando(null);
            setMostrarForm(true);
          }}
        >
          + Nueva categoría
        </button>
      </div>

      {mostrarForm && (
        <CategoriaForm
          key={editando?.id ?? "nueva"}
          inicial={editando}
          onGuardar={(data) => ejecutar(() => guardar(data))}
          onCancelar={cerrarForm}
        />
      )}

      {errorCarga ? (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>{errorCarga}</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={reintentar}
          >
            Reintentar
          </button>
        </div>
      ) : (
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
                        disabled={ocupado}
                        onClick={() => {
                          setEditando(c);
                          setMostrarForm(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        disabled={ocupado}
                        onClick={() => setPorEliminar(c)}
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
      )}

      {porEliminar && (
        <ConfirmModal
          titulo="Eliminar categoría"
          mensaje={`¿Seguro que deseas eliminar la categoría "${porEliminar.nombre}"? Esta acción no se puede deshacer.`}
          textoConfirmar="Eliminar"
          textoProcesando="Eliminando..."
          procesando={ocupado}
          onConfirmar={() => ejecutar(confirmarEliminar)}
          onCancelar={() => setPorEliminar(null)}
        />
      )}

      {aviso && (
        <Notificacion
          key={aviso.id}
          tipo={aviso.tipo}
          mensaje={aviso.mensaje}
          onCerrar={() => setAviso(null)}
        />
      )}
    </>
  );
}

export default CategoriasAdmin;
