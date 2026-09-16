import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container py-5">
        <div className="row gy-4">
          {/* Marca */}
          <div className="col-12 col-md-6 col-lg-4">
            <Link
              to="/"
              className="d-inline-flex align-items-center gap-2 text-decoration-none mb-3"
            >
              <img
                src="/images/products/logo_menoss.jpeg"
                alt="Shop Menoss"
                height="45"
                className="rounded"
              />

              <span className="fs-5 fw-bold text-white">Shop Menoss</span>
            </Link>

            <p className="text-white-50 mb-0" style={{ maxWidth: "320px" }}>
              Tu tienda de abarrotes. Encuentra productos para tu hogar de forma
              rápida, sencilla y segura.
            </p>
          </div>

          {/* Navegación */}
          <div className="col-6 col-md-3 col-lg-2">
            <h2 className="h6 fw-bold mb-3">Navegación</h2>

            <nav className="d-flex flex-column gap-2">
              <Link className="text-white-50 text-decoration-none" to="/">
                Inicio
              </Link>

              <Link
                className="text-white-50 text-decoration-none"
                to="/productos"
              >
                Productos
              </Link>

              <Link
                className="text-white-50 text-decoration-none"
                to="/pedidos"
              >
                Mis pedidos
              </Link>

              <Link
                className="text-white-50 text-decoration-none"
                to="/carrito"
              >
                Carrito
              </Link>
            </nav>
          </div>

          {/* Ayuda */}
          <div className="col-6 col-md-3 col-lg-2">
            <h2 className="h6 fw-bold mb-3">Ayuda</h2>

            <nav className="d-flex flex-column gap-2">
              <Link
                className="text-white-50 text-decoration-none"
                to="/contacto"
              >
                Contáctanos
              </Link>

              <Link className="text-white-50 text-decoration-none" to="/login">
                Iniciar sesión
              </Link>

              <Link
                className="text-white-50 text-decoration-none"
                to="/registro"
              >
                Crear cuenta
              </Link>
            </nav>
          </div>

          {/* Contacto */}
          <div className="col-12 col-lg-4">
            <h2 className="h6 fw-bold mb-3">Atención al cliente</h2>

            <p className="text-white-50 mb-2">Lima, Perú</p>

            <p className="text-white-50 mb-3">
              Lunes a viernes
              <br />
              9:00 a. m. - 6:00 p. m.
            </p>

            <Link to="/contacto" className="btn btn-outline-light btn-sm px-3">
              Enviar una consulta
            </Link>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        {/* Parte inferior */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="text-white-50 small mb-0">
            © 2026 Shop Menoss. Todos los derechos reservados.
          </p>

          <p className="text-white-50 small mb-0">
            Compra fácil. Compra Menoss.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
