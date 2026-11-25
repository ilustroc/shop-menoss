import { Navigate, Outlet } from 'react-router-dom';
import { session } from '../services/session';

/** Protege compras e historial sin interferir con el catálogo ni el carrito local. */
export default function AuthRoute() {
  return session() ? <Outlet /> : <Navigate to="/login" replace />;
}
