import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarProductos } from '../../services/productoService';
import { listarCategorias } from '../../services/categoriaService';
import { listarPedidos } from '../../services/pedidoAdminService';

function DashboardAdmin() {
  const [totales, setTotales] = useState({ productos: 0, categorias: 0, pendientes: 0, stockBajo: 0 });

  useEffect(() => {
    Promise.all([listarProductos(), listarCategorias(), listarPedidos()]).then(([prod, cat, ped]) => {
      setTotales({
        productos: prod.length,
        categorias: cat.length,
        pendientes: ped.filter((p) => p.estado === 'pendiente').length,
        stockBajo: prod.filter((p) => p.stock < 10).length,
      });
    });
  }, []);

  const tarjetas = [
    { titulo: 'Productos', valor: totales.productos, to: '/admin/productos', color: 'primary' },
    { titulo: 'Categorías', valor: totales.categorias, to: '/admin/categorias', color: 'success' },
    { titulo: 'Pedidos pendientes', valor: totales.pendientes, to: '/admin/pedidos', color: 'warning' },
    { titulo: 'Stock bajo (<10)', valor: totales.stockBajo, to: '/admin/inventario', color: 'danger' },
  ];

  return (
    <>
      <h2 className="mb-4">Dashboard</h2>
      <div className="row g-3">
        {tarjetas.map((t) => (
          <div className="col-12 col-sm-6 col-xl-3" key={t.titulo}>
            <Link to={t.to} className="text-decoration-none">
              <div className={`card border-${t.color} h-100`}>
                <div className="card-body">
                  <div className="text-muted">{t.titulo}</div>
                  <div className={`display-6 text-${t.color}`}>{t.valor}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default DashboardAdmin;