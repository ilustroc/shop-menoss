import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  afterEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest'

import Login from '../../pages/Login'

// Renderiza el Login real
function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

describe('Login', () => {

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Verifica la estructura principal
  test('debe mostrar el formulario de login', () => {
    renderLogin()

    expect(
      screen.getByRole('heading', { name: /iniciar sesión/i })
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(/correo electrónico/i)
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Contraseña')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /^iniciar sesión$/i })
    ).toBeInTheDocument()
  })

  // Valida correo obligatorio
  test('muestra error si el correo está vacío', async () => {
    const user = userEvent.setup()

    renderLogin()

    await user.click(
      screen.getByRole('button', { name: /^iniciar sesión$/i })
    )

    const alerta = screen.getByRole('alert')

    expect(alerta).toHaveTextContent(
      'Ingresa tu correo electrónico.'
    )
  })

  // Valida formato del correo
  test('muestra error si el correo es inválido', async () => {
    const user = userEvent.setup()

    renderLogin()

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'correo-invalido'
    )

    await user.type(
      screen.getByLabelText('Contraseña'),
      'Password123!'
    )

    await user.click(
      screen.getByRole('button', { name: /^iniciar sesión$/i })
    )

    const alerta = screen.getByRole('alert')

    expect(alerta).toHaveTextContent(
      'Ingresa un correo electrónico válido.'
    )
  })

  // Valida contraseña obligatoria
  test('muestra error si la contraseña está vacía', async () => {
    const user = userEvent.setup()

    renderLogin()

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'usuario@test.com'
    )

    await user.click(
      screen.getByRole('button', { name: /^iniciar sesión$/i })
    )

    const alerta = screen.getByRole('alert')

    expect(alerta).toHaveTextContent(
      'Ingresa tu contraseña.'
    )
  })

  // Verifica límites configurados
  test('debe limitar correo y contraseña según el formulario', () => {
    renderLogin()

    expect(
      screen.getByLabelText(/correo electrónico/i)
    ).toHaveAttribute('maxlength', '100')

    expect(
      screen.getByLabelText('Contraseña')
    ).toHaveAttribute('maxlength', '64')
  })

  // Verifica mostrar y ocultar contraseña
  test('debe permitir mostrar y ocultar la contraseña', async () => {
    const user = userEvent.setup()

    renderLogin()

    const password = screen.getByLabelText('Contraseña')

    expect(password).toHaveAttribute('type', 'password')

    await user.click(
      screen.getByRole('button', { name: 'Ver' })
    )

    expect(password).toHaveAttribute('type', 'text')

    await user.click(
      screen.getByRole('button', { name: 'Ocultar' })
    )

    expect(password).toHaveAttribute('type', 'password')
  })

  // Verifica que datos válidos no generen alerta
  test('no debe mostrar error con datos válidos', async () => {
    const user = userEvent.setup()

    vi.spyOn(console, 'log').mockImplementation(() => {})

    renderLogin()

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'usuario@test.com'
    )

    await user.type(
      screen.getByLabelText('Contraseña'),
      'Password123!'
    )

    await user.click(
      screen.getByRole('button', { name: /^iniciar sesión$/i })
    )

    expect(
      screen.queryByRole('alert')
    ).not.toBeInTheDocument()
  })

  // Seguridad: no debe exponer contraseñas
  test('no debe mostrar la contraseña en consola', async () => {
    const user = userEvent.setup()

    const consoleSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {})

    renderLogin()

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'usuario@test.com'
    )

    await user.type(
      screen.getByLabelText('Contraseña'),
      'Password123!'
    )

    await user.click(
      screen.getByRole('button', { name: /^iniciar sesión$/i })
    )

    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'Password123!',
      })
    )
  })
})