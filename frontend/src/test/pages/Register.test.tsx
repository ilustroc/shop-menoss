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

import Register from '../../pages/Register'

// Renderiza el Registro real
function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
}

// Completa los datos básicos válidos
async function completarDatosValidos(
  user: ReturnType<typeof userEvent.setup>
) {
  await user.type(
    screen.getByLabelText('Nombre'),
    'Jesus'
  )

  await user.type(
    screen.getByLabelText('Apellido'),
    'Garcia'
  )

  await user.type(
    screen.getByLabelText(/correo electrónico/i),
    'jesus@test.com'
  )
}

describe('Register', () => {

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Verifica la estructura principal
  test('debe mostrar el formulario de registro', () => {
    renderRegister()

    expect(
      screen.getByRole('heading', { name: /crear cuenta/i })
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Nombre')
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Apellido')
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(/correo electrónico/i)
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Contraseña')
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Confirmar contraseña')
    ).toBeInTheDocument()
  })

  // Valida longitud del nombre
  test('muestra error si el nombre es muy corto', async () => {
    const user = userEvent.setup()

    renderRegister()

    await user.type(
      screen.getByLabelText('Nombre'),
      'J'
    )

    await user.click(
      screen.getByRole('button', { name: /^crear cuenta$/i })
    )

    const alerta = screen.getByRole('alert')

    expect(alerta).toHaveTextContent(
      'El nombre debe tener entre 2 y 20 caracteres.'
    )
  })

  // Valida caracteres del nombre
  test('muestra error si el nombre contiene números', async () => {
    const user = userEvent.setup()

    renderRegister()

    await user.type(
      screen.getByLabelText('Nombre'),
      'Jesus123'
    )

    await user.click(
      screen.getByRole('button', { name: /^crear cuenta$/i })
    )

    const alerta = screen.getByRole('alert')

    expect(alerta).toHaveTextContent(
      'El nombre solo puede contener letras y espacios.'
    )
  })

  // Valida longitud del apellido
  test('muestra error si el apellido es muy corto', async () => {
    const user = userEvent.setup()

    renderRegister()

    await user.type(
      screen.getByLabelText('Nombre'),
      'Jesus'
    )

    await user.type(
      screen.getByLabelText('Apellido'),
      'G'
    )

    await user.click(
      screen.getByRole('button', { name: /^crear cuenta$/i })
    )

    const alerta = screen.getByRole('alert')

    expect(alerta).toHaveTextContent(
      'El apellido debe tener entre 2 y 20 caracteres.'
    )
  })

  // Valida caracteres del apellido
  test('muestra error si el apellido contiene números', async () => {
    const user = userEvent.setup()

    renderRegister()

    await user.type(
      screen.getByLabelText('Nombre'),
      'Jesus'
    )

    await user.type(
      screen.getByLabelText('Apellido'),
      'Garcia123'
    )

    await user.click(
      screen.getByRole('button', { name: /^crear cuenta$/i })
    )

    const alerta = screen.getByRole('alert')

    expect(alerta).toHaveTextContent(
      'El apellido solo puede contener letras y espacios.'
    )
  })

  // Valida formato del correo
  test('muestra error si el correo es inválido', async () => {
    const user = userEvent.setup()

    renderRegister()

    await user.type(
      screen.getByLabelText('Nombre'),
      'Jesus'
    )

    await user.type(
      screen.getByLabelText('Apellido'),
      'Garcia'
    )

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'correo-invalido'
    )

    await user.click(
      screen.getByRole('button', { name: /^crear cuenta$/i })
    )

    const alerta = screen.getByRole('alert')

    expect(alerta).toHaveTextContent(
      'Ingresa un correo electrónico válido.'
    )
  })

  // Valida seguridad de contraseña
  test('muestra error si la contraseña es débil', async () => {
    const user = userEvent.setup()

    renderRegister()

    await completarDatosValidos(user)

    await user.type(
      screen.getByLabelText('Contraseña'),
      '123456'
    )

    await user.click(
      screen.getByRole('button', { name: /^crear cuenta$/i })
    )

    const alerta = screen.getByRole('alert')

    expect(alerta).toHaveTextContent(
      /la contraseña debe tener entre 8 y 64 caracteres/i
    )
  })

  // Valida confirmación de contraseña
  test('muestra error si las contraseñas no coinciden', async () => {
    const user = userEvent.setup()

    renderRegister()

    await completarDatosValidos(user)

    await user.type(
      screen.getByLabelText('Contraseña'),
      'Password123!'
    )

    await user.type(
      screen.getByLabelText('Confirmar contraseña'),
      'Password456!'
    )

    await user.click(
      screen.getByRole('button', { name: /^crear cuenta$/i })
    )

    const alerta = screen.getByRole('alert')

    expect(alerta).toHaveTextContent(
      'Las contraseñas no coinciden.'
    )
  })

  // Verifica límites del formulario
  test('debe respetar los límites máximos configurados', () => {
    renderRegister()

    expect(
      screen.getByLabelText('Nombre')
    ).toHaveAttribute('maxlength', '20')

    expect(
      screen.getByLabelText('Apellido')
    ).toHaveAttribute('maxlength', '20')

    expect(
      screen.getByLabelText(/correo electrónico/i)
    ).toHaveAttribute('maxlength', '100')

    expect(
      screen.getByLabelText('Contraseña')
    ).toHaveAttribute('maxlength', '64')

    expect(
      screen.getByLabelText('Confirmar contraseña')
    ).toHaveAttribute('maxlength', '64')
  })

  // Verifica mostrar y ocultar passwords
  test('debe permitir mostrar y ocultar las contraseñas', async () => {
    const user = userEvent.setup()

    renderRegister()

    const password = screen.getByLabelText('Contraseña')
    const confirmar = screen.getByLabelText(
      'Confirmar contraseña'
    )

    expect(password).toHaveAttribute('type', 'password')
    expect(confirmar).toHaveAttribute('type', 'password')

    await user.click(
      screen.getByRole('button', { name: 'Ver' })
    )

    expect(password).toHaveAttribute('type', 'text')
    expect(confirmar).toHaveAttribute('type', 'text')

    await user.click(
      screen.getByRole('button', { name: 'Ocultar' })
    )

    expect(password).toHaveAttribute('type', 'password')
    expect(confirmar).toHaveAttribute('type', 'password')
  })

  // Valida registro correcto
  test('muestra mensaje de éxito con datos válidos', async () => {
    const user = userEvent.setup()

    vi.spyOn(console, 'log').mockImplementation(() => {})

    renderRegister()

    await completarDatosValidos(user)

    await user.type(
      screen.getByLabelText('Contraseña'),
      'Password123!'
    )

    await user.type(
      screen.getByLabelText('Confirmar contraseña'),
      'Password123!'
    )

    await user.click(
      screen.getByRole('button', { name: /^crear cuenta$/i })
    )

    expect(
      screen.getByText(
        'Formulario validado correctamente.'
      )
    ).toBeInTheDocument()
  })

  // Seguridad: no debe exponer contraseñas
  test('no debe mostrar la contraseña en consola', async () => {
    const user = userEvent.setup()

    const consoleSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {})

    renderRegister()

    await completarDatosValidos(user)

    await user.type(
      screen.getByLabelText('Contraseña'),
      'Password123!'
    )

    await user.type(
      screen.getByLabelText('Confirmar contraseña'),
      'Password123!'
    )

    await user.click(
      screen.getByRole('button', { name: /^crear cuenta$/i })
    )

    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'Password123!',
      })
    )
  })
})