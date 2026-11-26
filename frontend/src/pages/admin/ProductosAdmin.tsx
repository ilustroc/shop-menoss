import { useEffect, useRef, useState } from "react";
import type { Categoria } from "../../types/categoria";
import {
  actualizarProducto,
  aInput,
  crearProducto,
  eliminarProducto,
  listarProductos,
  type ProductoAdmin,
  type ProductoInput,
} from "../../services/productoService";
import { listarCategorias } from "../../services/categoriaService";
import ProductoForm from "../../components/admin/ProductoForm";
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

function ProductosAdmin() {
  const [productos, setProductos] = useState<ProductoAdmin[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<ProductoAdmin | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [porDesactivar, setPorDesactivar] = useState<ProductoAdmin | null>(
    null,
  );
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
      const [productosCargados, categoriasCargadas] = await Promise.all([
        listarProductos(true),
        listarCategorias(),
      ]);
      setProductos(productosCargados);
      setCategorias(categoriasCargadas);
      setErrorCarga(null);
    } catch (e) {
      setErrorCarga(mensajeDe(e));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void Promise.all([listarProductos(true), listarCategorias()])
      .then(([productosCargados, categoriasCargadas]) => {
        setProductos(productosCargados);
        setCategorias(categoriasCargadas);
      })
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

  const guardar = async (data: ProductoInput) => {
    try {
      if (editando) {
        await actualizarProducto(editando.id, data);
        mostrarAviso("exito", "Producto actualizado correctamente.");
      } else {
        await crearProducto(data);
        mostrarAviso("exito", "Producto creado correctamente.");
      }
      cerrarForm();
      await cargar();
    } catch (e) {
      // El formulario queda abierto para que el usuario corrija.
      mostrarAviso("error", mensajeDe(e));
    }
  };

  const confirmarDesactivar = async () => {
    if (!porDesactivar) return;
    try {
      await eliminarProducto(porDesactivar.id);
      mostrarAviso(
        "exito",
        `Producto "${porDesactivar.nombre}" desactivado. Puedes reactivarlo cuando quieras.`,
      );
      await cargar();
    } catch (e) {
      mostrarAviso("error", mensajeDe(e));
    } finally {
      setPorDesactivar(null);
    }
  };

  const reactivar = async (p: ProductoAdmin) => {
    try {
      // Sin stock en el cuerpo: el backend conserva el valor actual.
      await actualizarProducto(p.id, { ...aInput(p), activo: true });
      mostrarAviso("exito", `Producto "${p.nombre}" reactivado.`);
      await cargar();
    } catch (e) {
      mostrarAviso("error", mensajeDe(e));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Productos</h2>
        <button
          className="btn btn-primary"
          disabled={ocupado}
          onClick={() => {
            setEditando(null);
            setMostrarForm(true);
          }}
        >
          + Nuevo producto
        </button>
      </div>

      {mostrarForm && (
        <ProductoForm
          key={editando?.id ?? "nuevo"}
          inicial={editando}
          categorias={categorias}
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
                <th>Categoría</th>
                <th className="text-end">Precio</th>
                <th className="text-end">Stock</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando && (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    Cargando productos...
                  </td>
                </tr>
              )}
              {!cargando &&
                productos.map((p) => (
                  <tr key={p.id} className={p.activo ? "" : "text-muted"}>
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td className="text-end">S/ {p.precio.toFixed(2)}</td>
                    <td className="text-end">{p.stock}</td>
                    <td>
                      <span
                        className={`badge ${p.activo ? "bg-success" : "bg-secondary"}`}
                      >
                        {p.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        disabled={ocupado}
                        onClick={() => {
                          setEditando(p);
                          setMostrarForm(true);
                        }}
                      >
                        Editar
                      </button>
                      {p.activo ? (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={ocupado}
                          onClick={() => setPorDesactivar(p)}
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-success"
                          disabled={ocupado}
                          onClick={() => ejecutar(() => reactivar(p))}
                        >
                          Reactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              {!cargando && productos.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    No hay productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {porDesactivar && (
        <ConfirmModal
          titulo="Desactivar producto"
          mensaje={`¿Desactivar "${porDesactivar.nombre}"? Dejará de mostrarse en el catálogo, pero se conserva su historial y podrás reactivarlo.`}
          textoConfirmar="Desactivar"
          textoProcesando="Desactivando..."
          procesando={ocupado}
          onConfirmar={() => ejecutar(confirmarDesactivar)}
          onCancelar={() => setPorDesactivar(null)}
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

export default ProductosAdmin;
