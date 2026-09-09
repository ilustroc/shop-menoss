import { useState } from 'react'
import { Link } from 'react-router-dom'

function Register() {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const validarNombre = (valor: string) => {
    const expresion = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/
    return expresion.test(valor)
  }

  const validarCorreo = (valor: string) => {
    const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return expresion.test(valor)
  }

  const validarPassword = (valor: string) => {
    const tieneMayuscula = /[A-Z]/.test(valor)
    const tieneMinuscula = /[a-z]/.test(valor)
    const tieneNumero = /\d/.test(valor)
    const tieneEspecial = /[^A-Za-z0-9]/.test(valor)

    return (
      valor.length >= 8 &&
      valor.length <= 64 &&
      tieneMayuscula &&
      tieneMinuscula &&
      tieneNumero &&
      tieneEspecial
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')
    setMensaje('')

    const nombreLimpio = nombre.trim()
    const apellidoLimpio = apellido.trim()
    const correoLimpio = correo.trim().toLowerCase()

    if (nombreLimpio.length < 2 || nombreLimpio.length > 20) {
      setError('El nombre debe tener entre 2 y 20 caracteres.')
      return
    }

    if (!validarNombre(nombreLimpio)) {
      setError('El nombre solo puede contener letras y espacios.')
      return
    }

    if (apellidoLimpio.length < 2 || apellidoLimpio.length > 20) {
      setError('El apellido debe tener entre 2 y 20 caracteres.')
      return
    }

    if (!validarNombre(apellidoLimpio)) {
      setError('El apellido solo puede contener letras y espacios.')
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

    if (!validarPassword(password)) {
      setError(
        'La contraseña debe tener entre 8 y 64 caracteres e incluir mayúscula, minúscula, número y carácter especial.'
      )
      return
    }

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setMensaje('Formulario validado correctamente.')

    console.log({
      nombre: nombreLimpio,
      apellido: apellidoLimpio,
      correo: correoLimpio,
      password,
    })
  }

  return (
    <main className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-6">
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
                    Crear cuenta
                  </h1>

                  <p className="text-secondary mb-0">
                    Regístrate y empieza a disfrutar de nuestras ofertas.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>

                  <div className="row">

                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="nombre"
                        className="form-label fw-semibold"
                      >
                        Nombre
                      </label>

                      <input
                        type="text"
                        id="nombre"
                        className="form-control form-control-lg"
                        placeholder="Ingresa tu nombre"
                        value={nombre}
                        maxLength={20}
                        onChange={(event) => setNombre(event.target.value)}
                        required
                      />

                      <div className="form-text">
                        Entre 2 y 20 caracteres.
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="apellido"
                        className="form-label fw-semibold"
                      >
                        Apellido
                      </label>

                      <input
                        type="text"
                        id="apellido"
                        className="form-control form-control-lg"
                        placeholder="Ingresa tu apellido"
                        value={apellido}
                        maxLength={20}
                        onChange={(event) => setApellido(event.target.value)}
                        required
                      />

                      <div className="form-text">
                        Entre 2 y 20 caracteres.
                      </div>
                    </div>

                  </div>

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

                    <div className="form-text">
                      Usa un correo válido, por ejemplo usuario@correo.com.
                    </div>
                  </div>

                  <div className="mb-3">
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
                        placeholder="Crea una contraseña segura"
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

                    <div className="form-text">
                      Mínimo 8 caracteres, con mayúscula, minúscula,
                      número y carácter especial.
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="confirmarPassword"
                      className="form-label fw-semibold"
                    >
                      Confirmar contraseña
                    </label>

                    <input
                      type={mostrarPassword ? 'text' : 'password'}
                      id="confirmarPassword"
                      className="form-control form-control-lg"
                      placeholder="Repite tu contraseña"
                      value={confirmarPassword}
                      maxLength={64}
                      onChange={(event) =>
                        setConfirmarPassword(event.target.value)
                      }
                      required
                    />
                  </div>

                  {error && (
                    <div
                      className="alert alert-danger py-2"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  {mensaje && (
                    <div
                      className="alert alert-success py-2"
                      role="alert"
                    >
                      {mensaje}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-semibold"
                  >
                    Crear cuenta
                  </button>

                </form>

                <div className="d-flex align-items-center gap-3 my-4">
                  <hr className="flex-grow-1" />

                  <span className="text-secondary small">
                    ¿Ya tienes una cuenta?
                  </span>

                  <hr className="flex-grow-1" />
                </div>

                <Link
                  to="/login"
                  className="btn btn-outline-primary w-100 fw-semibold"
                >
                  Iniciar sesión
                </Link>

                <div className="row text-center mt-5 g-3">

                  <div className="col-4">
                    <div className="fw-bold text-primary">
                      ✓
                    </div>
                    <small className="text-secondary">
                      Registro rápido
                    </small>
                  </div>

                  <div className="col-4">
                    <div className="fw-bold text-primary">
                      ✓
                    </div>
                    <small className="text-secondary">
                      Compra segura
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
                      Mejores ofertas
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

export default Register