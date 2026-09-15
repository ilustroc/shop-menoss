import { Link, NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="border-bottom bg-white">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container py-2">

          {/* Logo */}
          <Link className="navbar-brand fw-bold fs-4" to="/">
            <img
              src="/images/products/logo_menoss.jpeg"
              alt="Shop Menoss"
              height="50"
            />
          </Link>

          {/* Botón hamburguesa */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarShopMenoss"
            aria-controls="navbarShopMenoss"
            aria-expanded="false"
            aria-label="Abrir menú de navegación"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navegación */}
          <div
            className="collapse navbar-collapse"
            id="navbarShopMenoss"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Inicio
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/productos">
                  Productos
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/pedidos">
                  Mis pedidos
                </NavLink>
              </li>

            </ul>

            {/* Acciones del usuario */}
            <div className="d-flex flex-column flex-lg-row gap-2">

              <Link
                className="btn btn-outline-primary btn-sm"
                to="/login"
              >
                Iniciar sesión
              </Link>

              <Link
                className="btn btn-outline-secondary btn-sm"
                to="/registro"
              >
                Registrarse
              </Link>

              <Link
                className="btn btn-primary btn-sm"
                to="/carrito"
              >
                Carrito
              </Link>

            </div>
          </div>

        </div>
      </nav>
    </header>
  )
}

export default Header