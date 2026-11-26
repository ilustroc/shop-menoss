import { useState } from "react";
import type { FormEvent } from "react";
import type { Categoria, CategoriaRequest } from "../../types/categoria";

interface Props {
  inicial?: Categoria | null;
  onGuardar: (data: CategoriaRequest) => Promise<void>;
  onCancelar: () => void;
}

function CategoriaForm({ inicial, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? "");
  const [guardando, setGuardando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || guardando) return;

    setGuardando(true);
    try {
      await onGuardar({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={enviar} className="card card-body mb-4">
      <h5>{inicial ? "Editar categoría" : "Nueva categoría"}</h5>
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          className="form-control"
          value={nombre}
          maxLength={80}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          rows={2}
          value={descripcion}
          maxLength={255}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={guardando}>
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

export default CategoriaForm;
