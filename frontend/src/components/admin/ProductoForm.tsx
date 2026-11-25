import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import type { Categoria } from "../../types/categoria";
import type {
  ProductoAdmin,
  ProductoInput,
} from "../../services/productoService";

interface Props {
  inicial?: ProductoAdmin | null;
  categorias: Categoria[];
  onGuardar: (data: ProductoInput) => Promise<void>;
  onCancelar: () => void;
}

function ProductoForm({ inicial, categorias, onGuardar, onCancelar }: Props) {
  const editando = Boolean(inicial);
  const sinCategorias = categorias.length === 0;

  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? "");
  const [precio, setPrecio] = useState(inicial ? String(inicial.precio) : "");
  const [stock, setStock] = useState(inicial ? String(inicial.stock) : "0");
  const [imagen, setImagen] = useState(
    inicial && !inicial.imagen.endsWith("placeholder.png")
      ? inicial.imagen
      : "",
  );
  const [categoriaId, setCategoriaId] = useState(
    String(inicial?.categoriaId ?? categorias[0]?.id ?? ""),
  );
  const [activo, setActivo] = useState(inicial?.activo ?? true);
  const [guardando, setGuardando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (guardando || sinCategorias || !nombre.trim()) return;

    const data: ProductoInput = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio),
      imagen: imagen.trim(),
      categoriaId: Number(categoriaId),
      activo,
      // Al editar no se envía el stock: se ajusta desde Inventario.
      ...(editando ? {} : { stock: Number(stock) }),
    };

    setGuardando(true);
    try {
      await onGuardar(data);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={enviar} className="card card-body mb-4">
      <h5>{editando ? "Editar producto" : "Nuevo producto"}</h5>

      {sinCategorias && (
        <div className="alert alert-warning">
          Primero crea una categoría en{" "}
          <Link to="/admin/categorias">Categorías</Link>.
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input
            className="form-control"
            value={nombre}
            maxLength={150}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            disabled={sinCategorias}
            required
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            rows={2}
            value={descripcion}
            maxLength={500}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Precio (S/)</label>
          <input
            type="number"
            min={0.01}
            max={99999999.99}
            step="0.01"
            className="form-control"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Stock</label>
          <input
            type="number"
            min={0}
            step={1}
            className="form-control"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            disabled={editando}
            required={!editando}
          />
          {editando && (
            <div className="form-text">
              El stock se ajusta desde Inventario.
            </div>
          )}
        </div>
        <div className="col-md-4">
          <label className="form-label">Imagen (URL o ruta)</label>
          <input
            className="form-control"
            value={imagen}
            maxLength={500}
            placeholder="/images/products/arroz.jpg"
            onChange={(e) => setImagen(e.target.value)}
          />
          <div className="form-text">
            Si la dejas vacía se usa una imagen por defecto.
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3 mt-3">
        <div className="form-check mb-0">
          <input
            id="producto-activo"
            type="checkbox"
            className="form-check-input"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="producto-activo">
            Activo en catálogo
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={guardando || sinCategorias}
        >
          {guardando ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancelar}
          disabled={guardando}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default ProductoForm;
