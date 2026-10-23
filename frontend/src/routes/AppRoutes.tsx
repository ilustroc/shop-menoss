import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Productos from "../pages/Productos";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Carrito from "../pages/Carrito";
import Pedidos from "../pages/Pedidos";
import PedidoDetalle from "../pages/PedidoDetalle";
import CheckoutPage from "../pages/CheckoutPage";
import NotFound from "../pages/NotFound";
import Contacto from "../pages/Contacto";

import AdminRoute from "./AdminRoute";
import AdminLayout from "../components/admin/AdminLayout";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import ProductosAdmin from "../pages/admin/ProductosAdmin";
import CategoriasAdmin from "../pages/admin/CategoriasAdmin";
import InventarioAdmin from "../pages/admin/InventarioAdmin";
import PedidosAdmin from "../pages/admin/PedidosAdmin";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/pedidos" element={<Pedidos />} />
      <Route path="/pedidos/:id" element={<PedidoDetalle />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/contacto" element={<Contacto />} />

      {/* Rutas de administrador */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="productos" element={<ProductosAdmin />} />
          <Route path="categorias" element={<CategoriasAdmin />} />
          <Route path="inventario" element={<InventarioAdmin />} />
          <Route path="pedidos" element={<PedidosAdmin />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;