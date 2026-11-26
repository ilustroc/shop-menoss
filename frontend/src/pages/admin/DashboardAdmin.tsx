import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarProductos } from "../../services/productoService";
import { listarCategorias } from "../../services/categoriaService";
import { listarPedidos } from "../../services/pedidoAdminService";

function DashboardAdmin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const [totales, setTotales] = useState({
    productos: 0,
    categorias: 0,
    pendientes: 0,
    stockBajo: 0,
    pedidos: 0,
    ventas: 0,
  });

  useEffect(() => {
    Promise.all([listarProductos(), listarCategorias(), listarPedidos()])
      .then(([todos, cat, ped]) => {
        // Los productos desactivados no cuentan en el catálogo ni en el stock bajo.
        const prod = todos.filter((p) => p.activo !== false);
        setTotales({
          productos: prod.length,
          pedidos: ped.length,
          ventas: ped
            .filter((p) => p.estado !== "cancelado")
            .reduce((s, p) => s + p.total, 0),
          categorias: cat.length,
          pendientes: ped.filter((p) => p.estado === "pendiente").length,
          stockBajo: prod.filter((p) => p.stock <= 5).length,
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setBusy(false));
  }, []);

  const tarjetas = [
    {
      titulo: "Total pedidos",
      valor: totales.pedidos,
      to: "/admin/pedidos",
      color: "primary",
    },
    {
      titulo: "Importe de pedidos S/ (pago simulado)",
      valor: totales.ventas.toFixed(2),
      to: "/admin/pedidos",
      color: "primary",
    },
    {
      titulo: "Productos",
      valor: totales.productos,
      to: "/admin/productos",
      color: "primary",
    },
    {
      titulo: "Categorías",
      valor: totales.categorias,
      to: "/admin/categorias",
      color: "success",
    },
    {
      titulo: "Pedidos pendientes",
      valor: totales.pendientes,
      to: "/admin/pedidos",
      color: "warning",
    },
    {
      titulo: "Stock bajo (≤5)",
      valor: totales.stockBajo,
      to: "/admin/inventario",
      color: "danger",
    },
  ];

  return (
    <fieldset disabled={busy}>
      {busy && <p>Procesando…</p>}
      {error && (
        <div role="alert" className="alert alert-danger">
          {error}{" "}
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      )}
      <h2 className="mb-4">Dashboard</h2>
      {!busy && !error && (
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
      )}
    </fieldset>
  );
}

export default DashboardAdmin;
