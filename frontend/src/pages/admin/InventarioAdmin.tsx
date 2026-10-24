import { useEffect, useState } from 'react';
import type { Producto } from '../../types/producto';
import { listarProductos, ajustarStock } from '../../services/productoService';

const STOCK_BAJO = 10;

function InventarioAdmin() {
  const [productos, setProductos] = useState<Producto[]>([]);

  const cargar = async () => setProductos(await listarProductos());

  useEffect(() => {
    void listarProductos().then(setProductos);
  }, []);

  const ajustar = async (id: number, delta: number) => {
    await ajustarStock(id, delta);
    cargar();
  };

  return (
    <>
      <h2 className="mb-3">Inventario</h2>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Producto</th><th>Categoría</th>
              <th className="text-end">Stock</th><th>Estado</th>
              <th className="text-end">Ajustar</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td className="text-end">{p.stock}</td>
                <td>
                  {p.stock === 0 ? (
                    <span className="badge bg-danger">Agotado</span>
                  ) : p.stock < STOCK_BAJO ? (
                    <span className="badge bg-warning text-dark">Stock bajo</span>
                  ) : (
                    <span className="badge bg-success">Disponible</span>
                  )}
                </td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-secondary" onClick={() => ajustar(p.id, -10)}>-10</button>
                    <button className="btn btn-outline-secondary" onClick={() => ajustar(p.id, -1)}>-1</button>
                    <button className="btn btn-outline-secondary" onClick={() => ajustar(p.id, 1)}>+1</button>
                    <button className="btn btn-outline-secondary" onClick={() => ajustar(p.id, 10)}>+10</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default InventarioAdmin;