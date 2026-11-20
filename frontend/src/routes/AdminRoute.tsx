import { Navigate, Outlet } from 'react-router-dom';

// TEMPORAL: cambiar por la verificación real del rol ADMINISTRADOR
// cuando esté lista la rama feature/authentication.
// Para probar el bloqueo, ponlo en false.
const ES_ADMIN = true;

function AdminRoute() {
  if (!ES_ADMIN) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default AdminRoute;