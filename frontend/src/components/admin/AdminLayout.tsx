import { NavLink, Outlet } from 'react-router-dom';

const enlaces = [
  { to: '/admin', texto: 'Dashboard', end: true },
  { to: '/admin/productos', texto: 'Productos', end: false },
  { to: '/admin/categorias', texto: 'Categorías', end: false },
  { to: '/admin/inventario', texto: 'Inventario', end: false },
  { to: '/admin/pedidos', texto: 'Pedidos', end: false },
];

function AdminLayout() {
  return (
    <div className="container-fluid">
      <div className="row">
        <aside className="col-12 col-md-3 col-lg-2 bg-dark text-white py-3 min-vh-100">
          <h5 className="px-3 mb-3">Panel Admin</h5>
          <nav className="nav flex-column">
            {enlaces.map((e) => (
              <NavLink
                key={e.to}
                to={e.to}
                end={e.end}
                className={({ isActive }) =>
                  'nav-link px-3 ' + (isActive ? 'bg-secondary text-white' : 'text-white-50')
                }
              >
                {e.texto}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="col-12 col-md-9 col-lg-10 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;