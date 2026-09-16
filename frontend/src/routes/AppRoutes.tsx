import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Productos from '../pages/Productos';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Carrito from '../pages/Carrito';
import Pedidos from '../pages/Pedidos';
import PedidoDetalle from '../pages/PedidoDetalle';
import CheckoutPage from '../pages/CheckoutPage';
import NotFound from '../pages/NotFound';


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
      <Route path="*" element={<NotFound />} />
    </Routes>
  )

}

export default AppRoutes