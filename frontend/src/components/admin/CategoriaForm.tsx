import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Categoria } from '../../types/categoria';

interface Props {
  inicial?: Categoria | null;
  onGuardar: (data: Omit<Categoria, 'id'>) => void;
  onCancelar: () => void;
}

function CategoriaForm({ inicial, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? '');

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    onGuardar({ nombre: nombre.trim(), descripcion: descripcion.trim() });
  };

  return (
    <form onSubmit={enviar} className="card card-body mb-4">
      <h5>{inicial ? 'Editar categoría' : 'Nueva categoría'}</h5>
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea className="form-control" rows={2} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">Guardar</button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  );
}

export default CategoriaForm;