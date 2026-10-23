import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Producto } from '../../types/producto';
import type { Categoria } from '../../types/categoria';

interface Props {
  inicial?: Producto | null;
  categorias: Categoria[];
  onGuardar: (data: Omit<Producto, 'id'>) => void;
  onCancelar: () => void;
}

function ProductoForm({ inicial, categorias, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? '');
  const [precio, setPrecio] = useState(inicial?.precio ?? 0);
  const [stock, setStock] = useState(inicial?.stock ?? 0);
  const [imagen, setImagen] = useState(inicial?.imagen ?? '');
  const [categoria, setCategoria] = useState(inicial?.categoria ?? categorias[0]?.nombre ?? '');

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !categoria) return;
    onGuardar({ nombre: nombre.trim(), descripcion: descripcion.trim(), precio, stock, imagen: imagen.trim(), categoria });
  };

  return (
    <form onSubmit={enviar} className="card card-body mb-4">
      <h5>{inicial ? 'Editar producto' : 'Nuevo producto'}</h5>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Categoría</label>
          <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
            {categorias.map((c) => (
              <option key={c.id} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea className="form-control" rows={2} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Precio (S/)</label>
          <input type="number" min={0} step="0.01" className="form-control" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Stock</label>
          <input type="number" min={0} step={1} className="form-control" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Imagen (URL o ruta)</label>
          <input className="form-control" value={imagen} onChange={(e) => setImagen(e.target.value)} />
        </div>
      </div>
      <div className="d-flex gap-2 mt-3">
        <button type="submit" className="btn btn-primary">Guardar</button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  );
}

export default ProductoForm;