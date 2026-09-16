import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Register from "../../pages/Register";

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );
}

describe("Register", () => {
  // Verifica los campos principales
  test("debe mostrar el formulario de registro", () => {
    renderRegister();

    expect(
      screen.getByRole("heading", { name: /crear cuenta/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Apellido")).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar contraseña")).toBeInTheDocument();
  });

  // Valida longitud mínima del nombre
  test("debe mostrar error si el nombre es muy corto", async () => {
    const user = userEvent.setup();

    renderRegister();

    await user.type(screen.getByLabelText("Nombre"), "J");

    await user.click(screen.getByRole("button", { name: /^crear cuenta$/i }));

    expect(
      screen.getByText("El nombre debe tener entre 2 y 20 caracteres."),
    ).toBeInTheDocument();
  });

  // Valida formato del correo
  test("debe mostrar error si el correo es invalido", async () => {
    const user = userEvent.setup();

    renderRegister();

    await user.type(screen.getByLabelText("Nombre"), "Jesus");
    await user.type(screen.getByLabelText("Apellido"), "Garcia");
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "correo-invalido",
    );

    await user.click(screen.getByRole("button", { name: /^crear cuenta$/i }));

    expect(
      screen.getByText("Ingresa un correo electrónico válido."),
    ).toBeInTheDocument();
  });

  // Valida seguridad de contraseña
  test("debe mostrar error si la contraseña es debil", async () => {
    const user = userEvent.setup();

    renderRegister();

    await user.type(screen.getByLabelText("Nombre"), "Jesus");
    await user.type(screen.getByLabelText("Apellido"), "Garcia");
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "jesus@test.com",
    );
    await user.type(screen.getByLabelText("Contraseña"), "123456");

    await user.click(screen.getByRole("button", { name: /^crear cuenta$/i }));

    expect(
      screen.getByText(/la contraseña debe tener entre 8 y 64 caracteres/i),
    ).toBeInTheDocument();
  });

  // Valida confirmación de contraseña
  test("debe mostrar error si las contraseñas no coinciden", async () => {
    const user = userEvent.setup();

    renderRegister();

    await user.type(screen.getByLabelText("Nombre"), "Jesus");
    await user.type(screen.getByLabelText("Apellido"), "Garcia");
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "jesus@test.com",
    );
    await user.type(screen.getByLabelText("Contraseña"), "Password123!");
    await user.type(
      screen.getByLabelText("Confirmar contraseña"),
      "Password456!",
    );

    await user.click(screen.getByRole("button", { name: /^crear cuenta$/i }));

    expect(
      screen.getByText("Las contraseñas no coinciden."),
    ).toBeInTheDocument();
  });
});
