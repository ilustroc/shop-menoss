import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      {/* Hero principal */}
      <section className="bg-light border-bottom">
        <div className="container py-5">
          <div className="row align-items-center g-5 py-lg-5">
            {/* Presentación */}
            <div className="col-12 col-lg-7">
              <span
                className="badge rounded-pill px-3 py-2 mb-3"
                style={{
                  backgroundColor: "#fff4cc",
                  color: "#0d47a1",
                }}
              >
                Tu tienda de confianza
              </span>

              <h1 className="display-4 fw-bold mb-3">
                Todo lo que necesitas
                <span className="text-primary"> en un solo lugar</span>
              </h1>

              <p
                className="lead text-secondary mb-4"
                style={{ maxWidth: "650px" }}
              >
                Encuentra productos para tu hogar de forma rápida, sencilla y
                segura en Shop Menoss.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link to="/productos" className="btn btn-primary btn-lg px-4">
                  Ver productos
                </Link>

                <Link
                  to="/registro"
                  className="btn btn-outline-primary btn-lg px-4"
                >
                  Crear cuenta
                </Link>
              </div>

              {/* Información rápida */}
              <div className="d-flex flex-wrap gap-4 mt-5">
                <div>
                  <p className="fw-bold mb-0">Compra fácil</p>

                  <small className="text-secondary">
                    Encuentra lo que necesitas
                  </small>
                </div>

                <div>
                  <p className="fw-bold mb-0">Compra segura</p>

                  <small className="text-secondary">
                    Proceso simple y confiable
                  </small>
                </div>

                <div>
                  <p className="fw-bold mb-0">Atención</p>

                  <small className="text-secondary">
                    Estamos para ayudarte
                  </small>
                </div>
              </div>
            </div>

            {/* Marca */}
            <div className="col-12 col-lg-5">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 p-md-5 text-center">
                  <img
                    src="/images/products/logo_menoss.jpeg"
                    alt="Shop Menoss"
                    className="img-fluid rounded-4 mb-4"
                    style={{
                      maxHeight: "260px",
                      objectFit: "contain",
                    }}
                  />

                  <h2 className="h4 fw-bold text-primary">Shop Menoss</h2>

                  <p className="text-secondary mb-0">Tu tienda de abarrotes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <span className="text-primary fw-semibold">
            ¿Por qué Shop Menoss?
          </span>

          <h2 className="fw-bold mt-2">Comprar puede ser más sencillo</h2>

          <p className="text-secondary mx-auto" style={{ maxWidth: "650px" }}>
            Queremos que encuentres los productos que necesitas rápidamente y
            puedas administrar tus compras desde un solo lugar.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-4 fw-bold fs-4"
                  style={{
                    width: "56px",
                    height: "56px",
                    backgroundColor: "#e7f1ff",
                    color: "#0d6efd",
                  }}
                >
                  1
                </div>

                <h3 className="h5 fw-bold">Encuentra tus productos</h3>

                <p className="text-secondary mb-0">
                  Revisa nuestro catálogo y encuentra productos para las
                  necesidades de tu hogar.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-4 fw-bold fs-4"
                  style={{
                    width: "56px",
                    height: "56px",
                    backgroundColor: "#e7f1ff",
                    color: "#0d6efd",
                  }}
                >
                  2
                </div>

                <h3 className="h5 fw-bold">Agrega a tu carrito</h3>

                <p className="text-secondary mb-0">
                  Organiza tus productos y cantidades antes de confirmar tu
                  compra.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-4 fw-bold fs-4"
                  style={{
                    width: "56px",
                    height: "56px",
                    backgroundColor: "#e7f1ff",
                    color: "#0d6efd",
                  }}
                >
                  3
                </div>

                <h3 className="h5 fw-bold">Revisa tus pedidos</h3>

                <p className="text-secondary mb-0">
                  Consulta tus pedidos y revisa la información relacionada con
                  tus compras.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-light border-top border-bottom">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <span className="text-primary fw-semibold">
                Compra en pocos pasos
              </span>

              <h2 className="fw-bold mt-2 mb-3">
                Una experiencia pensada para ser sencilla
              </h2>

              <p className="text-secondary mb-4">
                Desde buscar un producto hasta revisar tus pedidos, Shop Menoss
                centraliza el proceso para que comprar sea rápido y ordenado.
              </p>

              <Link to="/productos" className="btn btn-primary px-4">
                Explorar catálogo
              </Link>
            </div>

            <div className="col-12 col-lg-6">
              <div className="d-flex flex-column gap-3">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4 d-flex gap-3">
                    <span className="fw-bold text-primary fs-4">01</span>

                    <div>
                      <h3 className="h6 fw-bold mb-1">Explora</h3>

                      <p className="text-secondary mb-0">
                        Busca los productos disponibles en nuestra tienda.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4 d-flex gap-3">
                    <span className="fw-bold text-primary fs-4">02</span>

                    <div>
                      <h3 className="h6 fw-bold mb-1">Selecciona</h3>

                      <p className="text-secondary mb-0">
                        Agrega los productos y cantidades que necesites.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4 d-flex gap-3">
                    <span className="fw-bold text-primary fs-4">03</span>

                    <div>
                      <h3 className="h6 fw-bold mb-1">Compra</h3>

                      <p className="text-secondary mb-0">
                        Revisa tu carrito y continúa con el proceso de compra.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="container py-5">
        <div
          className="rounded-4 p-4 p-md-5 text-center"
          style={{
            backgroundColor: "#0d6efd",
          }}
        >
          <h2 className="fw-bold text-white mb-3">¿Listo para comenzar?</h2>

          <p
            className="text-white-50 mx-auto mb-4"
            style={{ maxWidth: "600px" }}
          >
            Explora nuestro catálogo y encuentra los productos que necesitas
            para tu hogar.
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Link
              to="/productos"
              className="btn btn-light btn-lg px-4 text-primary fw-semibold"
            >
              Ver productos
            </Link>

            <Link to="/registro" className="btn btn-outline-light btn-lg px-4">
              Registrarme
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
