import { useState } from 'react'
import { Link } from 'react-router-dom'

function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')

  const validarCorreo = (valor: string) => {
    const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return expresion.test(valor)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')

    const correoLimpio = correo.trim().toLowerCase()

    if (!correoLimpio) {
      setError('Ingresa tu correo electrónico.')
      return
    }

    if (correoLimpio.length > 100) {
      setError('El correo no puede superar los 100 caracteres.')
      return
    }

    if (!validarCorreo(correoLimpio)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }

    if (!password) {
      setError('Ingresa tu contraseña.')
      return
    }

    if (password.length > 64) {
      setError('La contraseña no puede superar los 64 caracteres.')
      return
    }

    console.log({
      correo: correoLimpio,
      password,
    })

    // Más adelante enviaremos estos datos al backend.
  }

  return (
    <main className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">

                <div className="text-center mb-4">
                  <span
                    className="badge rounded-pill px-3 py-2 mb-3"
                    style={{
                      backgroundColor: '#fff4cc',
                      color: '#0d47a1',
                    }}
                  >
                    Shop Menoss
                  </span>

                  <h1 className="fw-bold text-primary mb-2">
                    Iniciar sesión
                  </h1>

                  <p className="text-secondary mb-0">
                    Ingresa a tu cuenta y continúa con tus compras.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>

                  <div className="mb-3">
                    <label
                      htmlFor="correo"
                      className="form-label fw-semibold"
                    >
                      Correo electrónico
                    </label>

                    <input
                      type="email"
                      id="correo"
                      className="form-control form-control-lg"
                      placeholder="ejemplo@correo.com"
                      value={correo}
                      maxLength={100}
                      onChange={(event) => setCorreo(event.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Contraseña
                    </label>

                    <div className="input-group">
                      <input
                        type={mostrarPassword ? 'text' : 'password'}
                        id="password"
                        className="form-control form-control-lg"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        maxLength={64}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setMostrarPassword(!mostrarPassword)
                        }
                      >
                        {mostrarPassword ? 'Ocultar' : 'Ver'}
                      </button>
                    </div>
                  </div>

                  <div className="text-end mb-4">
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none p-0 small"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  {error && (
                    <div
                      className="alert alert-danger py-2"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-semibold"
                  >
                    Iniciar sesión
                  </button>

                </form>

                <div className="d-flex align-items-center gap-3 my-4">
                  <hr className="flex-grow-1" />

                  <span className="text-secondary small">
                    ¿No tienes una cuenta?
                  </span>

                  <hr className="flex-grow-1" />
                </div>

                <Link
                  to="/registro"
                  className="btn btn-outline-primary w-100 fw-semibold"
                >
                  Regístrate
                </Link>

                <div className="row text-center mt-5 g-3">

                  <div className="col-4">
                    <div className="fw-bold text-primary">
                      ✓
                    </div>
                    <small className="text-secondary">
                      Compra segura
                    </small>
                  </div>

                  <div className="col-4">
                    <div className="fw-bold text-primary">
                      ✓
                    </div>
                    <small className="text-secondary">
                      Fácil acceso
                    </small>
                  </div>

                  <div className="col-4">
                    <div
                      className="fw-bold"
                      style={{ color: '#f4c430' }}
                    >
                      ★
                    </div>
                    <small className="text-secondary">
                      Mejores precios
                    </small>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}

export default Login