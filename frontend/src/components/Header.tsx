import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="border-bottom bg-white shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container py-2">
          {/* Marca */}
          <Link
            className="navbar-brand d-flex align-items-center gap-2 me-lg-4"
            to="/"
          >
            <img
              src="/images/products/logo_menoss.png"
              alt="Shop Menoss"
              height="48"
              className="d-block"
            />

            <span className="fw-bold text-primary d-none d-sm-inline">
              Shop Menoss
            </span>
          </Link>

          {/* Menú responsive */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarShopMenoss"
            aria-controls="navbarShopMenoss"
            aria-expanded="false"
            aria-label="Abrir menú de navegación"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarShopMenoss">
            {/* Navegación principal */}
            <ul className="navbar-nav me-auto mb-3 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  end
                  to="/"
                  className={({ isActive }) =>
                    `nav-link px-lg-3 fw-medium ${
                      isActive ? "text-primary fw-semibold" : "text-dark"
                    }`
                  }
                >
                  Inicio
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/productos"
                  className={({ isActive }) =>
                    `nav-link px-lg-3 fw-medium ${
                      isActive ? "text-primary fw-semibold" : "text-dark"
                    }`
                  }
                >
                  Productos
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/pedidos"
                  className={({ isActive }) =>
                    `nav-link px-lg-3 fw-medium ${
                      isActive ? "text-primary fw-semibold" : "text-dark"
                    }`
                  }
                >
                  Mis pedidos
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/contacto"
                  className={({ isActive }) =>
                    `nav-link px-lg-3 fw-medium ${
                      isActive ? "text-primary fw-semibold" : "text-dark"
                    }`
                  }
                >
                  Contáctanos
                </NavLink>
              </li>
            </ul>

            {/* Acciones del usuario */}
            <div className="d-grid d-lg-flex gap-2">
              <Link className="btn btn-outline-primary btn-sm px-3" to="/login">
                Iniciar sesión
              </Link>

              <Link
                className="btn btn-outline-secondary btn-sm px-3"
                to="/registro"
              >
                Registrarse
              </Link>

              <Link className="btn btn-primary btn-sm px-3" to="/carrito">
                Carrito
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
