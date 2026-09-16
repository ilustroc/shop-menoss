import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="bg-light">
      <section className="container py-5">
        <div
          className="row justify-content-center align-items-center"
          style={{ minHeight: "65vh" }}
        >
          <div className="col-12 col-lg-9 col-xl-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="row g-0 align-items-stretch">
                {/* Información principal */}
                <div className="col-12 col-md-7">
                  <div className="card-body p-4 p-md-5">
                    <span
                      className="badge rounded-pill px-3 py-2 mb-3"
                      style={{
                        backgroundColor: "#fff4cc",
                        color: "#0d47a1",
                      }}
                    >
                      Error de navegación
                    </span>

                    <p
                      className="fw-bold text-primary mb-0"
                      style={{
                        fontSize: "clamp(5rem, 14vw, 9rem)",
                        lineHeight: 1,
                      }}
                    >
                      404
                    </p>

                    <h1 className="h2 fw-bold mt-3 mb-3">
                      Página no encontrada
                    </h1>

                    <p
                      className="text-secondary mb-4"
                      style={{ maxWidth: "520px" }}
                    >
                      No pudimos encontrar la página que estás buscando. Es
                      posible que la dirección sea incorrecta, que el contenido
                      haya cambiado de ubicación o que ya no esté disponible.
                    </p>

                    <div className="d-flex flex-column flex-sm-row gap-3">
                      <Link to="/" className="btn btn-primary px-4">
                        Volver al inicio
                      </Link>

                      <Link
                        to="/productos"
                        className="btn btn-outline-primary px-4"
                      >
                        Ver productos
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Panel lateral */}
                <div className="col-12 col-md-5 bg-primary">
                  <div className="h-100 d-flex flex-column justify-content-center align-items-center text-center p-4 p-md-5">
                    <img
                      src="/images/products/logo_menoss.jpeg"
                      alt="Shop Menoss"
                      className="img-fluid rounded-4 bg-white p-2 mb-4"
                      style={{
                        maxWidth: "180px",
                        maxHeight: "180px",
                        objectFit: "contain",
                      }}
                    />

                    <h2 className="h4 fw-bold text-white mb-2">Shop Menoss</h2>

                    <p className="text-white-50 mb-0">
                      Continúa explorando nuestra tienda y encuentra los
                      productos que necesitas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default NotFound;
