import { useState } from "react";

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const validarCorreo = (valor: string) => {
    const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresion.test(valor);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setExito("");

    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();
    const asuntoLimpio = asunto.trim();
    const mensajeLimpio = mensaje.trim();

    if (nombreLimpio.length < 2) {
      setError("Ingresa un nombre válido.");
      return;
    }

    if (!validarCorreo(correoLimpio)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    if (!asuntoLimpio) {
      setError("Ingresa el asunto de tu consulta.");
      return;
    }

    if (mensajeLimpio.length < 10) {
      setError("El mensaje debe tener al menos 10 caracteres.");
      return;
    }

    setExito(
      "Formulario validado correctamente. El envío se habilitará próximamente.",
    );
  };

  return (
    <main className="bg-light py-5">
      <div className="container">
        {/* Encabezado */}
        <div className="text-center mb-5">
          <span
            className="badge rounded-pill px-3 py-2 mb-3"
            style={{
              backgroundColor: "#fff4cc",
              color: "#0d47a1",
            }}
          >
            Shop Menoss
          </span>

          <h1 className="fw-bold text-primary mb-3">Contáctanos</h1>

          <p className="text-secondary mx-auto" style={{ maxWidth: "650px" }}>
            ¿Tienes alguna consulta sobre nuestros productos, pedidos o
            servicios? Completa el formulario y estaremos encantados de
            ayudarte.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Formulario */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4 p-md-5">
                <h2 className="h4 fw-bold mb-4">Envíanos un mensaje</h2>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label fw-semibold">
                      Nombre completo
                    </label>

                    <input
                      id="nombre"
                      type="text"
                      className="form-control"
                      placeholder="Ingresa tu nombre"
                      value={nombre}
                      maxLength={80}
                      onChange={(event) => setNombre(event.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="correo" className="form-label fw-semibold">
                      Correo electrónico
                    </label>

                    <input
                      id="correo"
                      type="email"
                      className="form-control"
                      placeholder="ejemplo@correo.com"
                      value={correo}
                      maxLength={100}
                      onChange={(event) => setCorreo(event.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="asunto" className="form-label fw-semibold">
                      Asunto
                    </label>

                    <input
                      id="asunto"
                      type="text"
                      className="form-control"
                      placeholder="Ej. Consulta sobre mi pedido"
                      value={asunto}
                      maxLength={100}
                      onChange={(event) => setAsunto(event.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="mensaje" className="form-label fw-semibold">
                      Mensaje
                    </label>

                    <textarea
                      id="mensaje"
                      className="form-control"
                      rows={6}
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                      value={mensaje}
                      maxLength={500}
                      onChange={(event) => setMensaje(event.target.value)}
                    />

                    <div className="form-text text-end">
                      {mensaje.length}/500
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  {exito && (
                    <div className="alert alert-success" role="status">
                      {exito}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-semibold"
                  >
                    Enviar mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4 p-md-5">
                <h2 className="h4 fw-bold mb-4">Información de contacto</h2>

                <div className="mb-4">
                  <h3 className="h6 fw-bold text-primary">Ubicación</h3>

                  <p className="text-secondary mb-0">Lima, Perú</p>
                </div>

                <div className="mb-4">
                  <h3 className="h6 fw-bold text-primary">
                    Atención al cliente
                  </h3>

                  <p className="text-secondary mb-0">
                    Nuestro equipo estará disponible para atender consultas
                    relacionadas con compras, productos y pedidos.
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="h6 fw-bold text-primary">
                    Horario de atención
                  </h3>

                  <p className="text-secondary mb-1">Lunes a viernes</p>

                  <p className="text-secondary mb-0">9:00 a. m. - 6:00 p. m.</p>
                </div>

                <div
                  className="rounded-4 p-4"
                  style={{
                    backgroundColor: "#fff4cc",
                  }}
                >
                  <h3 className="h6 fw-bold text-primary">
                    ¿Necesitas ayuda con un pedido?
                  </h3>

                  <p className="text-secondary small mb-0">
                    Indica el número de pedido en el asunto para que podamos
                    identificar tu consulta con mayor facilidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contacto;
