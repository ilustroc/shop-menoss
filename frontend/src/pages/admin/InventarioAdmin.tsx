import { useCallback, useEffect, useState } from "react";
import type { ItemInventario } from "../../types/inventario";
import {
  actualizarStock,
  esConflictoDeStock,
  listarInventario,
} from "../../services/inventarioService";
import { mensajeError } from "../../services/pedidoAdminService";

function InventarioAdmin() {
  const [items, setItems] = useState<ItemInventario[]>([]);
  const [soloBajo, setSoloBajo] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [editando, setEditando] = useState<Record<number, string>>({});

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setItems(await listarInventario());
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    let activo = true;
    listarInventario()
      .then((datos) => activo && setItems(datos))
      .catch((e) => activo && setError(mensajeError(e)))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  const guardar = async (item: ItemInventario, nuevoStock: number) => {
    if (!Number.isInteger(nuevoStock) || nuevoStock < 0) {
      setError("El stock debe ser un número entero mayor o igual a 0.");
      return;
    }
    setProcesando(item.productoId);
    setError("");
    setAviso("");
    try {
      // Se envía el stock que se estaba viendo para no pisar compras hechas mientras tanto
      const actualizado = await actualizarStock(
        item.productoId,
        nuevoStock,
        item.stock,
      );
      setItems((lista) =>
        lista.map((i) => (i.productoId === item.productoId ? actualizado : i)),
      );
      setEditando((valores) => {
        const copia = { ...valores };
        delete copia[item.productoId];
        return copia;
      });
    } catch (e) {
      setError(mensajeError(e));
      if (esConflictoDeStock(e)) {
        setAviso("Se recargó el inventario con los valores actuales.");
        await cargar();
      }
    } finally {
      setProcesando(null);
    }
  };

  const visibles = soloBajo ? items.filter((i) => i.stockBajo) : items;
  const totalBajo = items.filter((i) => i.stockBajo).length;

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="mb-0">Inventario</h2>
        <div className="d-flex align-items-center gap-3">
          <div className="form-check mb-0">
            <input
              id="solo-bajo"
              className="form-check-input"
              type="checkbox"
              checked={soloBajo}
              onChange={(e) => setSoloBajo(e.target.checked)}
            />
            <label htmlFor="solo-bajo" className="form-check-label small">
              Solo stock bajo ({totalBajo})
            </label>
          </div>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              setError("");
              setAviso("");
              void cargar();
            }}
            disabled={cargando}
          >
            Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {aviso && (
        <div className="alert alert-info" role="status">
          {aviso}
        </div>
      )}

      {cargando ? (
        <p className="text-muted">Cargando inventario…</p>
      ) : visibles.length === 0 && !error ? (
        <div className="alert alert-light border">
          {soloBajo
            ? "No hay productos con stock bajo."
            : "No hay productos registrados."}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="text-end">Stock</th>
                <th>Estado</th>
                <th className="text-end">Ajustar</th>
                <th className="text-end">Fijar stock</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((item) => {
                const ocupado = procesando === item.productoId;
                const valor = editando[item.productoId] ?? "";
                return (
                  <tr key={item.productoId}>
                    <td>{item.nombre}</td>
                    <td className="text-end">{item.stock}</td>
                    <td>
                      {item.stock === 0 ? (
                        <span className="badge bg-danger">Agotado</span>
                      ) : item.stockBajo ? (
                        <span className="badge bg-warning text-dark">
                          Stock bajo
                        </span>
                      ) : (
                        <span className="badge bg-success">Disponible</span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        {[-10, -1, 1, 10].map((delta) => (
                          <button
                            key={delta}
                            className="btn btn-outline-secondary"
                            disabled={
                              procesando !== null || item.stock + delta < 0
                            }
                            onClick={() =>
                              void guardar(item, item.stock + delta)
                            }
                          >
                            {delta > 0 ? `+${delta}` : delta}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="text-end">
                      <form
                        className="d-inline-flex gap-1"
                        onSubmit={(e) => {
                          e.preventDefault();
                          void guardar(item, Number(valor));
                        }}
                      >
                        <input
                          type="number"
                          min={0}
                          className="form-control form-control-sm"
                          style={{ width: 90 }}
                          placeholder={String(item.stock)}
                          value={valor}
                          disabled={ocupado}
                          aria-label={`Nuevo stock de ${item.nombre}`}
                          onChange={(e) =>
                            setEditando((m) => ({
                              ...m,
                              [item.productoId]: e.target.value,
                            }))
                          }
                        />
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={procesando !== null || valor === ""}
                        >
                          {ocupado ? "…" : "Guardar"}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default InventarioAdmin;
